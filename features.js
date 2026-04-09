// ============================================
// DBE Community App — Extra Features
// Prijsalerts, Vergaderplanner, Bounties, Notulen,
// Portefeuille, Referrals, Challenges, Kaart,
// Event Feedback, Whale Alert, Bitcoin24 Calculator
// ============================================

const Features = (() => {

  // --- 1. Bitcoin Prijsalerts ---

  const DEMO_ALERTS = [
    { id: 'a1', direction: 'below', price_eur: 75000, is_active: true },
    { id: 'a2', direction: 'above', price_eur: 150000, is_active: true },
  ];

  function renderAlerts() {
    const list = document.getElementById('alerts-list');
    if (!list) return;
    list.innerHTML = DEMO_ALERTS.map(a => `
      <div class="channel-item" style="cursor:default">
        <div class="channel-icon" style="background:${a.direction === 'above' ? 'var(--success-dim)' : 'var(--danger-dim)'}; color:${a.direction === 'above' ? 'var(--success)' : 'var(--danger)'}">
          ${a.direction === 'above' ? '&#8593;' : '&#8595;'}
        </div>
        <div class="channel-info">
          <div class="channel-name">${a.direction === 'above' ? 'Boven' : 'Onder'} €${a.price_eur.toLocaleString('nl-NL')}</div>
          <div class="channel-desc">${a.is_active ? 'Actief' : 'Afgegaan'}</div>
        </div>
        <button class="btn-outline btn-sm" onclick="Features.removeAlert('${a.id}')">&#10005;</button>
      </div>`).join('') || '<p class="text-muted" style="font-size:13px">Geen alerts ingesteld</p>';
  }

  function addAlert() {
    const dir = document.getElementById('alert-direction').value;
    const price = parseInt(document.getElementById('alert-price').value);
    if (!price) return;
    DEMO_ALERTS.push({ id: 'a-' + Date.now(), direction: dir, price_eur: price, is_active: true });
    document.getElementById('alert-price').value = '';
    renderAlerts();
    App.showToast('Alert ingesteld!', 'success');
  }

  function removeAlert(id) {
    const idx = DEMO_ALERTS.findIndex(a => a.id === id);
    if (idx >= 0) DEMO_ALERTS.splice(idx, 1);
    renderAlerts();
  }

  // --- 2. Vergaderplanner ---

  const DEMO_MEETINGS = [
    { id: 'mt1', host: 'Morris Verdonk', date: '2026-04-15', time: '14:00', topic: 'Multisig setup advies', status: 'confirmed' },
    { id: 'mt2', host: 'Onno Langbroek', date: '2026-04-18', time: '10:00', topic: 'Lightning node hulp', status: 'pending' },
  ];

  function renderMeetings() {
    const list = document.getElementById('meetings-list');
    if (!list) return;
    list.innerHTML = DEMO_MEETINGS.map(m => `
      <div class="channel-item" style="cursor:default">
        <div class="channel-icon">${m.status === 'confirmed' ? '&#9989;' : '&#9203;'}</div>
        <div class="channel-info">
          <div class="channel-name">${m.host}</div>
          <div class="channel-desc">${m.date} om ${m.time} — ${m.topic}</div>
        </div>
        <span class="market-badge badge-${m.status === 'confirmed' ? 'kennis' : 'dienst'}">${m.status}</span>
      </div>`).join('') || '<p class="text-muted" style="font-size:13px">Geen meetings gepland</p>';
  }

  // --- 3. Bounty Board ---

  const DEMO_BOUNTIES = [
    { id: 'b1', title: 'Schrijf een artikel over Bitcoin mining in NL', description: 'Minimaal 500 woorden, inclusief regelgeving en energiekosten.', reward_sats: 50000, status: 'open', author: 'Bram Kanstein' },
    { id: 'b2', title: 'Help bij opzet Lightning betaalpunt voor meetup', description: 'We willen drankjes kunnen afrekenen met Lightning bij de volgende meetup.', reward_sats: 25000, status: 'open', author: 'Pieter Voogt' },
    { id: 'b3', title: 'Vertaal Bitcoin whitepaper samenvatting naar NL', description: 'Korte, begrijpelijke Nederlandse samenvatting van het Bitcoin whitepaper.', reward_sats: 15000, status: 'claimed', author: 'Vincent de Wit', claimedBy: 'Ramon Lagrand' },
    { id: 'b4', title: 'Fotografie bij Monthly Meetup April', description: 'Maak 20+ foto\'s tijdens de meetup. Moet beschikbaar zijn op 25 april.', reward_sats: 30000, status: 'open', author: 'Bram Kanstein' },
  ];

  function renderBounties() {
    const list = document.getElementById('bounties-list');
    if (!list) return;
    list.innerHTML = DEMO_BOUNTIES.map(b => `
      <div class="deal-card">
        <span class="deal-type-badge ${b.status === 'open' ? 'investering' : 'samenwerking'}">${b.status}</span>
        <span style="float:right;font-family:'Fragment Mono',monospace;color:var(--accent);font-weight:590">&#9889; ${App.showToast ? '' : ''}${(b.reward_sats/1000).toFixed(0)}k sats</span>
        <div class="market-title" style="margin-top:4px">${b.title}</div>
        <div class="market-desc">${b.description}</div>
        <div class="market-author">Door ${b.author} ${b.claimedBy ? '&bull; Geclaimd door ' + b.claimedBy : ''}</div>
        ${b.status === 'open' ? '<button class="btn btn-sm" style="margin-top:10px;width:100%" onclick="App.showToast(\'Bounty geclaimd!\',\'success\')">Claim deze bounty</button>' : ''}
      </div>`).join('');
  }

  // --- 4. Notulen (in event detail, see loadEventNotes) ---

  // --- 5. Bitcoin Portefeuille Tracker ---

  let portfolio = JSON.parse(localStorage.getItem('dbe_portfolio') || '{"btc":0,"avg_price":0}');

  function renderPortfolio() {
    const el = document.getElementById('portfolio-content');
    if (!el) return;
    const currentPrice = parseFloat(document.getElementById('ticker-price')?.textContent?.replace(/[^0-9]/g, '') || '95000');
    const value = portfolio.btc * currentPrice;
    const cost = portfolio.btc * portfolio.avg_price;
    const pnl = value - cost;
    const pnlPct = cost > 0 ? ((pnl / cost) * 100).toFixed(1) : 0;

    el.innerHTML = `
      <div class="admin-grid" style="margin-bottom:20px">
        <div class="admin-stat">
          <div class="admin-stat-value">${portfolio.btc.toFixed(4)}</div>
          <div class="admin-stat-label">BTC</div>
        </div>
        <div class="admin-stat">
          <div class="admin-stat-value">&euro;${Math.round(value).toLocaleString('nl-NL')}</div>
          <div class="admin-stat-label">Waarde</div>
        </div>
        <div class="admin-stat">
          <div class="admin-stat-value" style="color:${pnl >= 0 ? 'var(--success)' : 'var(--danger)'}">${pnl >= 0 ? '+' : ''}&euro;${Math.round(pnl).toLocaleString('nl-NL')}</div>
          <div class="admin-stat-label">P&L (${pnlPct}%)</div>
        </div>
      </div>
      <p class="text-muted" style="font-size:12px;margin-bottom:12px">&#128274; Alleen lokaal opgeslagen — geen data naar de server</p>
      <form class="form-stack" onsubmit="Features.updatePortfolio(event)">
        <div class="form-group">
          <label class="form-label">BTC hoeveelheid</label>
          <input type="number" class="input" id="portfolio-btc" step="0.0001" value="${portfolio.btc}">
        </div>
        <div class="form-group">
          <label class="form-label">Gemiddelde aankoopprijs (&euro;)</label>
          <input type="number" class="input" id="portfolio-avg" step="1" value="${portfolio.avg_price}">
        </div>
        <button type="submit" class="btn btn-full">Opslaan</button>
      </form>`;
  }

  function updatePortfolio(e) {
    e.preventDefault();
    portfolio.btc = parseFloat(document.getElementById('portfolio-btc').value) || 0;
    portfolio.avg_price = parseFloat(document.getElementById('portfolio-avg').value) || 0;
    localStorage.setItem('dbe_portfolio', JSON.stringify(portfolio));
    renderPortfolio();
    App.showToast('Portfolio bijgewerkt!', 'success');
  }

  // --- 6. Referral Systeem ---

  function renderReferral() {
    const el = document.getElementById('referral-content');
    if (!el) return;
    const code = 'DBE-VINCENT-2026';
    const link = window.location.origin + '?ref=' + code;
    el.innerHTML = `
      <div class="admin-stat" style="margin-bottom:16px">
        <div class="admin-stat-value">2</div>
        <div class="admin-stat-label">Leden uitgenodigd</div>
      </div>
      <div class="profile-info-row">
        <span class="profile-info-label">&#128279;</span>
        <span class="profile-info-value" style="font-family:'Fragment Mono',monospace;font-size:12px">${link}</span>
        <button class="profile-info-copy" onclick="App.copyText('${link}')">Kopieer</button>
      </div>
      <p class="text-muted" style="font-size:12px;margin-top:12px">Deel je link — als iemand lid wordt krijgen jullie beide 5.000 sats!</p>`;
  }

  // --- 7. Seizoensgebonden Challenges ---

  const DEMO_CHALLENGES = [
    { id: 'ch1', title: 'Stel je node in', description: 'Draai je eigen Bitcoin full node (Umbrel, Start9, of RaspiBlitz)', month: 'April 2026', reward_sats: 2000, completed: false, participants: 8 },
    { id: 'ch2', title: 'Eerste Lightning betaling', description: 'Doe je eerste echte Lightning betaling via je eigen wallet', month: 'Mei 2026', reward_sats: 1000, completed: false, participants: 0 },
    { id: 'ch3', title: 'Lees The Bitcoin Standard', description: 'Lees het boek van Saifedean Ammous en deel je takeaways in de chat', month: 'Juni 2026', reward_sats: 1500, completed: false, participants: 0 },
  ];

  function renderChallenges() {
    const list = document.getElementById('challenges-list');
    if (!list) return;
    list.innerHTML = DEMO_CHALLENGES.map(c => `
      <div class="deal-card">
        <div class="event-date">${c.month} &bull; &#9889; ${c.reward_sats.toLocaleString()} sats</div>
        <div class="market-title">${c.title}</div>
        <div class="market-desc">${c.description}</div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:10px">
          <div class="event-bar" style="flex:1;margin:0"><div class="event-bar-fill" style="width:${c.participants / 50 * 100}%"></div></div>
          <span style="font-size:12px;color:var(--muted)">${c.participants}/50</span>
        </div>
        <button class="btn btn-sm ${c.completed ? 'btn-registered' : ''}" style="margin-top:10px;width:100%"
          onclick="Features.completeChallenge('${c.id}')">
          ${c.completed ? 'Afgerond!' : 'Markeer als afgerond'}
        </button>
      </div>`).join('');
  }

  function completeChallenge(id) {
    const c = DEMO_CHALLENGES.find(x => x.id === id);
    if (!c || c.completed) return;
    c.completed = true;
    c.participants++;
    renderChallenges();
    App.showToast(`+${c.reward_sats} sats: Challenge afgerond!`, 'success');
  }

  // --- 8. Lokale Bitcoin Kaart ---

  const DEMO_LOCATIONS = [
    { id: 'loc1', name: 'Paviljoen de Witte', type: 'meetup', address: 'Plein 24, Den Haag', lightning: false },
    { id: 'loc2', name: 'Bitcoin ATM Centraal Station', type: 'atm', address: 'Koningin Julianaplein 10, Den Haag', lightning: false },
    { id: 'loc3', name: 'Dutch Bitcoin Embassy', type: 'meetup', address: 'Den Haag', lightning: true },
    { id: 'loc4', name: 'De Biertuin (accepteert BTC)', type: 'restaurant', address: 'Lange Voorhout 3, Den Haag', lightning: true },
    { id: 'loc5', name: 'Blockrise kantoor', type: 'bedrijf', address: 'Fluwelen Burgwal 58, Den Haag', lightning: false },
  ];

  const LOC_ICONS = { meetup: '&#128205;', atm: '&#127974;', restaurant: '&#127860;', bedrijf: '&#127970;', winkel: '&#128722;' };

  function renderMap() {
    const list = document.getElementById('map-list');
    if (!list) return;
    list.innerHTML = DEMO_LOCATIONS.map(l => `
      <div class="channel-item" style="cursor:default">
        <div class="channel-icon">${LOC_ICONS[l.type] || '&#128205;'}</div>
        <div class="channel-info">
          <div class="channel-name">${l.name} ${l.lightning ? '<span style="color:var(--accent)">&#9889;</span>' : ''}</div>
          <div class="channel-desc">${l.address}</div>
        </div>
        <span class="market-badge badge-dienst">${l.type}</span>
      </div>`).join('');
  }

  // --- 9. Event Feedback ---

  function submitFeedback(e) {
    e.preventDefault();
    const rating = document.getElementById('feedback-rating').value;
    const comment = document.getElementById('feedback-comment').value;
    App.showToast('Feedback verstuurd! Bedankt.', 'success');
    e.target.reset();
  }

  // --- 10. Whale Alert ---

  const DEMO_WHALES = [
    { time: '14:23', amount: '500 BTC', value: '€47.5M', type: 'transfer', from: 'Onbekend', to: 'Coinbase' },
    { time: '12:07', amount: '1,200 BTC', value: '€114M', type: 'transfer', from: 'Binance', to: 'Cold Wallet' },
    { time: '09:45', amount: '250 BTC', value: '€23.8M', type: 'transfer', from: 'Kraken', to: 'Onbekend' },
    { time: '08:12', amount: '3,000 BTC', value: '€285M', type: 'transfer', from: 'Cold Wallet', to: 'Bitfinex' },
    { time: 'Gisteren 22:30', amount: '800 BTC', value: '€76M', type: 'transfer', from: 'Onbekend', to: 'Onbekend' },
  ];

  function renderWhaleAlert() {
    const list = document.getElementById('whale-list');
    if (!list) return;
    list.innerHTML = DEMO_WHALES.map(w => `
      <div class="channel-item" style="cursor:default">
        <div class="channel-icon" style="font-size:20px">&#128011;</div>
        <div class="channel-info">
          <div class="channel-name">${w.amount} <span style="color:var(--muted);font-weight:400">(${w.value})</span></div>
          <div class="channel-desc">${w.from} &#8594; ${w.to}</div>
        </div>
        <span style="font-size:12px;color:var(--text-dim)">${w.time}</span>
      </div>`).join('');
  }

  // --- 11. Bitcoin24 Calculator (Saylor Model) ---

  const BTC24_STRATEGIES = {
    normie: { name: 'Normie', btcAllocation: 0, description: '0% Bitcoin, 100% traditioneel' },
    btc10: { name: 'BTC 10%', btcAllocation: 0.10, description: '10% Bitcoin, 90% traditioneel' },
    maxi: { name: 'BTC Maxi', btcAllocation: 0.50, description: '50% Bitcoin, 50% traditioneel' },
    double: { name: 'Double Maxi', btcAllocation: 0.80, description: '80% Bitcoin + leverage' },
    triple: { name: 'Triple Maxi', btcAllocation: 1.0, description: '100% Bitcoin, alles erin' },
  };

  function renderBitcoin24() {
    const el = document.getElementById('btc24-content');
    if (!el) return;

    const startCapital = parseFloat(document.getElementById('btc24-capital')?.value || 10000);
    const monthlyDCA = parseFloat(document.getElementById('btc24-dca')?.value || 200);
    const btcCAGR = parseFloat(document.getElementById('btc24-cagr')?.value || 40);
    const tradCAGR = parseFloat(document.getElementById('btc24-trad')?.value || 7);
    const years = parseInt(document.getElementById('btc24-years')?.value || 21);

    const results = {};
    for (const [key, strat] of Object.entries(BTC24_STRATEGIES)) {
      const btcPart = strat.btcAllocation;
      const tradPart = 1 - btcPart;
      let totalBtc = startCapital * btcPart;
      let totalTrad = startCapital * tradPart;

      for (let y = 0; y < years; y++) {
        totalBtc = totalBtc * (1 + btcCAGR / 100) + monthlyDCA * 12 * btcPart;
        totalTrad = totalTrad * (1 + tradCAGR / 100) + monthlyDCA * 12 * tradPart;
      }

      results[key] = {
        ...strat,
        total: Math.round(totalBtc + totalTrad),
        btcValue: Math.round(totalBtc),
        tradValue: Math.round(totalTrad)
      };
    }

    const maxVal = Math.max(...Object.values(results).map(r => r.total));

    el.innerHTML = Object.entries(results).map(([key, r]) => {
      const pct = (r.total / maxVal * 100).toFixed(0);
      const isSelected = key === 'maxi';
      return `
        <div class="deal-card" style="${isSelected ? 'border-color:var(--accent-border);background:var(--accent-dim)' : ''}">
          <div style="display:flex;justify-content:space-between;align-items:baseline">
            <div class="market-title">${r.name}</div>
            <div style="font-family:'Fragment Mono',monospace;font-size:18px;font-weight:590;color:var(--accent)">&euro;${r.total.toLocaleString('nl-NL')}</div>
          </div>
          <div class="market-desc" style="margin-bottom:8px">${r.description}</div>
          <div class="event-bar" style="margin:4px 0"><div class="event-bar-fill" style="width:${pct}%"></div></div>
          <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--muted)">
            <span>BTC: &euro;${r.btcValue.toLocaleString('nl-NL')}</span>
            <span>Trad: &euro;${r.tradValue.toLocaleString('nl-NL')}</span>
          </div>
        </div>`;
    }).join('');
  }

  // --- Init ---

  function init() {
    // Bitcoin24 form listener
    document.getElementById('btc24-form')?.addEventListener('input', () => renderBitcoin24());
    document.getElementById('feedback-form')?.addEventListener('submit', submitFeedback);
    document.getElementById('alert-form')?.addEventListener('submit', (e) => { e.preventDefault(); addAlert(); });
  }

  return {
    renderAlerts, addAlert, removeAlert,
    renderMeetings,
    renderBounties,
    renderPortfolio, updatePortfolio,
    renderReferral,
    renderChallenges, completeChallenge,
    renderMap,
    submitFeedback,
    renderWhaleAlert,
    renderBitcoin24,
    init
  };
})();

document.addEventListener('DOMContentLoaded', Features.init);
