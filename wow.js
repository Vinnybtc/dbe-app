// ============================================
// DBE Community App — WOW Effects & Premium Features
// Animations, Dashboard, Halving, Fear&Greed, Confetti
// ============================================

const Wow = (() => {

  // --- Confetti / Sats Rain ---

  function satsConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    const symbols = ['₿', '⚡', '₿', '⚡', '✦', '₿', '⚡'];
    const colors = ['#E68D3C', '#FFD700', '#f0a050', '#FFA500', '#E68D3C'];

    for (let i = 0; i < 40; i++) {
      const particle = document.createElement('div');
      particle.className = 'confetti-particle';
      particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      particle.style.cssText = `
        left: ${Math.random() * 100}%;
        color: ${colors[Math.floor(Math.random() * colors.length)]};
        font-size: ${12 + Math.random() * 16}px;
        animation-delay: ${Math.random() * 0.5}s;
        animation-duration: ${1.5 + Math.random() * 1.5}s;
      `;
      container.appendChild(particle);
    }

    setTimeout(() => container.remove(), 3000);
  }

  // Patch App.showToast to trigger confetti on sats
  const origShowToast = App.showToast;
  App.showToast = function(msg, type) {
    origShowToast(msg, type);
    if (type === 'success' && msg.includes('sats')) {
      satsConfetti();
    }
  };

  // --- Animated Counter ---

  function animateCounter(el, target, duration = 1200) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.round(start + (target - start) * eased);

      if (el.dataset.format === 'sats') {
        el.textContent = current >= 1000 ? (current / 1000).toFixed(0) + 'k' : current;
      } else if (el.dataset.format === 'eur') {
        el.textContent = '€' + current.toLocaleString('nl-NL');
      } else {
        el.textContent = current.toLocaleString('nl-NL');
      }

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  function initCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count);
      if (target && !el.dataset.counted) {
        el.dataset.counted = '1';
        animateCounter(el, target);
      }
    });
  }

  // --- Progress Ring ---

  function createProgressRing(pct, size = 60, stroke = 5) {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    return `
      <svg class="progress-ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle class="progress-ring-bg" cx="${size/2}" cy="${size/2}" r="${r}" stroke-width="${stroke}" fill="none"/>
        <circle class="progress-ring-fill" cx="${size/2}" cy="${size/2}" r="${r}" stroke-width="${stroke}" fill="none"
          stroke-dasharray="${circ}" stroke-dashoffset="${offset}" transform="rotate(-90 ${size/2} ${size/2})"/>
        <text x="${size/2}" y="${size/2}" text-anchor="middle" dominant-baseline="central" class="progress-ring-text">${pct}%</text>
      </svg>`;
  }

  // --- Halving Countdown ---

  // Next halving estimated: block 1,050,000 (~March 2028)
  const HALVING_BLOCK = 1050000;
  const CURRENT_BLOCK = 890000; // approximate
  const BLOCKS_PER_DAY = 144;

  function renderHalvingCountdown() {
    const blocksLeft = HALVING_BLOCK - CURRENT_BLOCK;
    const daysLeft = Math.round(blocksLeft / BLOCKS_PER_DAY);
    const halvingDate = new Date(Date.now() + daysLeft * 24 * 60 * 60 * 1000);
    const pct = ((CURRENT_BLOCK % 210000) / 210000 * 100).toFixed(1);

    const days = daysLeft;
    const hours = Math.floor((daysLeft % 1) * 24);

    return `
      <div class="halving-widget">
        <div class="halving-header">
          <span class="halving-label">Volgende Halving</span>
          <span class="halving-epoch">Epoch 5</span>
        </div>
        <div class="halving-countdown">
          <div class="halving-unit">
            <div class="halving-number" data-count="${days}">${days}</div>
            <div class="halving-unit-label">dagen</div>
          </div>
          <div class="halving-separator">:</div>
          <div class="halving-unit">
            <div class="halving-number">${Math.floor(blocksLeft / 1000)}k</div>
            <div class="halving-unit-label">blokken</div>
          </div>
        </div>
        <div class="halving-progress">
          <div class="halving-progress-bar">
            <div class="halving-progress-fill" style="width:${pct}%"></div>
          </div>
          <div class="halving-progress-text">${pct}% van epoch &bull; Blok ${CURRENT_BLOCK.toLocaleString()}</div>
        </div>
        <div class="halving-date">~${halvingDate.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })}</div>
      </div>`;
  }

  // --- Fear & Greed Index ---

  function renderFearGreed() {
    // Simulated value (in production: fetch from alternative.me API)
    const value = 72;
    const label = value > 75 ? 'Extreme Greed' : value > 55 ? 'Greed' : value > 45 ? 'Neutral' : value > 25 ? 'Fear' : 'Extreme Fear';
    const color = value > 75 ? '#27a644' : value > 55 ? '#a3d977' : value > 45 ? '#f5c842' : value > 25 ? '#ea8c35' : '#F85149';
    const rotation = (value / 100) * 180 - 90; // -90 to 90 degrees

    return `
      <div class="fg-widget">
        <div class="fg-gauge">
          <svg viewBox="0 0 120 70" class="fg-svg">
            <defs>
              <linearGradient id="fgGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#F85149"/>
                <stop offset="25%" stop-color="#ea8c35"/>
                <stop offset="50%" stop-color="#f5c842"/>
                <stop offset="75%" stop-color="#a3d977"/>
                <stop offset="100%" stop-color="#27a644"/>
              </linearGradient>
            </defs>
            <path d="M 10 65 A 50 50 0 0 1 110 65" fill="none" stroke="url(#fgGrad)" stroke-width="8" stroke-linecap="round"/>
            <line x1="60" y1="65" x2="60" y2="25" stroke="${color}" stroke-width="3" stroke-linecap="round"
              transform="rotate(${rotation} 60 65)" class="fg-needle"/>
          </svg>
        </div>
        <div class="fg-value" style="color:${color}">${value}</div>
        <div class="fg-label">${label}</div>
      </div>`;
  }

  // --- Bitcoin Block Explorer Mini ---

  function renderLatestBlocks() {
    const blocks = [
      { height: 890247, time: '2 min', txs: 3421, size: '1.73 MB', fees: '0.312 BTC' },
      { height: 890246, time: '14 min', txs: 2856, size: '1.54 MB', fees: '0.289 BTC' },
      { height: 890245, time: '22 min', txs: 3102, size: '1.68 MB', fees: '0.345 BTC' },
      { height: 890244, time: '31 min', txs: 2543, size: '1.42 MB', fees: '0.267 BTC' },
    ];

    return `
      <div class="blocks-widget">
        <div class="blocks-header">Laatste Blokken</div>
        ${blocks.map((b, i) => `
          <div class="block-item ${i === 0 ? 'block-latest' : ''}">
            <div class="block-cube ${i === 0 ? 'block-cube-pulse' : ''}">&#9641;</div>
            <div class="block-info">
              <div class="block-height">#${b.height.toLocaleString()}</div>
              <div class="block-meta">${b.txs} txs &bull; ${b.size} &bull; ${b.fees} fees</div>
            </div>
            <div class="block-time">${b.time}</div>
          </div>`).join('')}
      </div>`;
  }

  // --- Community Pulse ---

  function renderPulse() {
    const activities = [
      { icon: '⚡', text: 'Pieter Voogt heeft gestemd in een poll', time: '2 min' },
      { icon: '💬', text: 'Nieuw bericht in Macro & Markten', time: '5 min' },
      { icon: '🎫', text: 'Lars Heerink aangemeld voor Lightning Workshop', time: '12 min' },
      { icon: '🏪', text: 'Nieuw aanbod: Bitcoin custody advies', time: '28 min' },
      { icon: '🏆', text: 'Ramon Lagrand heeft badge "Lightning Pro" verdiend', time: '1 uur' },
      { icon: '👤', text: 'Wenze van Klink heeft zijn profiel bijgewerkt', time: '2 uur' },
      { icon: '🗳️', text: 'Nieuwe poll: "Telegram vervangen?"', time: '3 uur' },
    ];

    return `
      <div class="pulse-widget">
        <div class="pulse-header">
          <span class="pulse-dot"></span> Community Pulse
        </div>
        ${activities.map(a => `
          <div class="pulse-item">
            <span class="pulse-icon">${a.icon}</span>
            <span class="pulse-text">${a.text}</span>
            <span class="pulse-time">${a.time}</span>
          </div>`).join('')}
      </div>`;
  }

  // --- Home Dashboard ---

  function renderDashboard() {
    const el = document.getElementById('dashboard-content');
    if (!el) return;

    const profile = window.App?.state?.profile || {};
    const members = window.App?.state?.members || [];
    const totalMembers = members.length;

    el.innerHTML = `
      <div class="dashboard-greeting">
        <h2 class="dashboard-hello">Welkom terug, ${profile.first_name || 'lid'}</h2>
        <p class="text-muted">Dutch Bitcoin Embassy &bull; ${new Date().toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>

      ${typeof Extras !== 'undefined' ? Extras.renderQuickActions() : ''}

      <div class="dashboard-grid">
        <div class="dashboard-card dashboard-card-wide">
          ${renderHalvingCountdown()}
        </div>

        <div class="dashboard-card">
          ${renderFearGreed()}
        </div>

        <div class="dashboard-card">
          <div class="dashboard-stats">
            <div class="dash-stat">
              <div class="dash-stat-value" data-count="${totalMembers}" data-format="num">${totalMembers}</div>
              <div class="dash-stat-label">Leden</div>
            </div>
            <div class="dash-stat">
              <div class="dash-stat-value" data-count="${profile.sats_balance || 0}" data-format="sats">0</div>
              <div class="dash-stat-label">Jouw sats</div>
            </div>
            <div class="dash-stat">
              <div class="dash-stat-value" data-count="3">3</div>
              <div class="dash-stat-label">Events</div>
            </div>
          </div>
        </div>

        <div class="dashboard-card dashboard-card-wide">
          ${renderLatestBlocks()}
        </div>

        <div class="dashboard-card">
          ${typeof Extras !== 'undefined' ? Extras.renderWeeklyDigest() : ''}
        </div>

        <div class="dashboard-card dashboard-card-full">
          ${renderPulse()}
        </div>
      </div>
    `;

    // Trigger counter animations
    setTimeout(initCounters, 100);
  }

  // --- Page Transitions ---

  function enableTransitions() {
    // Override navigate to add slide effect
    const origNavigate = App.navigate;
    let lastScreen = null;

    App.navigate = function(screen) {
      const current = document.querySelector('.screen.active');
      if (current) {
        lastScreen = current.id;
        current.classList.add('screen-exit');
      }

      origNavigate(screen);

      const next = document.querySelector('.screen.active');
      if (next && next.id !== lastScreen) {
        next.classList.add('screen-enter');
        requestAnimationFrame(() => {
          next.classList.remove('screen-enter');
          if (current) current.classList.remove('screen-exit');
        });
      }

      // Load dashboard if navigating to home
      if (screen === 'home') renderDashboard();
    };

    // Re-expose
    window.navigate = App.navigate;
  }

  // --- Init ---

  function init() {
    enableTransitions();

    // Observe for new countable elements
    const observer = new MutationObserver(() => initCounters());
    observer.observe(document.body, { childList: true, subtree: true });
  }

  return {
    satsConfetti,
    animateCounter,
    createProgressRing,
    renderHalvingCountdown,
    renderFearGreed,
    renderLatestBlocks,
    renderPulse,
    renderDashboard,
    init
  };
})();

document.addEventListener('DOMContentLoaded', Wow.init);
