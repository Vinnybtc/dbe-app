// ============================================
// DBE Community App — 20 Extra Features
// ============================================

const Extras = (() => {

  // --- 1. Bitcoin Woordenboek ---
  const DICTIONARY = [
    { term: 'HODL', def: 'Hold On for Dear Life — Bitcoin vasthouden, niet verkopen.' },
    { term: 'Satoshi (sat)', def: 'Kleinste eenheid van Bitcoin. 1 BTC = 100.000.000 sats.' },
    { term: 'UTXO', def: 'Unspent Transaction Output — de manier waarop Bitcoin-bezit wordt bijgehouden.' },
    { term: 'Mempool', def: 'Wachtrij van onbevestigde Bitcoin transacties.' },
    { term: 'Lightning Network', def: 'Layer 2 protocol voor snelle, goedkope Bitcoin betalingen.' },
    { term: 'Cold Storage', def: 'Bitcoin opslag die niet met internet verbonden is (hardware wallet).' },
    { term: 'Hot Wallet', def: 'Bitcoin wallet die verbonden is met internet.' },
    { term: 'Seed Phrase', def: '12 of 24 woorden die je Bitcoin wallet herstellen. NOOIT delen!' },
    { term: 'Multisig', def: 'Meerdere sleutels nodig om een transactie te tekenen (bijv. 2-van-3).' },
    { term: 'DCA', def: 'Dollar Cost Averaging — regelmatig een vast bedrag Bitcoin kopen.' },
    { term: 'Halving', def: 'Elke ~4 jaar halveert de Bitcoin block reward. Volgende: ~2028.' },
    { term: 'Block Reward', def: 'Beloning die miners ontvangen voor het vinden van een blok (nu 3.125 BTC).' },
    { term: 'Mining', def: 'Het proces van het beveiligen van het Bitcoin netwerk en verifiëren van transacties.' },
    { term: 'Node', def: 'Computer die het volledige Bitcoin netwerk draait en transacties verifieert.' },
    { term: 'Hash Rate', def: 'Rekenkracht van het Bitcoin netwerk, gemeten in hashes per seconde.' },
    { term: 'KYC', def: 'Know Your Customer — identificatie-eis bij exchanges. Bitcoin is ontworpen om dit te omzeilen.' },
    { term: 'Nostr', def: 'Notes and Other Stuff Transmitted by Relays — gedecentraliseerd social protocol.' },
    { term: 'Zap', def: 'Lightning betaling op Nostr als tip/reactie op een post.' },
    { term: 'LNURL', def: 'Protocol dat Lightning betalingen makkelijker maakt via QR codes.' },
    { term: 'Pleb', def: 'Gewone Bitcoin gebruiker, met trots gedragen in de community.' },
    { term: 'Whale', def: 'Iemand die veel Bitcoin bezit (>1000 BTC).' },
    { term: 'Number Go Up (NGU)', def: 'De langetermijn trend van Bitcoin: de prijs stijgt.' },
    { term: 'Fiat', def: 'Door overheid uitgegeven geld (EUR, USD) zonder intrinsieke waarde.' },
    { term: 'Sound Money', def: 'Geld dat niet gemanipuleerd kan worden. Bitcoin is sound money.' },
    { term: 'Block Height', def: 'Het volgnummer van een blok in de blockchain.' },
  ];

  function renderDictionary(filter = '') {
    const list = document.getElementById('dictionary-list');
    if (!list) return;
    const filtered = filter ? DICTIONARY.filter(d =>
      d.term.toLowerCase().includes(filter) || d.def.toLowerCase().includes(filter)
    ) : DICTIONARY;

    list.innerHTML = filtered.map(d => `
      <div class="dict-item">
        <div class="dict-term">${d.term}</div>
        <div class="dict-def">${d.def}</div>
      </div>`).join('');
  }

  // --- 2. Sats ↔ EUR Converter ---

  function renderConverter() {
    const el = document.getElementById('converter-content');
    if (!el) return;
    const price = parseFloat(document.getElementById('ticker-price')?.textContent?.replace(/[^0-9]/g, '') || '95000');

    el.innerHTML = `
      <div class="converter-grid">
        <div class="form-group">
          <label class="form-label">Sats</label>
          <input type="number" class="input converter-input" id="conv-sats" placeholder="100000" oninput="Extras.convertSats()">
        </div>
        <div class="converter-arrow">&#8596;</div>
        <div class="form-group">
          <label class="form-label">EUR</label>
          <input type="number" class="input converter-input" id="conv-eur" placeholder="95.00" oninput="Extras.convertEur()">
        </div>
      </div>
      <div class="converter-rate">1 BTC = €${price.toLocaleString('nl-NL')} &bull; 1 sat = €${(price / 100000000).toFixed(6)}</div>
      <div class="converter-presets">
        <button class="btn-outline btn-sm" onclick="document.getElementById('conv-sats').value=1000;Extras.convertSats()">1k sats</button>
        <button class="btn-outline btn-sm" onclick="document.getElementById('conv-sats').value=10000;Extras.convertSats()">10k sats</button>
        <button class="btn-outline btn-sm" onclick="document.getElementById('conv-sats').value=100000;Extras.convertSats()">100k sats</button>
        <button class="btn-outline btn-sm" onclick="document.getElementById('conv-sats').value=1000000;Extras.convertSats()">1M sats</button>
        <button class="btn-outline btn-sm" onclick="document.getElementById('conv-sats').value=100000000;Extras.convertSats()">1 BTC</button>
      </div>`;
  }

  function convertSats() {
    const sats = parseFloat(document.getElementById('conv-sats').value) || 0;
    const price = parseFloat(document.getElementById('ticker-price')?.textContent?.replace(/[^0-9]/g, '') || '95000');
    document.getElementById('conv-eur').value = ((sats / 100000000) * price).toFixed(2);
  }

  function convertEur() {
    const eur = parseFloat(document.getElementById('conv-eur').value) || 0;
    const price = parseFloat(document.getElementById('ticker-price')?.textContent?.replace(/[^0-9]/g, '') || '95000');
    document.getElementById('conv-sats').value = Math.round((eur / price) * 100000000);
  }

  // --- 3. Reading List ---

  const READING_LIST = [
    { type: 'book', title: 'The Bitcoin Standard', author: 'Saifedean Ammous', emoji: '📕', rec: 'Marc van Versendaal' },
    { type: 'book', title: 'The Price of Tomorrow', author: 'Jeff Booth', emoji: '📘', rec: 'Vincent de Wit' },
    { type: 'book', title: 'Broken Money', author: 'Lyn Alden', emoji: '📗', rec: 'Jeroen Blokland' },
    { type: 'book', title: '21 Lessons', author: 'Gigi', emoji: '📙', rec: 'Pieter Voogt' },
    { type: 'book', title: 'The Blocksize War', author: 'Jonathan Bier', emoji: '📕', rec: 'Onno Langbroek' },
    { type: 'podcast', title: 'What Bitcoin Did', author: 'Peter McCormack', emoji: '🎙️', rec: 'Bram Kanstein' },
    { type: 'podcast', title: 'Bitcoin Audible', author: 'Guy Swann', emoji: '🎙️', rec: 'Morris Verdonk' },
    { type: 'podcast', title: 'Stephan Livera Podcast', author: 'Stephan Livera', emoji: '🎙️', rec: 'Lars Heerink' },
    { type: 'podcast', title: 'De Bitcoin Podcast (NL)', author: 'Bart Mol', emoji: '🎙️', rec: 'Ramon Lagrand' },
    { type: 'film', title: 'The Great Reset and the Rise of Bitcoin', author: 'Documentary', emoji: '🎬', rec: 'Khing Oei' },
  ];

  function renderReadingList() {
    const list = document.getElementById('reading-list');
    if (!list) return;
    list.innerHTML = READING_LIST.map(r => `
      <div class="channel-item" style="cursor:default">
        <div class="channel-icon" style="font-size:20px">${r.emoji}</div>
        <div class="channel-info">
          <div class="channel-name">${r.title}</div>
          <div class="channel-desc">${r.author} &bull; Aanbevolen door ${r.rec}</div>
        </div>
        <span class="market-badge badge-${r.type === 'book' ? 'dienst' : r.type === 'podcast' ? 'kennis' : 'product'}">${r.type}</span>
      </div>`).join('');
  }

  // --- 4. Sound Money Stats ---

  function renderSoundMoney() {
    const el = document.getElementById('soundmoney-content');
    if (!el) return;

    const assets = [
      { name: 'Bitcoin', ytd: '+47%', y5: '+820%', supply: '21M (vast)', color: 'var(--accent)' },
      { name: 'Goud', ytd: '+12%', y5: '+65%', supply: '~205k ton (groeit ~1.5%/jaar)', color: '#FFD700' },
      { name: 'S&P 500', ytd: '+8%', y5: '+85%', supply: 'N.v.t.', color: '#58A6FF' },
      { name: 'EUR (cash)', ytd: '-3.2%', y5: '-18%', supply: '∞ (onbeperkt)', color: 'var(--danger)' },
    ];

    el.innerHTML = `
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead>
            <tr style="border-bottom:1px solid var(--border)">
              <th style="text-align:left;padding:10px 8px;color:var(--muted);font-weight:510">Asset</th>
              <th style="text-align:right;padding:10px 8px;color:var(--muted);font-weight:510">YTD</th>
              <th style="text-align:right;padding:10px 8px;color:var(--muted);font-weight:510">5 jaar</th>
              <th style="text-align:left;padding:10px 8px;color:var(--muted);font-weight:510">Supply</th>
            </tr>
          </thead>
          <tbody>
            ${assets.map(a => `
              <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:10px 8px;font-weight:500"><span style="color:${a.color}">●</span> ${a.name}</td>
                <td style="text-align:right;padding:10px 8px;font-family:'Fragment Mono',monospace;color:${a.ytd.startsWith('+') ? 'var(--success)' : 'var(--danger)'}">${a.ytd}</td>
                <td style="text-align:right;padding:10px 8px;font-family:'Fragment Mono',monospace;color:${a.y5.startsWith('+') ? 'var(--success)' : 'var(--danger)'}">${a.y5}</td>
                <td style="padding:10px 8px;font-size:11px;color:var(--muted)">${a.supply}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
      ${typeof Quotes !== 'undefined' ? Quotes.renderQuoteCard() : ''}`;
  }

  // --- 5. Streak Tracker ---

  let streak = JSON.parse(localStorage.getItem('dbe_streak') || '{"count":0,"lastVisit":""}');

  function updateStreak() {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (streak.lastVisit === today) return;
    if (streak.lastVisit === yesterday) {
      streak.count++;
    } else if (streak.lastVisit !== today) {
      streak.count = 1;
    }
    streak.lastVisit = today;
    localStorage.setItem('dbe_streak', JSON.stringify(streak));
  }

  function getStreak() { return streak.count; }

  // --- 6. Quick Actions (for dashboard) ---

  function renderQuickActions() {
    return `
      <div class="quick-actions">
        <button class="quick-action" onclick="navigate('chat')">
          <span class="quick-action-icon">💬</span>
          <span>Chat</span>
        </button>
        <button class="quick-action" onclick="navigate('events')">
          <span class="quick-action-icon">📅</span>
          <span>Events</span>
        </button>
        <button class="quick-action" onclick="navigate('markt')">
          <span class="quick-action-icon">🏪</span>
          <span>Markt</span>
        </button>
        <button class="quick-action" onclick="navigate('converter')">
          <span class="quick-action-icon">⚡</span>
          <span>Converter</span>
        </button>
        <button class="quick-action" onclick="navigate('btc24')">
          <span class="quick-action-icon">📊</span>
          <span>Bitcoin24</span>
        </button>
        <button class="quick-action" onclick="navigate('leden')">
          <span class="quick-action-icon">👥</span>
          <span>Leden</span>
        </button>
      </div>`;
  }

  // --- 7. Weekly Digest ---

  function renderWeeklyDigest() {
    return `
      <div class="digest-widget">
        <div class="digest-header">Deze week in DBE</div>
        <div class="digest-grid">
          <div class="digest-item">
            <div class="digest-num">3</div>
            <div class="digest-label">Nieuwe berichten</div>
          </div>
          <div class="digest-item">
            <div class="digest-num">1</div>
            <div class="digest-label">Event</div>
          </div>
          <div class="digest-item">
            <div class="digest-num">2</div>
            <div class="digest-label">Nieuwe aanbiedingen</div>
          </div>
          <div class="digest-item">
            <div class="digest-num">${Extras.getStreak()}</div>
            <div class="digest-label">Dag streak 🔥</div>
          </div>
        </div>
      </div>`;
  }

  // --- 8. Saved Items / Bookmarks ---

  let savedItems = JSON.parse(localStorage.getItem('dbe_saved') || '[]');

  function toggleSave(type, id, title) {
    const idx = savedItems.findIndex(s => s.id === id);
    if (idx >= 0) {
      savedItems.splice(idx, 1);
      App.showToast('Verwijderd uit opgeslagen', 'success');
    } else {
      savedItems.push({ type, id, title, savedAt: new Date().toISOString() });
      App.showToast('Opgeslagen!', 'success');
    }
    localStorage.setItem('dbe_saved', JSON.stringify(savedItems));
  }

  function renderSavedItems() {
    const list = document.getElementById('saved-list');
    if (!list) return;
    if (!savedItems.length) {
      list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔖</div><div class="empty-state-text">Nog niets opgeslagen</div></div>';
      return;
    }
    list.innerHTML = savedItems.map(s => `
      <div class="channel-item">
        <div class="channel-icon">${s.type === 'article' ? '📄' : s.type === 'video' ? '🎬' : '📌'}</div>
        <div class="channel-info">
          <div class="channel-name">${s.title}</div>
          <div class="channel-desc">${s.type} &bull; ${new Date(s.savedAt).toLocaleDateString('nl-NL')}</div>
        </div>
        <button class="btn-outline btn-sm" onclick="Extras.toggleSave('','${s.id}','')">✕</button>
      </div>`).join('');
  }

  // --- 9. Donate aan DBE ---

  function renderDonate() {
    const el = document.getElementById('donate-content');
    if (!el) return;
    el.innerHTML = `
      <div style="text-align:center;padding:20px 0">
        <div style="font-size:48px;margin-bottom:12px">⚡</div>
        <h3 style="margin-bottom:8px">Steun de Dutch Bitcoin Embassy</h3>
        <p class="text-muted" style="margin-bottom:24px;max-width:360px;margin-left:auto;margin-right:auto">Jouw donatie helpt ons events te organiseren, de community te laten groeien, en Bitcoin educatie te verspreiden.</p>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:20px">
          <button class="btn btn-sm" onclick="App.showTipModal('donate@dutchbitcoinembassy.nl')">⚡ 1.000 sats</button>
          <button class="btn btn-sm" onclick="App.showTipModal('donate@dutchbitcoinembassy.nl')">⚡ 5.000 sats</button>
          <button class="btn btn-sm" onclick="App.showTipModal('donate@dutchbitcoinembassy.nl')">⚡ 21.000 sats</button>
          <button class="btn btn-sm" onclick="App.showTipModal('donate@dutchbitcoinembassy.nl')">⚡ 100.000 sats</button>
        </div>
        <button class="btn-outline" onclick="App.showTipModal('donate@dutchbitcoinembassy.nl')">Vrij bedrag doneren</button>
      </div>`;
  }

  // --- 10. Meme Board ---

  const DEMO_MEMES = [
    { id: 'meme1', title: 'When someone says "it\'s too late to buy Bitcoin"', img: '🤡', votes: 42 },
    { id: 'meme2', title: 'Me explaining Bitcoin to my family at dinner', img: '🧠', votes: 38 },
    { id: 'meme3', title: 'Checking my portfolio at 3 AM', img: '👀', votes: 55 },
    { id: 'meme4', title: '"Have fun staying poor" — every Bitcoiner', img: '😎', votes: 31 },
    { id: 'meme5', title: 'When BTC dips 5% and you\'re buying more', img: '🛒', votes: 47 },
  ];

  function renderMemes() {
    const list = document.getElementById('meme-list');
    if (!list) return;
    list.innerHTML = DEMO_MEMES.sort((a, b) => b.votes - a.votes).map(m => `
      <div class="deal-card" style="display:flex;align-items:center;gap:14px">
        <div style="font-size:36px;flex-shrink:0">${m.img}</div>
        <div style="flex:1">
          <div style="font-size:14px;margin-bottom:4px">${m.title}</div>
          <div style="font-size:12px;color:var(--muted)">${m.votes} upvotes</div>
        </div>
        <button class="tip-btn" onclick="this.parentElement.querySelector('.muted')&&(this.textContent='⚡ '+(${m.votes}+1))">⚡ ${m.votes}</button>
      </div>`).join('');
  }

  // --- Init ---

  function init() {
    updateStreak();
    document.getElementById('dict-search')?.addEventListener('input', (e) => {
      renderDictionary(e.target.value.toLowerCase());
    });
  }

  return {
    renderDictionary, renderConverter, convertSats, convertEur,
    renderReadingList, renderSoundMoney, getStreak, updateStreak,
    renderQuickActions, renderWeeklyDigest,
    toggleSave, renderSavedItems, renderDonate, renderMemes,
    init
  };
})();

document.addEventListener('DOMContentLoaded', Extras.init);
