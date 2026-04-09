// LNURL-auth Session Polling
// GET /api/auth/lnurl-poll?k1=...
// Frontend polls this every 2 seconds to check if wallet has authenticated

import { createClient } from '@supabase/supabase-js';

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const k1 = url.searchParams.get('k1');

  if (!k1) {
    return jsonResponse({ status: 'error', reason: 'Missing k1' }, 400);
  }

  try {
    const stored = await env.AUTH_KV.get(k1);
    if (!stored) {
      return jsonResponse({ status: 'expired' });
    }

    const data = JSON.parse(stored);

    if (data.status === 'pending') {
      return jsonResponse({ status: 'pending' });
    }

    if (data.status === 'complete') {
      // Generate actual Supabase session for the user
      const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false }
      });

      // Use verifyOtp with token_hash to create a real session
      // Since we have admin access, we can sign in on behalf of the user
      const { data: signInData, error } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: data.email
      });

      if (error || !signInData) {
        return jsonResponse({ status: 'error', reason: 'Session creation failed' });
      }

      // Delete KV entry (one-time use)
      await env.AUTH_KV.delete(k1);

      return jsonResponse({
        status: 'complete',
        token_hash: signInData.properties.hashed_token,
        email: data.email,
        redirect_url: `${env.SUPABASE_URL}/auth/v1/verify?token=${signInData.properties.hashed_token}&type=magiclink&redirect_to=${new URL('/', request.url).origin}`
      });
    }

    return jsonResponse({ status: 'unknown' });

  } catch (err) {
    console.error('Poll error:', err);
    return jsonResponse({ status: 'error', reason: err.message }, 500);
  }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
