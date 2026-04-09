// ============================================
// DBE Community App — Hardcore Bitcoin Gadgets
// Mempool, Mining, Lightning, Timechain, HODL
// ============================================

const Bitcoin = (() => {

  // --- 1. Mempool Fee Estimator ---
  function renderFees() {
    const el = document.getElementById('fees-content');
    if (!el) return;
    // Demo data (production: fetch mempool.space/api/v1/fees/recommended)
    const fees = { fastestFee: 42, halfHourFee: 28, hourFee: 15, economyFee: 8, minimumFee: 4 };
    el.innerHTML = `
      <div class="fee-grid">
        ${[
          { label: 'Hoge prioriteit', fee: fees.fastestFee, time: '~10 min', color: 'var(--danger)' },
          { label: 'Medium', fee: fees.halfHourFee, time: '~30 min', color: 'var(--accent)' },
          { label: 'Laag', fee: fees.hourFee, time: '~1 uur', color: 'var(--success)' },
          { label: 'Economie', fee: fees.economyFee, time: '~2+ uur', color: 'var(--muted)' },
        ].map(f => `
          <div class="fee-card">
            <div class="fee-rate" style="color:${f.color}">${f.fee}</div>
            <div class="fee-unit">sat/vB</div>
            <div class="fee-label">${f.label}</div>
            <div class="fee-time">${f.time}</div>
          </div>`).join('')}
      </div>
      <div class="fee-advice ${fees.economyFee < 10 ? 'fee-low' : 'fee-high'}">
        ${fees.economyFee < 10 ? '🟢 Fees zijn laag — goed moment om te consolideren!' : '🔴 Fees zijn hoog — wacht als het niet urgent is'}
      </div>`;
    // Try live data
    fetch('https://mempool.space/api/v1/fees/recommended').then(r=>r.json()).then(data => {
      if (data.fastestFee) renderFeesWithData(el, data);
    }).catch(()=>{});
  }

  function renderFeesWithData(el, fees) {
    el.querySelector('.fee-grid').innerHTML = [
      { label: 'Hoge prioriteit', fee: fees.fastestFee, time: '~10 min', color: 'var(--danger)' },
      { label: 'Medium', fee: fees.halfHourFee, time: '~30 min', color: 'var(--accent)' },
      { label: 'Laag', fee: fees.hourFee, time: '~1 uur', color: 'var(--success)' },
      { label: 'Economie', fee: fees.economyFee, time: '~2+ uur', color: 'var(--muted)' },
    ].map(f => `
      <div class="fee-card">
        <div class="fee-rate" style="color:${f.color}">${f.fee}</div>
        <div class="fee-unit">sat/vB</div>
        <div class="fee-label">${f.label}</div>
        <div class="fee-time">${f.time}</div>
      </div>`).join('');
    const advice = el.querySelector('.fee-advice');
    advice.className = 'fee-advice ' + (fees.economyFee < 10 ? 'fee-low' : 'fee-high');
    advice.innerHTML = fees.economyFee < 10 ? '🟢 Fees zijn laag — goed moment om te consolideren!' : '🔴 Fees zijn hoog — wacht als het niet urgent is';
  }

  // --- 2. Difficulty Adjustment ---
  function renderDifficulty() {
    const el = document.getElementById('difficulty-content');
    if (!el) return;
    const currentBlock = 890247;
    const epochBlocks = 2016;
    const blocksInEpoch = currentBlock % epochBlocks;
    const blocksRemaining = epochBlocks - blocksInEpoch;
    const pct = (blocksInEpoch / epochBlocks * 100).toFixed(1);
    const daysLeft = Math.round(blocksRemaining / 144);
    const estChange = '+3.2%'; // demo

    el.innerHTML = `
      <div class="admin-grid">
        <div class="admin-stat">
          <div class="admin-stat-value">${blocksRemaining}</div>
          <div class="admin-stat-label">Blokken tot adjustment</div>
        </div>
        <div class="admin-stat">
          <div class="admin-stat-value">~${daysLeft}d</div>
          <div class="admin-stat-label">Geschatte tijd</div>
        </div>
        <div class="admin-stat">
          <div class="admin-stat-value" style="color:var(--success)">${estChange}</div>
          <div class="admin-stat-label">Geschatte wijziging</div>
        </div>
      </div>
      <div class="event-bar" style="margin:16px 0;height:8px"><div class="event-bar-fill" style="width:${pct}%"></div></div>
      <div style="text-align:center;font-size:12px;color:var(--muted)">${pct}% van epoch &bull; Blok ${blocksInEpoch}/${epochBlocks}</div>`;
  }

  // --- 3. Lightning Network Stats ---
  function renderLightningStats() {
    const el = document.getElementById('lightning-content');
    if (!el) return;
    el.innerHTML = `
      <div class="admin-grid">
        <div class="admin-stat"><div class="admin-stat-value">5,400</div><div class="admin-stat-label">BTC capaciteit</div></div>
        <div class="admin-stat"><div class="admin-stat-value">16k</div><div class="admin-stat-label">Nodes</div></div>
        <div class="admin-stat"><div class="admin-stat-value">72k</div><div class="admin-stat-label">Channels</div></div>
        <div class="admin-stat"><div class="admin-stat-value">€513M</div><div class="admin-stat-label">Waarde</div></div>
      </div>`;
  }

  // --- 4. Sat per Euro History ---
  function renderSatPerEuro() {
    const el = document.getElementById('satpereuro-content');
    if (!el) return;
    const data = [
      { year: '2015', price: 250, sats: 400000 },
      { year: '2017', price: 15000, sats: 6667 },
      { year: '2019', price: 8000, sats: 12500 },
      { year: '2021', price: 50000, sats: 2000 },
      { year: '2023', price: 25000, sats: 4000 },
      { year: '2025', price: 85000, sats: 1176 },
      { year: 'Nu', price: 95000, sats: 1053 },
    ];
    const maxSats = Math.max(...data.map(d=>d.sats));
    el.innerHTML = data.map(d => `
      <div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid var(--border)">
        <div style="width:40px;font-family:'Fragment Mono',monospace;font-size:13px;color:var(--muted)">${d.year}</div>
        <div class="event-bar" style="flex:1;margin:0;height:6px"><div class="event-bar-fill" style="width:${d.sats/maxSats*100}%"></div></div>
        <div style="width:70px;text-align:right;font-family:'Fragment Mono',monospace;font-size:13px;color:var(--accent)">${d.sats.toLocaleString()}</div>
        <div style="width:14px;font-size:10px;color:var(--muted)">sat/€</div>
      </div>`).join('');
  }

  // --- 5. Stock-to-Flow ---
  function renderS2F() {
    const el = document.getElementById('s2f-content');
    if (!el) return;
    const currentS2F = 120; // post-halving 2024
    const modelPrice = 250000;
    const actualPrice = 95000;
    const deviation = ((actualPrice / modelPrice - 1) * 100).toFixed(0);

    el.innerHTML = `
      <div class="admin-grid">
        <div class="admin-stat"><div class="admin-stat-value">120</div><div class="admin-stat-label">Huidige S2F ratio</div></div>
        <div class="admin-stat"><div class="admin-stat-value">€250k</div><div class="admin-stat-label">Model prijs</div></div>
        <div class="admin-stat"><div class="admin-stat-value">€95k</div><div class="admin-stat-label">Actuele prijs</div></div>
        <div class="admin-stat"><div class="admin-stat-value" style="color:var(--danger)">${deviation}%</div><div class="admin-stat-label">Afwijking</div></div>
      </div>
      <p class="text-muted" style="font-size:12px;margin-top:12px">Stock-to-Flow vergelijkt bestaande voorraad met jaarlijkse productie. Hoe hoger, hoe schaarser. Bitcoin's S2F is na de 2024 halving hoger dan goud.</p>`;
  }

  // --- 6. HODL Calculator ---
  function renderHodl() {
    const el = document.getElementById('hodl-content');
    if (!el) return;
    const prices = { 2013: 100, 2014: 350, 2015: 250, 2016: 600, 2017: 1000, 2018: 6000, 2019: 8000, 2020: 9000, 2021: 30000, 2022: 40000, 2023: 25000, 2024: 62000, 2025: 85000 };
    const currentPrice = 95000;
    const year = parseInt(document.getElementById('hodl-year')?.value || '2017');
    const amount = parseFloat(document.getElementById('hodl-amount')?.value || '100');
    const buyPrice = prices[year] || 1000;
    const btcBought = amount / buyPrice;
    const currentValue = btcBought * currentPrice;
    const gain = currentValue - amount;
    const gainPct = ((gain / amount) * 100).toFixed(0);

    el.innerHTML = `
      <form class="form-stack" style="margin-bottom:20px" oninput="Bitcoin.renderHodl()">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div class="form-group">
            <label class="form-label">Jaar van aankoop</label>
            <select class="input" id="hodl-year">${Object.keys(prices).map(y => `<option value="${y}" ${y == year ? 'selected' : ''}>${y}</option>`).join('')}</select>
          </div>
          <div class="form-group">
            <label class="form-label">Bedrag (&euro;)</label>
            <input type="number" class="input" id="hodl-amount" value="${amount}">
          </div>
        </div>
      </form>
      <div class="admin-grid">
        <div class="admin-stat"><div class="admin-stat-value">${btcBought.toFixed(4)}</div><div class="admin-stat-label">BTC gekocht</div></div>
        <div class="admin-stat"><div class="admin-stat-value">&euro;${Math.round(currentValue).toLocaleString('nl-NL')}</div><div class="admin-stat-label">Huidige waarde</div></div>
        <div class="admin-stat"><div class="admin-stat-value" style="color:var(--success)">+${gainPct}%</div><div class="admin-stat-label">Rendement</div></div>
      </div>`;
  }

  // --- 7. Block Reward Eras ---
  function renderBlockRewards() {
    const el = document.getElementById('eras-content');
    if (!el) return;
    const eras = [
      { era: 1, years: '2009-2012', reward: 50, mined: '10.5M', pct: 50 },
      { era: 2, years: '2012-2016', reward: 25, mined: '5.25M', pct: 25 },
      { era: 3, years: '2016-2020', reward: 12.5, mined: '2.625M', pct: 12.5 },
      { era: 4, years: '2020-2024', reward: 6.25, mined: '1.3125M', pct: 6.25 },
      { era: 5, years: '2024-2028', reward: 3.125, mined: '~656k', pct: 3.125, current: true },
      { era: 6, years: '2028-2032', reward: 1.5625, mined: '~328k', pct: 1.5625 },
    ];
    const totalMined = 19.7;
    const totalSupply = 21;
    el.innerHTML = `
      <div style="text-align:center;margin-bottom:20px">
        <div style="font-family:'Fragment Mono',monospace;font-size:28px;color:var(--accent)">${totalMined}M / ${totalSupply}M</div>
        <div class="event-bar" style="margin:8px auto;max-width:300px;height:8px"><div class="event-bar-fill" style="width:${totalMined/totalSupply*100}%"></div></div>
        <div style="font-size:12px;color:var(--muted)">${(totalMined/totalSupply*100).toFixed(1)}% gemined</div>
      </div>
      ${eras.map(e => `
        <div class="channel-item" style="cursor:default;${e.current ? 'border-color:var(--accent-border);background:var(--accent-dim)' : ''}">
          <div class="channel-icon" style="font-size:14px;${e.current ? 'background:var(--accent);color:#fff' : ''}">${e.era}</div>
          <div class="channel-info">
            <div class="channel-name">Era ${e.era}: ${e.reward} BTC/blok ${e.current ? '(nu)' : ''}</div>
            <div class="channel-desc">${e.years} &bull; ${e.mined} BTC gemined</div>
          </div>
        </div>`).join('')}`;
  }

  // --- 8. Proof of Work Simulator ---
  let powRunning = false;
  function renderPoW() {
    const el = document.getElementById('pow-content');
    if (!el) return;
    el.innerHTML = `
      <p class="text-muted" style="margin-bottom:16px">Vind een hash die begint met "0000". Dit is wat miners miljoenen keren per seconde doen.</p>
      <div class="form-group" style="margin-bottom:12px">
        <label class="form-label">Data</label>
        <input type="text" class="input" id="pow-data" value="Dutch Bitcoin Embassy">
      </div>
      <div class="admin-stat" style="margin-bottom:12px">
        <div class="admin-stat-value" id="pow-nonce">0</div>
        <div class="admin-stat-label">Pogingen (nonce)</div>
      </div>
      <div style="font-family:'Fragment Mono',monospace;font-size:11px;color:var(--muted);word-break:break-all;margin-bottom:12px;min-height:20px" id="pow-hash">—</div>
      <button class="btn btn-full" id="pow-btn" onclick="Bitcoin.startPoW()">Start mining!</button>`;
  }

  async function startPoW() {
    if (powRunning) return;
    powRunning = true;
    const data = document.getElementById('pow-data').value;
    const btn = document.getElementById('pow-btn');
    btn.textContent = 'Mining...';
    btn.disabled = true;
    let nonce = 0;

    const mine = async () => {
      for (let i = 0; i < 1000; i++) {
        const text = data + nonce;
        const msgBuffer = new TextEncoder().encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        document.getElementById('pow-nonce').textContent = nonce.toLocaleString();
        document.getElementById('pow-hash').textContent = hashHex;

        if (hashHex.startsWith('0000')) {
          powRunning = false;
          btn.textContent = 'Blok gevonden! 🎉';
          btn.disabled = false;
          document.getElementById('pow-hash').style.color = 'var(--success)';
          App.showToast(`Blok gevonden na ${nonce} pogingen! +1000 sats`, 'success');
          return;
        }
        nonce++;
      }
      if (powRunning) requestAnimationFrame(mine);
    };
    mine();
  }

  // --- 9. Cold Storage Checklist ---
  function renderChecklist() {
    const el = document.getElementById('checklist-content');
    if (!el) return;
    const items = [
      { text: 'Hardware wallet gekocht van officiële leverancier', checked: false },
      { text: 'Firmware bijgewerkt naar nieuwste versie', checked: false },
      { text: 'Seed phrase opgeschreven op papier (NIET digitaal)', checked: false },
      { text: 'Seed phrase getest: wallet hersteld en saldo klopt', checked: false },
      { text: 'Seed phrase op metaal gegraveerd (brandbestendig)', checked: false },
      { text: 'Backup opgeslagen op een tweede fysieke locatie', checked: false },
      { text: 'PIN code ingesteld (niet je geboortedatum)', checked: false },
      { text: 'Passphrase (25e woord) overwogen', checked: false },
      { text: 'Erfgenamen geïnformeerd over locatie backup', checked: false },
      { text: 'Test-transactie gedaan: ontvangen + verzenden werkt', checked: false },
    ];
    const stored = JSON.parse(localStorage.getItem('dbe_checklist') || '[]');

    el.innerHTML = items.map((item, i) => {
      const done = stored.includes(i);
      return `
        <div class="edu-lesson" onclick="Bitcoin.toggleCheck(${i})" style="cursor:pointer">
          <div class="edu-lesson-num ${done ? 'done' : ''}">${done ? '✓' : i + 1}</div>
          <div class="edu-lesson-title" style="${done ? 'text-decoration:line-through;color:var(--muted)' : ''}">${item.text}</div>
        </div>`;
    }).join('');

    const done = stored.length;
    el.innerHTML += `<div style="margin-top:16px;text-align:center;font-size:13px;color:var(--muted)">${done}/${items.length} afgevinkt</div>`;
  }

  function toggleCheck(i) {
    let stored = JSON.parse(localStorage.getItem('dbe_checklist') || '[]');
    if (stored.includes(i)) stored = stored.filter(x => x !== i);
    else stored.push(i);
    localStorage.setItem('dbe_checklist', JSON.stringify(stored));
    renderChecklist();
  }

  // --- 10. Timechain Calendar ---
  function renderTimechain() {
    const el = document.getElementById('timechain-content');
    if (!el) return;
    const events = [
      { date: '3 jan 2009', event: 'Genesis Block gemined door Satoshi', icon: '🟠' },
      { date: '22 mei 2010', event: 'Eerste aankoop: 10.000 BTC voor 2 pizza\'s', icon: '🍕' },
      { date: '28 nov 2012', event: 'Eerste halving: reward 50 → 25 BTC', icon: '⚡' },
      { date: '1 aug 2017', event: 'SegWit activatie (block 481824)', icon: '🔧' },
      { date: '17 dec 2017', event: 'ATH: $19.783 (eerste bull run)', icon: '📈' },
      { date: '11 mei 2020', event: 'Derde halving: reward 12.5 → 6.25 BTC', icon: '⚡' },
      { date: '14 sep 2021', event: 'El Salvador: Bitcoin als wettig betaalmiddel', icon: '🇸🇻' },
      { date: '10 jan 2024', event: 'Eerste Bitcoin ETF goedgekeurd (VS)', icon: '🏦' },
      { date: '20 apr 2024', event: 'Vierde halving: reward 6.25 → 3.125 BTC', icon: '⚡' },
      { date: 'Jan 2026', event: 'DBE event: 56 aanwezigen, uitverkocht!', icon: '🇳🇱' },
    ];
    el.innerHTML = events.map(e => `
      <div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)">
        <div style="font-size:20px;flex-shrink:0">${e.icon}</div>
        <div>
          <div style="font-size:11px;color:var(--accent);font-weight:590">${e.date}</div>
          <div style="font-size:13px;color:var(--text-secondary)">${e.event}</div>
        </div>
      </div>`).join('');
  }

  // --- 11. Fiat Debt Clock ---
  function renderDebtClock() {
    const el = document.getElementById('debt-content');
    if (!el) return;
    const nlDebt = 482_000_000_000; // €482 miljard
    const population = 17_900_000;
    const perPerson = Math.round(nlDebt / population);
    const btcPrice = 95000;
    const debtInBtc = Math.round(nlDebt / btcPrice);

    el.innerHTML = `
      <div class="admin-grid" style="margin-bottom:20px">
        <div class="admin-stat"><div class="admin-stat-value">&euro;${(nlDebt/1e9).toFixed(0)}B</div><div class="admin-stat-label">NL Staatsschuld</div></div>
        <div class="admin-stat"><div class="admin-stat-value">&euro;${perPerson.toLocaleString('nl-NL')}</div><div class="admin-stat-label">Per inwoner</div></div>
        <div class="admin-stat"><div class="admin-stat-value">${(debtInBtc/1e6).toFixed(1)}M</div><div class="admin-stat-label">In BTC</div></div>
        <div class="admin-stat"><div class="admin-stat-value" style="color:var(--danger)">+€${Math.round(nlDebt * 0.025 / 365 / 24 / 60).toLocaleString('nl-NL')}</div><div class="admin-stat-label">Per minuut erbij</div></div>
      </div>
      <p class="text-muted" style="font-size:12px">De Nederlandse staatsschuld groeit met ~€1.390 per minuut. Bitcoin's supply is vast op 21 miljoen. Fix the money, fix the world.</p>`;
  }

  // --- 12. Run the Numbers Dashboard ---
  function renderRunNumbers() {
    const el = document.getElementById('runnumbers-content');
    if (!el) return;
    el.innerHTML = `
      <div class="admin-grid">
        <div class="admin-stat"><div class="admin-stat-value">21M</div><div class="admin-stat-label">Max supply</div></div>
        <div class="admin-stat"><div class="admin-stat-value">19.7M</div><div class="admin-stat-label">In omloop</div></div>
        <div class="admin-stat"><div class="admin-stat-value">3.125</div><div class="admin-stat-label">Block reward</div></div>
        <div class="admin-stat"><div class="admin-stat-value">~700</div><div class="admin-stat-label">EH/s hashrate</div></div>
        <div class="admin-stat"><div class="admin-stat-value">890k</div><div class="admin-stat-label">Block height</div></div>
        <div class="admin-stat"><div class="admin-stat-value">15 jaar</div><div class="admin-stat-label">Uptime: 99.99%</div></div>
        <div class="admin-stat"><div class="admin-stat-value">0</div><div class="admin-stat-label">Hacks op protocol</div></div>
        <div class="admin-stat"><div class="admin-stat-value">~50k</div><div class="admin-stat-label">Full nodes</div></div>
      </div>`;
  }

  // --- 13. Multisig Planner ---
  function renderMultisig() {
    const el = document.getElementById('multisig-content');
    if (!el) return;
    const setups = [
      { name: 'Singlesig', config: '1-of-1', security: 30, convenience: 100, desc: 'Eenvoudig maar single point of failure' },
      { name: '2-of-3 Multisig', config: '2-of-3', security: 85, convenience: 70, desc: 'Goud standaard voor de meeste hodlers', recommended: true },
      { name: '3-of-5 Multisig', config: '3-of-5', security: 95, convenience: 40, desc: 'Maximum security, voor grote bedragen' },
      { name: 'Collaborative custody', config: '2-of-3*', security: 75, convenience: 85, desc: 'Unchained/Casa: jij + bedrijf + backup' },
    ];
    el.innerHTML = setups.map(s => `
      <div class="deal-card" style="${s.recommended ? 'border-color:var(--accent-border);background:var(--accent-dim)' : ''}">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div class="market-title">${s.name}</div>
          <div style="font-family:'Fragment Mono',monospace;color:var(--accent);font-size:14px">${s.config}</div>
        </div>
        <div class="market-desc">${s.desc}</div>
        <div style="display:flex;gap:16px;margin-top:10px;font-size:12px">
          <div style="flex:1">
            <div style="color:var(--muted);margin-bottom:4px">Security</div>
            <div class="event-bar" style="margin:0;height:4px"><div class="event-bar-fill" style="width:${s.security}%"></div></div>
          </div>
          <div style="flex:1">
            <div style="color:var(--muted);margin-bottom:4px">Gemak</div>
            <div class="event-bar" style="margin:0;height:4px"><div class="event-bar-fill" style="width:${s.convenience}%;background:var(--success)"></div></div>
          </div>
        </div>
        ${s.recommended ? '<div style="margin-top:8px;font-size:11px;color:var(--accent);font-weight:590">⭐ AANBEVOLEN</div>' : ''}
      </div>`).join('');
  }

  return {
    renderFees, renderDifficulty, renderLightningStats, renderSatPerEuro,
    renderS2F, renderHodl, renderBlockRewards, renderPoW, startPoW,
    renderChecklist, toggleCheck, renderTimechain, renderDebtClock,
    renderRunNumbers, renderMultisig
  };
})();
