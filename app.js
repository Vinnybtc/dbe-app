// ============================================
// DBE Community App — Main Application
// ============================================

const App = (() => {

  // --- Config ---
  // TODO: Vervang met echte Supabase credentials
  const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
  const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

  // Dev mode: als credentials niet ingevuld, gebruik demo data
  const DEV_MODE = SUPABASE_URL.includes('YOUR_PROJECT');

  let supabase = null;
  if (!DEV_MODE) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  // --- Demo Data ---
  const DEMO = {
    user: { id: 'demo-user-1' },
    profile: {
      id: 'demo-user-1', first_name: 'Vincent', last_name: 'de Wit',
      company: 'Delta Signal', job_title: 'AI & Vastgoed',
      bio: 'Bouwt dingen met AI. Actief in Bitcoin community Den Haag.',
      expertise_tags: ['AI & Technologie', 'Vastgoed', 'Community Building', 'Bestuur'],
      lightning_address: 'vincent@getalby.com', avatar_url: null,
      membership_tier: 'admin', membership_status: 'active',
      sats_balance: 150000, onboarding_completed: true, is_profile_visible: true
    },
    members: [
      { id: 'demo-1', first_name: 'Pieter', last_name: 'Voogt', company: 'DBE', job_title: 'Voorzitter', bio: 'Verbinder van de community. Ondernemer in hart en nieren.', expertise_tags: ['Verbinding', 'Business Development', 'Bitcoin Ondernemer', 'Bestuur'], lightning_address: 'pieter@getalby.com', avatar_url: null, membership_tier: 'admin', is_profile_visible: true, sats_balance: 210000 },
      { id: 'demo-2', first_name: 'Marc', last_name: 'van Versendaal', company: '', job_title: 'Bitcoin Advocate', bio: 'Visie & inspiratie. Innerlijke rijkdom boven alles.', expertise_tags: ['Visie & Inspiratie', 'Innerlijke Rijkdom', 'Bitcoin Advocate', 'Bestuur'], lightning_address: 'marc@getalby.com', avatar_url: null, membership_tier: 'admin', is_profile_visible: true, sats_balance: 88000 },
      { id: 'demo-user-1', first_name: 'Vincent', last_name: 'de Wit', company: 'Delta Signal', job_title: 'AI & Vastgoed', bio: 'Bouwt dingen met AI. Actief in Bitcoin community Den Haag.', expertise_tags: ['AI & Technologie', 'Vastgoed', 'Community Building', 'Bestuur'], lightning_address: 'vincent@getalby.com', avatar_url: null, membership_tier: 'admin', is_profile_visible: true, sats_balance: 150000 },
      { id: 'demo-3', first_name: 'Bram', last_name: 'Kanstein', company: '', job_title: 'Events & Content', bio: 'No-code builder, AI enthusiast, community events organisator.', expertise_tags: ['Events & Content', 'No-code', 'AI & Data', 'Bestuur'], lightning_address: 'bram@getalby.com', avatar_url: null, membership_tier: 'admin', is_profile_visible: true, sats_balance: 65000 },
      { id: 'demo-4', first_name: 'Jan', last_name: 'Bakker', company: 'BTC Mining NL', job_title: 'Mining Specialist', bio: 'Home mining enthusiast. Draait 3 ASIC miners in de garage.', expertise_tags: ['Mining', 'Hardware', 'Energie'], lightning_address: 'jan@walletofsatoshi.com', avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 500000 },
      { id: 'demo-5', first_name: 'Sophie', last_name: 'de Vries', company: 'CryptoTax NL', job_title: 'Belastingadviseur', bio: 'Gespecialiseerd in crypto-belastingen voor Nederland.', expertise_tags: ['Belasting', 'Compliance', 'DeFi'], lightning_address: 'sophie@getalby.com', avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 42000 },
      { id: 'demo-6', first_name: 'Thomas', last_name: 'Smit', company: '', job_title: 'Developer', bio: 'Full-stack developer. Bouwt Lightning apps.', expertise_tags: ['Development', 'Lightning', 'Privacy'], lightning_address: 'thomas@getalby.com', avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 320000 },
      { id: 'demo-7', first_name: 'Lisa', last_name: 'Jansen', company: 'Node Capital', job_title: 'Investor', bio: 'Investeerder in Bitcoin startups. Actief in venture capital.', expertise_tags: ['Investeren', 'Venture Capital', 'Bitcoin Startups'], lightning_address: 'lisa@getalby.com', avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 1000000 },
    ],
    listings: [
      { id: 'l1', author_id: 'demo-1', title: 'Bitcoin node setup begeleiding', description: 'Hulp bij het opzetten van je eigen Bitcoin full node, inclusief Lightning.', category: 'dienst', price_sats: 50000, is_active: true, profiles: { first_name: 'Pieter', last_name: 'Voogt', lightning_address: 'pieter@getalby.com' } },
      { id: 'l2', author_id: 'demo-user-1', title: 'AI workflow automatisering', description: 'Automatiseer repetitieve taken met AI-gestuurde workflows. Van scraping tot rapportage.', category: 'dienst', price_sats: 100000, is_active: true, profiles: { first_name: 'Vincent', last_name: 'de Wit', lightning_address: 'vincent@getalby.com' } },
      { id: 'l3', author_id: 'demo-3', title: 'Event organisatie support', description: 'Hulp bij het organiseren van Bitcoin meetups en events in Den Haag.', category: 'dienst', price_sats: null, is_active: true, profiles: { first_name: 'Bram', last_name: 'Kanstein', lightning_address: 'bram@getalby.com' } },
      { id: 'l4', author_id: 'demo-2', title: 'Bitcoin strategie sessie', description: '1-op-1 gesprek over Bitcoin adoptie, visie en persoonlijke groei.', category: 'kennis', price_sats: 75000, is_active: true, profiles: { first_name: 'Marc', last_name: 'van Versendaal', lightning_address: 'marc@getalby.com' } },
      { id: 'l5', author_id: 'demo-5', title: 'Crypto belastingcheck', description: 'Laat je crypto-bezit checken op correcte Box 3 opgave. 30 minuten sessie.', category: 'kennis', price_sats: 25000, is_active: true, profiles: { first_name: 'Sophie', last_name: 'de Vries', lightning_address: 'sophie@getalby.com' } },
      { id: 'l6', author_id: 'demo-4', title: 'Antminer S19 (gebruikt)', description: 'Antminer S19 Pro, 110 TH/s, goed werkend. Zelf ophalen in Den Haag.', category: 'product', price_sats: 2500000, is_active: true, profiles: { first_name: 'Jan', last_name: 'Bakker', lightning_address: 'jan@walletofsatoshi.com' } },
    ],
    events: [
      { id: 'e1', title: 'Monthly Meetup', description: 'De maandelijkse bijeenkomst van de Dutch Bitcoin Embassy. Netwerken, presentaties en discussie over de laatste Bitcoin ontwikkelingen.', location: 'Paviljoen de Witte, Den Haag', event_date: '2026-04-25T19:00:00Z', capacity: 30, is_published: true, _rsvpCount: 18 },
      { id: 'e2', title: 'Lightning Workshop', description: 'Hands-on workshop: zet je eigen Lightning node op en doe je eerste betaling. Laptop meenemen!', location: 'Dutch Bitcoin Embassy, Den Haag', event_date: '2026-05-02T18:30:00Z', capacity: 20, is_published: true, _rsvpCount: 8 },
      { id: 'e3', title: 'AI & Bitcoin Avond', description: 'Hoe AI en Bitcoin elkaar versterken. Met presentaties van Vincent de Wit en Bram Kanstein.', location: 'Dutch Bitcoin Embassy, Den Haag', event_date: '2026-05-09T20:00:00Z', capacity: 40, is_published: true, _rsvpCount: 23 },
    ],
    myRsvps: [{ event_id: 'e1', status: 'confirmed' }],
    channels: [
      { id: 'ch1', name: 'Macro & Markten', slug: 'macro', description: 'Bitcoin macro-economie, markten en trends', sort_order: 1 },
      { id: 'ch2', name: 'Technologie', slug: 'tech', description: 'Lightning, mining, development, privacy', sort_order: 2 },
      { id: 'ch3', name: 'Business & Deals', slug: 'business', description: 'Ondernemerschap, samenwerkingen, dealflow', sort_order: 3 },
      { id: 'ch4', name: 'Investeren', slug: 'investeren', description: 'Bitcoin als belegging, treasury, fondsen', sort_order: 4 },
      { id: 'ch5', name: 'Off-Topic', slug: 'off-topic', description: 'Alles buiten Bitcoin', sort_order: 5 },
    ],
    channelMessages: {
      ch1: [
        { id: 'm1', sender_id: 'demo-4', content: 'Die Fed meeting gisteren was interessant. Powell houdt voet bij stuk.', created_at: '2026-04-09T08:30:00Z', profiles: { first_name: 'Jan', last_name: 'Bakker' } },
        { id: 'm2', sender_id: 'demo-7', content: 'Ja, maar de markt prijst al 3 rate cuts in voor dit jaar. Bitcoin reageert amper.', created_at: '2026-04-09T08:35:00Z', profiles: { first_name: 'Lisa', last_name: 'Jansen' } },
        { id: 'm3', sender_id: 'demo-1', content: 'Volgende halving effect begint nu pas echt door te werken. Geduld.', created_at: '2026-04-09T09:12:00Z', profiles: { first_name: 'Pieter', last_name: 'Voogt' } },
        { id: 'm4', sender_id: 'demo-user-1', content: 'Iemand die het Tuur Demeester rapport heeft gelezen? Interessante take op de huidige cyclus.', created_at: '2026-04-09T10:05:00Z', profiles: { first_name: 'Vincent', last_name: 'de Wit' } },
      ],
      ch2: [
        { id: 'm5', sender_id: 'demo-6', content: 'Heeft iemand ervaring met LDK voor een custom Lightning wallet?', created_at: '2026-04-09T11:00:00Z', profiles: { first_name: 'Thomas', last_name: 'Smit' } },
        { id: 'm6', sender_id: 'demo-user-1', content: 'Nog niet, maar ik heb wel met Breez SDK gewerkt. Vergelijkbaar concept.', created_at: '2026-04-09T11:15:00Z', profiles: { first_name: 'Vincent', last_name: 'de Wit' } },
      ],
    }
  };

  // --- State ---
  const state = {
    user: null,
    profile: null,
    members: [],
    listings: [],
    events: [],
    myRsvps: [],
    channels: [],
    messages: [],
    currentChannel: null,
    screenHistory: ['login'],
    activeFilter: 'alle',
    activeMemberTag: 'Alle',
    realtimeChannel: null
  };

  // --- Navigation ---

  function navigate(screen) {
    const prev = state.screenHistory[state.screenHistory.length - 1];
    if (prev !== screen) {
      state.screenHistory.push(screen);
    }

    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById('screen-' + screen);
    if (el) el.classList.add('active');

    // Update nav
    document.querySelectorAll('.nav-item').forEach(n => {
      n.classList.toggle('active', n.dataset.screen === screen);
    });

    // Laad data per scherm
    switch (screen) {
      case 'leden': loadMembers(); break;
      case 'markt': loadListings(); break;
      case 'events': loadEvents(); break;
      case 'chat': loadChannels(); break;
      case 'mijn-profiel': renderMyProfile(); break;
    }
  }

  function goBack() {
    state.screenHistory.pop();
    const prev = state.screenHistory[state.screenHistory.length - 1] || 'leden';
    navigate(prev);
    state.screenHistory.pop(); // navigate adds it again
  }

  // --- Auth State ---

  async function handleAuthChange(event, session) {
    if (DEV_MODE) return; // Dev mode handles auth differently

    if (session?.user) {
      state.user = session.user;
      Auth.stopPolling();

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', state.user.id)
        .single();

      state.profile = data;

      if (!state.profile?.onboarding_completed) {
        document.getElementById('main-nav').style.display = 'none';
        navigate('onboarding');
      } else {
        showMainApp();
      }
    } else {
      state.user = null;
      state.profile = null;
      document.getElementById('main-nav').style.display = 'none';
      navigate('login');
      Auth.startLnurlLogin();
    }
  }

  function showMainApp() {
    document.getElementById('main-nav').style.display = 'flex';
    navigate('leden');
    if (state.profile?.membership_tier === 'admin') {
      const btnEvent = document.getElementById('btn-new-event');
      if (btnEvent) btnEvent.style.display = '';
    }
  }

  // Dev mode: skip login
  function devLogin() {
    state.user = DEMO.user;
    state.profile = DEMO.profile;
    showMainApp();
    showToast('Dev mode — demo data geladen', 'success');
  }

  // --- Onboarding ---

  function initOnboarding() {
    document.getElementById('onboarding-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button');
      btn.disabled = true;

      const updates = {
        first_name: document.getElementById('onb-firstname').value.trim(),
        last_name: document.getElementById('onb-lastname').value.trim(),
        company: document.getElementById('onb-company').value.trim(),
        job_title: document.getElementById('onb-jobtitle').value.trim(),
        lightning_address: document.getElementById('onb-lightning').value.trim(),
        expertise_tags: document.getElementById('onb-tags').value.split(',').map(t => t.trim()).filter(Boolean),
        bio: document.getElementById('onb-bio').value.trim(),
        onboarding_completed: true
      };

      if (!DEV_MODE) {
        const { error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', state.user.id);

        if (error) {
          showToast('Fout bij opslaan: ' + error.message, 'error');
          btn.disabled = false;
          return;
        }
      }

      state.profile = { ...state.profile, ...updates };
      document.getElementById('main-nav').style.display = 'flex';
      navigate('leden');
      showToast('Profiel opgeslagen!', 'success');
    });
  }

  // --- Smoelenboek ---

  async function loadMembers() {
    const grid = document.getElementById('members-grid');
    grid.innerHTML = '<div class="skeleton skeleton-card"></div><div class="skeleton skeleton-card"></div>';

    if (DEV_MODE) {
      state.members = DEMO.members;
    } else {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_profile_visible', true)
        .order('first_name');

      if (error) { showToast('Laden mislukt', 'error'); return; }
      state.members = data || [];
    }
    document.getElementById('member-count').textContent = state.members.length + ' leden';

    // Extract alle unieke tags
    const allTags = new Set();
    state.members.forEach(m => (m.expertise_tags || []).forEach(t => allTags.add(t)));
    renderMemberTags(['Alle', ...Array.from(allTags).sort()]);

    renderMembers(state.members);
  }

  function renderMemberTags(tags) {
    const container = document.getElementById('member-tags');
    container.innerHTML = tags.map(t =>
      `<div class="tag ${t === state.activeMemberTag ? 'active' : ''}" data-tag="${t}">${t}</div>`
    ).join('');

    container.addEventListener('click', (e) => {
      const tag = e.target.closest('.tag');
      if (!tag) return;
      state.activeMemberTag = tag.dataset.tag;
      container.querySelectorAll('.tag').forEach(t => t.classList.toggle('active', t.dataset.tag === state.activeMemberTag));
      filterMembers();
    });
  }

  function filterMembers() {
    const query = document.getElementById('member-search').value.toLowerCase();
    const tag = state.activeMemberTag;

    const filtered = state.members.filter(m => {
      const matchQuery = !query ||
        `${m.first_name} ${m.last_name}`.toLowerCase().includes(query) ||
        (m.company || '').toLowerCase().includes(query) ||
        (m.expertise_tags || []).some(t => t.toLowerCase().includes(query));
      const matchTag = tag === 'Alle' || (m.expertise_tags || []).includes(tag);
      return matchQuery && matchTag;
    });

    renderMembers(filtered);
  }

  function renderMembers(members) {
    const grid = document.getElementById('members-grid');
    if (!members.length) {
      grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><div class="empty-state-icon">&#128100;</div><div class="empty-state-text">Geen leden gevonden</div></div>';
      return;
    }

    grid.innerHTML = members.map(m => {
      const initials = (m.first_name?.[0] || '') + (m.last_name?.[0] || '');
      const avatarStyle = m.avatar_url
        ? `background-image:url(${m.avatar_url})`
        : `background:${getColor(m.id)}`;
      const tags = (m.expertise_tags || []).slice(0, 3);

      return `
        <div class="member-card" onclick="App.showProfile('${m.id}')">
          <div class="avatar" style="${avatarStyle}">${m.avatar_url ? '' : initials}</div>
          <div class="member-name">${m.first_name} ${m.last_name}</div>
          <div class="member-tags">${tags.map(t => `<span class="member-tag">${t}</span>`).join('')}</div>
          ${m.lightning_address ? `<div class="member-ln">&#9889; ${m.lightning_address}</div>` : ''}
        </div>`;
    }).join('');
  }

  function showProfile(id) {
    const m = state.members.find(p => p.id === id);
    if (!m) return;

    const initials = (m.first_name?.[0] || '') + (m.last_name?.[0] || '');
    const avatarStyle = m.avatar_url
      ? `background-image:url(${m.avatar_url})`
      : `background:${getColor(m.id)}`;
    const isOwn = state.user && m.id === state.user.id;

    document.getElementById('profiel-content').innerHTML = `
      <div class="profile-detail">
        <div class="profile-avatar" style="${avatarStyle}">${m.avatar_url ? '' : initials}</div>
        <div class="profile-name">${m.first_name} ${m.last_name}</div>
        <div class="profile-title">${[m.job_title, m.company].filter(Boolean).join(' bij ')}</div>
        ${m.bio ? `<div class="profile-bio">${escapeHtml(m.bio)}</div>` : ''}
        <div class="profile-tags-list">
          ${(m.expertise_tags || []).map(t => `<span class="member-tag">${t}</span>`).join('')}
        </div>
        ${m.lightning_address ? `
          <div class="profile-info-row">
            <span class="profile-info-label">&#9889;</span>
            <span class="profile-info-value">${m.lightning_address}</span>
            <button class="profile-info-copy" onclick="App.copyText('${m.lightning_address}')">Kopieer</button>
          </div>` : ''}
        ${m.linkedin_url ? `
          <div class="profile-info-row">
            <span class="profile-info-label">in</span>
            <a href="${m.linkedin_url}" target="_blank" class="profile-info-value" style="color:var(--accent)">${m.linkedin_url}</a>
          </div>` : ''}
        ${m.website_url ? `
          <div class="profile-info-row">
            <span class="profile-info-label">&#127760;</span>
            <a href="${m.website_url}" target="_blank" class="profile-info-value" style="color:var(--accent)">${m.website_url}</a>
          </div>` : ''}
        ${isOwn ? '<button class="btn btn-full" style="margin-top:20px" onclick="App.navigate(\'profiel-edit\')">Profiel bewerken</button>' : ''}
      </div>`;

    navigate('profiel');
  }

  // --- Profiel Bewerken ---

  function initEditProfile() {
    document.getElementById('edit-profile-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button[type=submit]');
      btn.disabled = true;

      const updates = {
        first_name: document.getElementById('edit-firstname').value.trim(),
        last_name: document.getElementById('edit-lastname').value.trim(),
        company: document.getElementById('edit-company').value.trim(),
        job_title: document.getElementById('edit-jobtitle').value.trim(),
        lightning_address: document.getElementById('edit-lightning').value.trim(),
        expertise_tags: document.getElementById('edit-tags').value.split(',').map(t => t.trim()).filter(Boolean),
        bio: document.getElementById('edit-bio').value.trim()
      };

      if (!DEV_MODE) {
        // Avatar upload
        const avatarInput = document.getElementById('edit-avatar');
        if (avatarInput.files.length > 0) {
          const file = avatarInput.files[0];
          const ext = file.name.split('.').pop();
          const path = `${state.user.id}/avatar.${ext}`;
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(path, file, { upsert: true });

          if (!uploadError) {
            const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
            updates.avatar_url = urlData.publicUrl;
          }
        }

        const { error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', state.user.id);

        if (error) {
          showToast('Fout: ' + error.message, 'error');
          btn.disabled = false;
          return;
        }
      }

      state.profile = { ...state.profile, ...updates };
      showToast('Profiel bijgewerkt!', 'success');
      goBack();
    });
  }

  function fillEditForm() {
    const p = state.profile;
    if (!p) return;
    document.getElementById('edit-firstname').value = p.first_name || '';
    document.getElementById('edit-lastname').value = p.last_name || '';
    document.getElementById('edit-company').value = p.company || '';
    document.getElementById('edit-jobtitle').value = p.job_title || '';
    document.getElementById('edit-lightning').value = p.lightning_address || '';
    document.getElementById('edit-tags').value = (p.expertise_tags || []).join(', ');
    document.getElementById('edit-bio').value = p.bio || '';
  }

  // --- Marktplaats ---

  async function loadListings() {
    const list = document.getElementById('market-list');
    list.innerHTML = '<div class="skeleton skeleton-card"></div><div class="skeleton skeleton-card"></div>';

    if (DEV_MODE) {
      state.listings = DEMO.listings;
    } else {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select('*, profiles(first_name, last_name, lightning_address)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) { showToast('Laden mislukt', 'error'); return; }
      state.listings = data || [];
    }
    renderListings(state.listings);
  }

  function renderListings(listings) {
    const list = document.getElementById('market-list');
    const filter = state.activeFilter;
    const filtered = filter === 'alle' ? listings : listings.filter(l => l.category === filter);

    if (!filtered.length) {
      list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128722;</div><div class="empty-state-text">Nog geen aanbiedingen</div></div>';
      return;
    }

    list.innerHTML = filtered.map(l => {
      const author = l.profiles;
      const authorName = author ? `${author.first_name} ${author.last_name}` : 'Onbekend';
      const isFree = !l.price_sats;
      const isOwn = state.user && l.author_id === state.user.id;

      return `
        <div class="market-item">
          <span class="market-badge badge-${l.category}">${l.category.charAt(0).toUpperCase() + l.category.slice(1)}</span>
          ${isOwn ? '<span class="market-badge" style="background:var(--accent-dim);color:var(--accent);margin-left:4px">Jouw aanbod</span>' : ''}
          <div class="market-title">${escapeHtml(l.title)}</div>
          <div class="market-desc">${escapeHtml(l.description || '')}</div>
          <div class="market-footer">
            <div class="market-price ${isFree ? 'free' : ''}">&#9889; ${isFree ? 'Gratis' : formatSats(l.price_sats)}</div>
            <div class="market-author">${authorName}</div>
          </div>
          ${author?.lightning_address ? `<button class="btn-outline btn-sm" style="margin-top:10px;width:100%" onclick="App.copyText('${author.lightning_address}')">&#9889; Kopieer Lightning address</button>` : ''}
        </div>`;
    }).join('');
  }

  function initMarketFilters() {
    document.getElementById('market-tags').addEventListener('click', (e) => {
      const tag = e.target.closest('.tag');
      if (!tag) return;
      state.activeFilter = tag.dataset.cat;
      document.querySelectorAll('#market-tags .tag').forEach(t =>
        t.classList.toggle('active', t.dataset.cat === state.activeFilter)
      );
      renderListings(state.listings);
    });
  }

  function initNewListing() {
    document.getElementById('new-listing-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button');
      btn.disabled = true;

      const priceVal = document.getElementById('listing-price').value;
      const listing = {
        author_id: state.user.id,
        title: document.getElementById('listing-title').value.trim(),
        description: document.getElementById('listing-desc').value.trim(),
        category: document.getElementById('listing-cat').value,
        price_sats: priceVal ? parseInt(priceVal) : null
      };

      if (DEV_MODE) {
        listing.id = 'demo-' + Date.now();
        listing.is_active = true;
        listing.profiles = { first_name: state.profile.first_name, last_name: state.profile.last_name, lightning_address: state.profile.lightning_address };
        state.listings.unshift(listing);
      } else {
        const { error } = await supabase.from('marketplace_listings').insert(listing);
        if (error) {
          showToast('Fout: ' + error.message, 'error');
          btn.disabled = false;
          return;
        }
      }

      e.target.reset();
      showToast('Aanbod geplaatst!', 'success');
      goBack();
    });
  }

  // --- Events ---

  async function loadEvents() {
    const list = document.getElementById('events-list');
    list.innerHTML = '<div class="skeleton skeleton-card"></div><div class="skeleton skeleton-card"></div>';

    if (DEV_MODE) {
      state.events = DEMO.events;
      state.myRsvps = DEMO.myRsvps;
    } else {
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .eq('is_published', true)
        .gte('event_date', new Date().toISOString())
        .order('event_date');

      const { data: rsvpData } = await supabase
        .from('event_rsvps')
        .select('event_id, status')
        .eq('user_id', state.user.id);

      state.events = eventsData || [];
      state.myRsvps = rsvpData || [];

      for (const evt of state.events) {
        const { count } = await supabase
          .from('event_rsvps')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', evt.id)
          .eq('status', 'confirmed');
        evt._rsvpCount = count || 0;
      }
    }

    renderEvents();
  }

  function renderEvents() {
    const list = document.getElementById('events-list');
    if (!state.events.length) {
      list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128197;</div><div class="empty-state-text">Geen aankomende events</div></div>';
      return;
    }

    list.innerHTML = state.events.map(evt => {
      const date = new Date(evt.event_date);
      const dateStr = date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' });
      const timeStr = date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
      const myRsvp = state.myRsvps.find(r => r.event_id === evt.id);
      const isRegistered = myRsvp?.status === 'confirmed';
      const count = evt._rsvpCount || 0;
      const pct = evt.capacity ? Math.min(100, (count / evt.capacity) * 100) : 0;
      const isFull = evt.capacity && count >= evt.capacity;

      return `
        <div class="event-card" onclick="App.showEventDetail('${evt.id}')">
          <div class="event-date">${dateStr} &bull; ${timeStr}</div>
          <div class="event-title">${escapeHtml(evt.title)}</div>
          ${evt.location ? `<div class="event-info">&#128205; ${escapeHtml(evt.location)}</div>` : ''}
          <div class="event-info">&#128101; ${count}${evt.capacity ? '/' + evt.capacity : ''} aangemeld</div>
          ${evt.capacity ? `<div class="event-bar"><div class="event-bar-fill" style="width:${pct}%"></div></div>` : ''}
          <button class="btn btn-sm btn-full ${isRegistered ? 'btn-registered' : ''}"
            onclick="event.stopPropagation(); App.toggleRsvp('${evt.id}')"
          >${isRegistered ? 'Aangemeld' : (isFull ? 'Wachtlijst' : 'Aanmelden')}</button>
        </div>`;
    }).join('');
  }

  async function toggleRsvp(eventId) {
    const existing = state.myRsvps.find(r => r.event_id === eventId);

    if (existing?.status === 'confirmed') {
      if (!DEV_MODE) {
        await supabase.from('event_rsvps').delete().eq('event_id', eventId).eq('user_id', state.user.id);
      }
      state.myRsvps = state.myRsvps.filter(r => r.event_id !== eventId);
      const evt = state.events.find(e => e.id === eventId);
      if (evt) evt._rsvpCount = Math.max(0, (evt._rsvpCount || 0) - 1);
      showToast('Afgemeld', 'success');
    } else {
      const evt = state.events.find(e => e.id === eventId);
      const isFull = evt?.capacity && (evt._rsvpCount || 0) >= evt.capacity;
      const status = isFull ? 'waitlist' : 'confirmed';

      if (!DEV_MODE) {
        await supabase.from('event_rsvps').upsert({
          event_id: eventId, user_id: state.user.id, status
        });
      }
      state.myRsvps.push({ event_id: eventId, status });
      if (evt && status === 'confirmed') evt._rsvpCount = (evt._rsvpCount || 0) + 1;
      showToast(isFull ? 'Op wachtlijst gezet' : 'Aangemeld!', 'success');
    }

    renderEvents();
  }

  async function showEventDetail(eventId) {
    const evt = state.events.find(e => e.id === eventId);
    if (!evt) return;

    const date = new Date(evt.event_date);
    const dateStr = date.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const timeStr = date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });

    let attendees = [];
    if (DEV_MODE) {
      // Simulate some attendees from demo members
      attendees = DEMO.members.slice(0, evt._rsvpCount || 3).map(m => ({ first_name: m.first_name, last_name: m.last_name }));
    } else {
      const { data: rsvps } = await supabase
        .from('event_rsvps')
        .select('profiles(first_name, last_name)')
        .eq('event_id', eventId)
        .eq('status', 'confirmed');
      attendees = (rsvps || []).map(r => r.profiles);
    }

    document.getElementById('event-detail-content').innerHTML = `
      <div class="event-date" style="font-size:14px;margin-bottom:12px">${dateStr} &bull; ${timeStr}</div>
      <h2 style="margin-bottom:16px">${escapeHtml(evt.title)}</h2>
      ${evt.location ? `<div class="event-info" style="margin-bottom:8px">&#128205; ${escapeHtml(evt.location)}</div>` : ''}
      ${evt.description ? `<p style="color:var(--muted);line-height:1.6;margin-bottom:20px">${escapeHtml(evt.description)}</p>` : ''}
      ${attendees.length ? `
        <div class="chat-section-label" style="margin-bottom:12px">Aangemeld (${attendees.length})</div>
        ${attendees.map(a => `<div style="padding:6px 0;font-size:14px">${a.first_name} ${a.last_name}</div>`).join('')}
      ` : ''}`;

    navigate('event-detail');
  }

  function initNewEvent() {
    document.getElementById('new-event-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button');
      btn.disabled = true;

      const capVal = document.getElementById('event-capacity').value;
      const evt = {
        title: document.getElementById('event-title').value.trim(),
        description: document.getElementById('event-desc').value.trim(),
        location: document.getElementById('event-location').value.trim(),
        event_date: new Date(document.getElementById('event-date').value).toISOString(),
        capacity: capVal ? parseInt(capVal) : null,
        is_published: true
      };

      if (DEV_MODE) {
        evt.id = 'demo-' + Date.now();
        evt._rsvpCount = 0;
        state.events.push(evt);
      } else {
        const { error } = await supabase.from('events').insert(evt);
        if (error) {
          showToast('Fout: ' + error.message, 'error');
          btn.disabled = false;
          return;
        }
      }

      e.target.reset();
      showToast('Event aangemaakt!', 'success');
      goBack();
    });
  }

  // --- Chat ---

  async function loadChannels() {
    const channelsList = document.getElementById('channels-list');
    const dmList = document.getElementById('dm-list');

    if (DEV_MODE) {
      state.channels = DEMO.channels;
    } else {
      const { data: channels } = await supabase
        .from('channels')
        .select('*')
        .order('sort_order');
      state.channels = channels || [];
    }

    const icons = { macro: '&#128200;', tech: '&#9889;', business: '&#128188;', investeren: '&#128176;', 'off-topic': '&#128172;' };

    channelsList.innerHTML = state.channels.map(ch => `
      <div class="channel-item" onclick="App.openChannel('${ch.id}', '${escapeHtml(ch.name)}')">
        <div class="channel-icon">${icons[ch.slug] || '#'}</div>
        <div class="channel-info">
          <div class="channel-name">${escapeHtml(ch.name)}</div>
          <div class="channel-desc">${escapeHtml(ch.description || '')}</div>
        </div>
      </div>
    `).join('');

    // DM conversations
    if (DEV_MODE) {
      dmList.innerHTML = '<div class="empty-state"><div class="empty-state-text" style="font-size:13px">Nog geen berichten</div></div>';
    } else {
      const { data: dms } = await supabase
        .from('messages')
        .select('sender_id, recipient_id, content, created_at, profiles!messages_sender_id_fkey(first_name, last_name)')
        .eq('is_direct_message', true)
        .or(`sender_id.eq.${state.user.id},recipient_id.eq.${state.user.id}`)
        .order('created_at', { ascending: false })
        .limit(20);

      const convos = {};
      (dms || []).forEach(msg => {
        const partnerId = msg.sender_id === state.user.id ? msg.recipient_id : msg.sender_id;
        if (!convos[partnerId]) convos[partnerId] = msg;
      });

      if (Object.keys(convos).length) {
        const partnerIds = Object.keys(convos);
        const { data: partners } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url')
          .in('id', partnerIds);

        dmList.innerHTML = (partners || []).map(p => {
          const lastMsg = convos[p.id];
          const initials = (p.first_name?.[0] || '') + (p.last_name?.[0] || '');
          return `
            <div class="dm-item" onclick="App.openDm('${p.id}', '${escapeHtml(p.first_name + ' ' + p.last_name)}')">
              <div class="channel-icon" style="border-radius:50%;background:${getColor(p.id)};font-size:14px">${initials}</div>
              <div class="channel-info">
                <div class="channel-name">${p.first_name} ${p.last_name}</div>
                <div class="channel-desc">${escapeHtml((lastMsg?.content || '').substring(0, 40))}</div>
              </div>
            </div>`;
        }).join('');
      } else {
        dmList.innerHTML = '<div class="empty-state"><div class="empty-state-text" style="font-size:13px">Nog geen berichten</div></div>';
      }
    }
  }

  async function openChannel(channelId, channelName) {
    state.currentChannel = { id: channelId, name: channelName, isDm: false };
    document.getElementById('channel-name').textContent = channelName;
    navigate('channel');
    await loadMessages(channelId, false);
    subscribeToMessages(channelId);
  }

  async function openDm(partnerId, partnerName) {
    state.currentChannel = { id: partnerId, name: partnerName, isDm: true };
    document.getElementById('channel-name').textContent = partnerName;
    navigate('channel');
    await loadDmMessages(partnerId);
    subscribeToDms(partnerId);
  }

  async function loadMessages(channelId, isDm) {
    const container = document.getElementById('chat-messages');
    container.innerHTML = '';

    if (DEV_MODE) {
      state.messages = DEMO.channelMessages[channelId] || [];
    } else {
      const { data } = await supabase
        .from('messages')
        .select('*, profiles(first_name, last_name, avatar_url)')
        .eq('channel_id', channelId)
        .eq('is_direct_message', false)
        .order('created_at', { ascending: true })
        .limit(50);
      state.messages = data || [];
    }
    renderMessages();
  }

  async function loadDmMessages(partnerId) {
    const container = document.getElementById('chat-messages');
    container.innerHTML = '';

    if (DEV_MODE) {
      state.messages = [];
    } else {
      const { data } = await supabase
        .from('messages')
        .select('*, profiles!messages_sender_id_fkey(first_name, last_name, avatar_url)')
        .eq('is_direct_message', true)
        .or(`and(sender_id.eq.${state.user.id},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${state.user.id})`)
        .order('created_at', { ascending: true })
        .limit(50);
      state.messages = data || [];
    }
    renderMessages();
  }

  function renderMessages() {
    const container = document.getElementById('chat-messages');
    container.innerHTML = state.messages.map(msg => {
      const isOwn = msg.sender_id === state.user.id;
      const profile = msg.profiles;
      const initials = profile ? (profile.first_name?.[0] || '') + (profile.last_name?.[0] || '') : '?';
      const time = new Date(msg.created_at).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });

      return `
        <div class="chat-bubble ${isOwn ? 'own' : ''}">
          <div class="chat-bubble-avatar" style="background:${getColor(msg.sender_id)}">${initials}</div>
          <div class="chat-bubble-body">
            ${!isOwn && profile ? `<div class="chat-bubble-name">${profile.first_name}</div>` : ''}
            <div class="chat-bubble-text">${escapeHtml(msg.content)}</div>
            <div class="chat-bubble-time">${time}</div>
          </div>
        </div>`;
    }).join('');

    container.scrollTop = container.scrollHeight;
  }

  function subscribeToMessages(channelId) {
    if (DEV_MODE) return;
    unsubscribeRealtime();
    state.realtimeChannel = supabase
      .channel('chat-' + channelId)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `channel_id=eq.${channelId}`
      }, async (payload) => {
        const msg = payload.new;
        // Haal profiel op
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', msg.sender_id)
          .single();
        msg.profiles = profile;
        state.messages.push(msg);
        renderMessages();
      })
      .subscribe();
  }

  function subscribeToDms(partnerId) {
    if (DEV_MODE) return;
    unsubscribeRealtime();
    state.realtimeChannel = supabase
      .channel('dm-' + partnerId)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `is_direct_message=eq.true`
      }, async (payload) => {
        const msg = payload.new;
        if (msg.sender_id !== partnerId && msg.sender_id !== state.user.id) return;
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', msg.sender_id)
          .single();
        msg.profiles = profile;
        state.messages.push(msg);
        renderMessages();
      })
      .subscribe();
  }

  function unsubscribeRealtime() {
    if (state.realtimeChannel && supabase) {
      supabase.removeChannel(state.realtimeChannel);
      state.realtimeChannel = null;
    }
  }

  function initChat() {
    document.getElementById('chat-send-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = document.getElementById('chat-input');
      const content = input.value.trim();
      if (!content || !state.currentChannel) return;

      input.value = '';

      const msg = {
        sender_id: state.user.id,
        content,
        is_direct_message: state.currentChannel.isDm
      };

      if (state.currentChannel.isDm) {
        msg.recipient_id = state.currentChannel.id;
      } else {
        msg.channel_id = state.currentChannel.id;
      }

      if (DEV_MODE) {
        // Simuleer bericht lokaal
        msg.id = 'demo-' + Date.now();
        msg.created_at = new Date().toISOString();
        msg.profiles = { first_name: state.profile.first_name, last_name: state.profile.last_name };
        state.messages.push(msg);
        renderMessages();
      } else {
        const { error } = await supabase.from('messages').insert(msg);
        if (error) showToast('Bericht niet verzonden', 'error');
      }
    });
  }

  // --- Mijn Profiel ---

  function renderMyProfile() {
    const p = state.profile;
    if (!p) return;

    const initials = (p.first_name?.[0] || '') + (p.last_name?.[0] || '');
    const avatarStyle = p.avatar_url
      ? `background-image:url(${p.avatar_url})`
      : `background:${getColor(p.id)}`;

    document.getElementById('my-profile-content').innerHTML = `
      <div class="profile-detail">
        <div class="profile-avatar" style="${avatarStyle}">${p.avatar_url ? '' : initials}</div>
        <div class="profile-name">${p.first_name} ${p.last_name}</div>
        <div class="profile-title">${[p.job_title, p.company].filter(Boolean).join(' bij ')}</div>
        ${p.bio ? `<div class="profile-bio">${escapeHtml(p.bio)}</div>` : ''}
        <div class="profile-tags-list">
          ${(p.expertise_tags || []).map(t => `<span class="member-tag">${t}</span>`).join('')}
        </div>
        ${p.lightning_address ? `
          <div class="profile-info-row">
            <span class="profile-info-label">&#9889;</span>
            <span class="profile-info-value">${p.lightning_address}</span>
          </div>` : ''}
        <div class="profile-info-row">
          <span class="profile-info-label">&#9889;</span>
          <span class="profile-info-value">${p.sats_balance || 0} sats</span>
        </div>
        <div class="profile-info-row">
          <span class="profile-info-label">&#128100;</span>
          <span class="profile-info-value">${p.membership_tier}</span>
        </div>
      </div>`;

    fillEditForm();
  }

  // --- Utility ---

  function showToast(msg, type = '') {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = 'toast show' + (type ? ' ' + type : '');
    setTimeout(() => toast.className = 'toast', 3000);
  }

  function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Gekopieerd!', 'success');
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function getColor(id) {
    const colors = ['#E68D3C', '#3FB950', '#A371F7', '#F85149', '#58A6FF', '#D2A8FF', '#79C0FF', '#FFA657'];
    let hash = 0;
    for (let i = 0; i < (id || '').length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }

  function formatSats(sats) {
    if (sats >= 1000000) return (sats / 1000000).toFixed(1) + 'M sats';
    if (sats >= 1000) return (sats / 1000).toFixed(0) + 'k sats';
    return sats + ' sats';
  }

  // --- Init ---

  function init() {
    // Search listener
    document.getElementById('member-search').addEventListener('input', filterMembers);

    if (DEV_MODE) {
      // Dev mode: voeg "Demo login" knop toe
      const loginContent = document.querySelector('.login-content');
      const devBtn = document.createElement('button');
      devBtn.className = 'btn btn-full';
      devBtn.style.marginTop = '16px';
      devBtn.style.background = '#3FB950';
      devBtn.textContent = 'Demo mode starten';
      devBtn.onclick = devLogin;
      loginContent.appendChild(devBtn);

      const devNote = document.createElement('div');
      devNote.style.cssText = 'color:var(--muted);font-size:11px;margin-top:12px;';
      devNote.textContent = 'Dev mode — geen Supabase verbinding nodig';
      loginContent.appendChild(devNote);
    } else {
      // Auth state listener
      supabase.auth.onAuthStateChange(handleAuthChange);

      // Check bestaande sessie
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) handleAuthChange('SIGNED_IN', session);
      });

      // Init LNURL
      Auth.init();
    }

    // Logout
    document.getElementById('btn-logout').addEventListener('click', async () => {
      if (!DEV_MODE) await supabase.auth.signOut();
      state.user = null;
      state.profile = null;
      document.getElementById('main-nav').style.display = 'none';
      navigate('login');
    });
    initOnboarding();
    initEditProfile();
    initMarketFilters();
    initNewListing();
    initNewEvent();
    initChat();

    // Offline detection
    window.addEventListener('online', () => {
      document.querySelector('.offline-banner')?.classList.remove('show');
    });
    window.addEventListener('offline', () => {
      let banner = document.querySelector('.offline-banner');
      if (!banner) {
        banner = document.createElement('div');
        banner.className = 'offline-banner';
        banner.textContent = 'Geen internetverbinding';
        document.body.prepend(banner);
      }
      banner.classList.add('show');
    });
  }

  // --- Expose ---
  window.App = {
    supabase,
    navigate,
    goBack: () => goBack(),
    showProfile,
    showEventDetail,
    toggleRsvp,
    openChannel,
    openDm,
    copyText,
    showToast,
    init
  };

  // Start app
  document.addEventListener('DOMContentLoaded', init);

  return window.App;
})();

// Global navigation helper
function navigate(s) { App.navigate(s); }
function goBack() { App.goBack(); }
