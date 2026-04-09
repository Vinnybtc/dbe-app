// LNURL-auth Challenge Generator
// GET /api/auth/lnurl-challenge
// Generates k1 challenge, stores in KV, returns LNURL

import { bech32 } from '@scure/base';

export async function onRequestGet(context) {
  const { env } = context;

  try {
    // Generate random 32-byte k1
    const k1Bytes = new Uint8Array(32);
    crypto.getRandomValues(k1Bytes);
    const k1 = Array.from(k1Bytes).map(b => b.toString(16).padStart(2, '0')).join('');

    // Store in KV with 5-minute TTL
    await env.AUTH_KV.put(k1, JSON.stringify({ status: 'pending' }), { expirationTtl: 300 });

    // Build callback URL
    const callbackUrl = new URL('/api/auth/lnurl-verify', context.request.url);
    callbackUrl.searchParams.set('tag', 'login');
    callbackUrl.searchParams.set('k1', k1);
    callbackUrl.searchParams.set('action', 'login');

    // Encode as LNURL (bech32)
    const encoder = new TextEncoder();
    const urlBytes = encoder.encode(callbackUrl.toString());
    const words = bech32.toWords(urlBytes);
    const lnurl = bech32.encode('lnurl', words, 1500);

    return new Response(JSON.stringify({ k1, lnurl }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
