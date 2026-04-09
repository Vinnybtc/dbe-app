// LNURL-auth Verification
// GET /api/auth/lnurl-verify?k1=...&sig=...&key=...
// Called by the Lightning wallet after user scans QR

import { secp256k1 } from '@noble/curves/secp256k1';
import { createClient } from '@supabase/supabase-js';

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);

  const k1 = url.searchParams.get('k1');
  const sig = url.searchParams.get('sig');
  const key = url.searchParams.get('key');

  // Validate params
  if (!k1 || !sig || !key) {
    return lnurlResponse('ERROR', 'Missing parameters');
  }

  try {
    // Check k1 exists in KV and is pending
    const stored = await env.AUTH_KV.get(k1);
    if (!stored) {
      return lnurlResponse('ERROR', 'Challenge expired or invalid');
    }

    const data = JSON.parse(stored);
    if (data.status !== 'pending') {
      return lnurlResponse('ERROR', 'Challenge already used');
    }

    // Verify secp256k1 signature
    const k1Bytes = hexToBytes(k1);
    const sigBytes = hexToBytes(sig);
    const keyBytes = hexToBytes(key);

    const isValid = secp256k1.verify(sigBytes, k1Bytes, keyBytes);
    if (!isValid) {
      return lnurlResponse('ERROR', 'Invalid signature');
    }

    // Signature valid! Create or find user in Supabase
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Check if user with this pubkey exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('lnurl_pubkey', key)
      .single();

    let userId;

    if (existingProfile) {
      userId = existingProfile.id;
    } else {
      // Create new auth user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: `${key.substring(0, 16)}@lnurl.dbe.local`,
        email_confirm: true,
        user_metadata: { lnurl_pubkey: key, auth_method: 'lnurl' }
      });

      if (createError) {
        return lnurlResponse('ERROR', 'User creation failed: ' + createError.message);
      }

      userId = newUser.user.id;

      // Set lnurl_pubkey on profile (trigger creates profile automatically)
      await supabase
        .from('profiles')
        .update({ lnurl_pubkey: key })
        .eq('id', userId);
    }

    // Generate session tokens
    // We use the admin API to generate a magic link, then extract the token
    // Alternative: use custom JWT signing
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: `${key.substring(0, 16)}@lnurl.dbe.local`
    });

    if (sessionError) {
      return lnurlResponse('ERROR', 'Session generation failed');
    }

    // Extract the token from the generated link
    const linkUrl = new URL(sessionData.properties.hashed_token ?
      `${env.SUPABASE_URL}/auth/v1/verify?token=${sessionData.properties.hashed_token}&type=magiclink` :
      sessionData.properties.action_link);

    // Verify the OTP to get actual session tokens
    const { data: verifyData, error: verifyError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: `${key.substring(0, 16)}@lnurl.dbe.local`,
      options: { data: { lnurl_pubkey: key } }
    });

    // Store session info for polling
    // The frontend will verify the OTP token to get real session
    await env.AUTH_KV.put(k1, JSON.stringify({
      status: 'complete',
      user_id: userId,
      token_hash: sessionData.properties.hashed_token,
      email: `${key.substring(0, 16)}@lnurl.dbe.local`
    }), { expirationTtl: 300 });

    return lnurlResponse('OK');

  } catch (err) {
    console.error('LNURL verify error:', err);
    return lnurlResponse('ERROR', err.message);
  }
}

function lnurlResponse(status, reason) {
  const body = { status };
  if (reason) body.reason = reason;
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' }
  });
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}
