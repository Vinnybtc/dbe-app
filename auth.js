// ============================================
// DBE Community App — Authentication
// LNURL-auth (primary) + Magic Link (fallback)
// ============================================

const Auth = (() => {
  let pollInterval = null;
  let currentK1 = null;

  // --- LNURL-auth ---

  async function startLnurlLogin() {
    const qrBox = document.getElementById('qr-code');
    qrBox.innerHTML = '<div style="color:#8B949E;font-size:13px;padding:20px">Laden...</div>';

    try {
      const res = await fetch('/api/auth/lnurl-challenge');
      if (!res.ok) throw new Error('Challenge request failed');
      const data = await res.json();

      currentK1 = data.k1;
      const lnurl = data.lnurl;

      // Render QR code
      qrBox.innerHTML = '';
      if (typeof qrcode !== 'undefined') {
        const qr = qrcode(0, 'M');
        qr.addData(lnurl.toUpperCase()); // LNURL is case-insensitive, uppercase for smaller QR
        qr.make();
        qrBox.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0 });
      } else {
        // Fallback: toon LNURL als tekst
        qrBox.innerHTML = `<div style="color:#000;font-size:8px;word-break:break-all;padding:8px">${lnurl}</div>`;
      }

      // Start polling voor sessie
      startPolling(currentK1);
    } catch (err) {
      console.error('LNURL challenge error:', err);
      qrBox.innerHTML = '<div style="color:#F85149;font-size:12px;padding:20px">QR laden mislukt. Gebruik e-mail login.</div>';
    }
  }

  function startPolling(k1) {
    stopPolling();
    pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/auth/lnurl-poll?k1=${k1}`);
        if (!res.ok) return;
        const data = await res.json();

        if (data.status === 'complete') {
          stopPolling();
          if (data.redirect_url) {
            // Supabase verify flow — redirect completes the auth
            window.location.href = data.redirect_url;
          } else if (data.access_token) {
            await App.supabase.auth.setSession({
              access_token: data.access_token,
              refresh_token: data.refresh_token
            });
          }
          // Auth state change handler in app.js doet de rest
        }
      } catch (err) {
        console.error('Poll error:', err);
      }
    }, 2000);
  }

  function stopPolling() {
    if (pollInterval) {
      clearInterval(pollInterval);
      pollInterval = null;
    }
  }

  // --- Magic Link ---

  async function sendMagicLink(email) {
    const { error } = await App.supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });

    if (error) throw error;
  }

  // --- Init ---

  function init() {
    // Magic link form
    const form = document.getElementById('magic-link-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('magic-email').value.trim();
      if (!email) return;

      const btn = form.querySelector('button');
      btn.disabled = true;
      btn.textContent = 'Versturen...';

      try {
        await sendMagicLink(email);
        form.style.display = 'none';
        document.getElementById('magic-link-sent').style.display = 'block';
        App.showToast('Check je inbox!', 'success');
      } catch (err) {
        App.showToast('Fout: ' + err.message, 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Inloggen met e-mail';
      }
    });

    // Start LNURL login
    startLnurlLogin();
  }

  return { init, startLnurlLogin, stopPolling };
})();
