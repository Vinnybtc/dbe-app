// ============================================
// DBE Community App — Main Application
// ============================================

const App = (() => {

  // --- Config ---
  // TODO: Vervang met echte Supabase credentials
  const SUPABASE_URL = 'https://jvnbdbcwypgumfuclfha.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2bmJkYmN3eXBndW1mdWNsZmhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NjA3NjYsImV4cCI6MjA5MTMzNjc2Nn0.ZH49f4A-xnzQTkipJRqyaRr_vbX4tvMFhp-n69PDqO4';

  // Dev mode: via ?demo in URL, of als credentials niet ingevuld
  const DEV_MODE = SUPABASE_URL.includes('YOUR_PROJECT')
    || window.location.search.includes('demo')
    || window.location.hash.includes('demo');

  let supabase = null;
  if (!DEV_MODE) {
    try {
      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (e) {
      console.error('Supabase init failed, falling back to demo mode:', e);
    }
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
      // === Bestuur / Organisatie (admin) ===
      { id: 'demo-pieter', first_name: 'Pieter', last_name: 'Voogt', company: 'Dutch Bitcoin Embassy', job_title: 'Voorzitter', bio: 'Verbinder van de community. Ondernemer in hart en nieren.', expertise_tags: ['Verbinding', 'Business Development', 'Bitcoin Ondernemer', 'Bestuur'], lightning_address: 'pieter@getalby.com', avatar_url: null, membership_tier: 'admin', is_profile_visible: true, sats_balance: 210000 },
      { id: 'demo-marc', first_name: 'Marc', last_name: 'van Versendaal', company: 'Dutch Bitcoin Embassy', job_title: 'Bitcoin Advocate', bio: 'Visie & inspiratie. Innerlijke rijkdom boven alles.', expertise_tags: ['Visie & Inspiratie', 'Innerlijke Rijkdom', 'Bitcoin Advocate', 'Bestuur'], lightning_address: 'marc@getalby.com', avatar_url: null, membership_tier: 'admin', is_profile_visible: true, sats_balance: 88000 },
      { id: 'demo-user-1', first_name: 'Vincent', last_name: 'de Wit', company: 'Dutch Bitcoin Embassy', job_title: 'AI & Vastgoed', bio: 'Bouwt dingen met AI. Actief in Bitcoin community Den Haag.', expertise_tags: ['AI & Technologie', 'Vastgoed', 'Community Building', 'Bestuur'], lightning_address: 'vincent@getalby.com', avatar_url: null, membership_tier: 'admin', is_profile_visible: true, sats_balance: 150000 },
      { id: 'demo-bram', first_name: 'Bram', last_name: 'Kanstein', company: 'Dutch Bitcoin Embassy', job_title: 'Events & Content', bio: 'No-code builder, AI enthusiast, community events organisator.', expertise_tags: ['Events & Content', 'No-code', 'AI & Data', 'Bestuur'], lightning_address: 'bram@getalby.com', avatar_url: null, membership_tier: 'admin', is_profile_visible: true, sats_balance: 65000 },
      { id: 'demo-dirk', first_name: 'Dirk', last_name: 'Taat', company: 'Dutch Bitcoin Embassy', job_title: 'Organisatie', bio: '', expertise_tags: ['Organisatie', 'Energie'], lightning_address: null, avatar_url: null, membership_tier: 'admin', is_profile_visible: true, sats_balance: 0 },
      // === Leden uit Excel (60 leden, event 15 jan 2026) ===
      { id: 'demo-l01', first_name: 'Arno', last_name: 'Rootsaert', company: 'Vaips', job_title: '', bio: '', expertise_tags: [], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l02', first_name: 'Marco', last_name: 'Rutz', company: 'AC Samen Verder', job_title: '', bio: '', expertise_tags: [], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l03', first_name: 'Mike', last_name: 'Lelieveld', company: 'Bitcoin Alpha', job_title: 'Spreker', bio: '', expertise_tags: ['Bitcoin'], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l04', first_name: 'Ben', last_name: 'Heijmans', company: 'Heijmans Vloeronderhoud', job_title: '', bio: '', expertise_tags: [], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l05', first_name: 'Boris', last_name: 'van der Ven', company: '', job_title: 'Spreker', bio: '', expertise_tags: [], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l06', first_name: 'Catherine', last_name: 'Apotheker', company: 'Authentic Connections', job_title: '', bio: '', expertise_tags: [], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l07', first_name: 'Etienne', last_name: 'Timmermans', company: 'Flofeet Holding', job_title: '', bio: '', expertise_tags: [], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l08', first_name: 'Hugo', last_name: 'Leijtens', company: 'Cense', job_title: '', bio: '', expertise_tags: [], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l09', first_name: 'Jamie', last_name: 'van Vliet', company: 'Btc Operations', job_title: '', bio: '', expertise_tags: ['Bitcoin'], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l10', first_name: 'Jeroen', last_name: 'Blokland', company: 'Blokland Fund', job_title: 'Spreker', bio: '', expertise_tags: ['Investeren', 'Macro'], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l11', first_name: 'Joost', last_name: 'Jongbloed', company: 'Gradient', job_title: '', bio: '', expertise_tags: [], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l12', first_name: 'Jos', last_name: 'Lazet', company: 'Blockrise', job_title: 'Spreker', bio: '', expertise_tags: ['Bitcoin', 'Custody'], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l13', first_name: 'Lana', last_name: 'Langmuur', company: 'Foodcell', job_title: '', bio: '', expertise_tags: [], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l14', first_name: 'Lars', last_name: 'Heerink', company: 'Blockcentral', job_title: '', bio: '', expertise_tags: ['Bitcoin'], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l15', first_name: 'Laura', last_name: 'Peijs', company: 'Treasury', job_title: '', bio: '', expertise_tags: ['Investeren'], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l16', first_name: 'Lotte', last_name: 'Niens', company: 'Leyd', job_title: '', bio: '', expertise_tags: [], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l17', first_name: 'Meyade', last_name: 'Curfs', company: 'Bybit', job_title: '', bio: '', expertise_tags: ['Trading'], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l18', first_name: 'Nelis', last_name: 'van de Wiel', company: 'Vostroblock / Jan3', job_title: 'Spreker', bio: '', expertise_tags: ['Bitcoin', 'Mining'], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l19', first_name: 'Willem', last_name: 'Bikker', company: 'ID4IT BV', job_title: '', bio: '', expertise_tags: ['IT'], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l20', first_name: 'Onno', last_name: 'Langbroek', company: 'LightningPlaces', job_title: '', bio: '', expertise_tags: ['Lightning', 'Bitcoin'], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l21', first_name: 'Benjamin', last_name: 'Schriel', company: 'Brobs BV', job_title: '', bio: '', expertise_tags: [], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l22', first_name: 'Boukje', last_name: 'Jongedijk', company: 'Istone BV', job_title: '', bio: '', expertise_tags: [], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l23', first_name: 'Hans', last_name: 'Diederen', company: 'Blockrise', job_title: '', bio: '', expertise_tags: ['Bitcoin', 'Custody'], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l24', first_name: 'Hans', last_name: 'Kamerbeek', company: 'Kamerbeek Advocaten', job_title: '', bio: '', expertise_tags: ['Juridisch'], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l25', first_name: 'Jaco', last_name: 'Schilder', company: '', job_title: '', bio: '', expertise_tags: [], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l26', first_name: 'Janine', last_name: 'Hogendoorn', company: 'Ring-Ring', job_title: '', bio: '', expertise_tags: [], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l27', first_name: 'Jeroen', last_name: 'Meijer', company: 'Aandacht voor aandacht', job_title: '', bio: '', expertise_tags: [], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l28', first_name: 'Joost', last_name: 'Merkx', company: 'Merkx Holding BV', job_title: '', bio: '', expertise_tags: ['Investeren'], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l29', first_name: 'Jordy', last_name: 'den Toom', company: 'Money Tomorrow', job_title: '', bio: '', expertise_tags: ['Finance'], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l30', first_name: 'Jurjen', last_name: 'Meijer', company: 'Treasury', job_title: '', bio: '', expertise_tags: ['Investeren'], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l31', first_name: 'Khing', last_name: 'Oei', company: 'Treasury', job_title: 'Spreker', bio: '', expertise_tags: ['Investeren', 'Macro'], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l32', first_name: 'Leon', last_name: 'Kerckhaert', company: 'Elovate Finance', job_title: '', bio: '', expertise_tags: ['Finance'], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l33', first_name: 'Marco', last_name: 'Anink', company: 'Man in Finance', job_title: '', bio: '', expertise_tags: ['Finance'], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l34', first_name: 'Mark', last_name: 'Offerman', company: 'Blockrise', job_title: '', bio: '', expertise_tags: ['Bitcoin', 'Custody'], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l35', first_name: 'Mauro', last_name: 'Halve', company: 'Amdax / VBNL', job_title: '', bio: '', expertise_tags: ['Trading', 'Bitcoin'], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l36', first_name: 'Max', last_name: 'van den Tempel', company: 'Nederlands Bitcoin Instituut', job_title: '', bio: '', expertise_tags: ['Bitcoin', 'Educatie'], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l37', first_name: 'Morris', last_name: 'Verdonk', company: 'Bitcoin Safeguard', job_title: 'Spreker', bio: '', expertise_tags: ['Bitcoin', 'Security'], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l38', first_name: 'Nick', last_name: 'de Korte', company: '', job_title: '', bio: '', expertise_tags: [], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l39', first_name: 'Nick', last_name: 'Jansen', company: 'Gaaf Injectables', job_title: '', bio: '', expertise_tags: [], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l40', first_name: 'Paul', last_name: 'Brock', company: '', job_title: '', bio: '', expertise_tags: [], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l41', first_name: 'Peter', last_name: 'Konen', company: 'Gradient', job_title: '', bio: '', expertise_tags: [], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l42', first_name: 'Philip', last_name: 'Feenstra', company: 'Atomis BV', job_title: '', bio: '', expertise_tags: [], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l43', first_name: 'Pooya', last_name: 'Gohardani', company: 'ValueActive Solutions', job_title: '', bio: '', expertise_tags: [], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l44', first_name: 'Ramon', last_name: 'Lagrand', company: 'Bitcoin Training Center', job_title: '', bio: '', expertise_tags: ['Bitcoin', 'Educatie'], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l45', first_name: 'Remco', last_name: 'van Rijn', company: 'Rewire Recruitment', job_title: '', bio: '', expertise_tags: ['Recruitment'], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l46', first_name: 'Rick', last_name: 'van der Velden', company: 'ProVa-BV', job_title: '', bio: '', expertise_tags: [], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l47', first_name: 'Rutger', last_name: 'Damink', company: 'RDA21 BV', job_title: '', bio: '', expertise_tags: [], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l48', first_name: 'Shaqiel', last_name: 'Soebdhan', company: 'Bybit', job_title: '', bio: '', expertise_tags: ['Trading'], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l49', first_name: 'Simone', last_name: 'van der Eijk', company: 'Oak Finance', job_title: '', bio: '', expertise_tags: ['Finance'], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l50', first_name: 'Thomas', last_name: 'Rep', company: 'Blockcentral', job_title: '', bio: '', expertise_tags: ['Bitcoin'], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l51', first_name: 'Tom', last_name: 'Groos', company: 'Praeter', job_title: '', bio: '', expertise_tags: ['Energie'], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l52', first_name: 'Vincent', last_name: 'Jongedijk', company: 'Istone BV', job_title: '', bio: '', expertise_tags: [], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l53', first_name: 'Wenze', last_name: 'van Klink', company: 'The Bitcoin Adviser', job_title: '', bio: '', expertise_tags: ['Bitcoin', 'Advies'], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
      { id: 'demo-l54', first_name: 'Maarten', last_name: 'Smakman', company: '', job_title: 'Spreker', bio: '', expertise_tags: [], lightning_address: null, avatar_url: null, membership_tier: 'business_club', is_profile_visible: true, sats_balance: 0 },
    ],
    listings: [
      { id: 'l1', author_id: 'demo-pieter', title: 'Bitcoin node setup begeleiding', description: 'Hulp bij het opzetten van je eigen Bitcoin full node, inclusief Lightning.', category: 'dienst', price_sats: 50000, is_active: true, profiles: { first_name: 'Pieter', last_name: 'Voogt', lightning_address: 'pieter@getalby.com' } },
      { id: 'l2', author_id: 'demo-user-1', title: 'AI workflow automatisering', description: 'Automatiseer repetitieve taken met AI-gestuurde workflows. Van scraping tot rapportage.', category: 'dienst', price_sats: 100000, is_active: true, profiles: { first_name: 'Vincent', last_name: 'de Wit', lightning_address: 'vincent@getalby.com' } },
      { id: 'l3', author_id: 'demo-bram', title: 'Event organisatie support', description: 'Hulp bij het organiseren van Bitcoin meetups en events in Den Haag.', category: 'dienst', price_sats: null, is_active: true, profiles: { first_name: 'Bram', last_name: 'Kanstein', lightning_address: 'bram@getalby.com' } },
      { id: 'l4', author_id: 'demo-marc', title: 'Bitcoin strategie sessie', description: '1-op-1 gesprek over Bitcoin adoptie, visie en persoonlijke groei.', category: 'kennis', price_sats: 75000, is_active: true, profiles: { first_name: 'Marc', last_name: 'van Versendaal', lightning_address: 'marc@getalby.com' } },
      { id: 'l5', author_id: 'demo-l37', title: 'Bitcoin custody advies', description: 'Hoe beveilig je je Bitcoin het beste? Multisig, hardware wallets, inheritance planning.', category: 'kennis', price_sats: 25000, is_active: true, profiles: { first_name: 'Morris', last_name: 'Verdonk', lightning_address: null } },
      { id: 'l6', author_id: 'demo-l18', title: 'Mining consultancy', description: 'Advies over Bitcoin mining in Nederland. Van locatie tot stroomcontracten.', category: 'dienst', price_sats: 75000, is_active: true, profiles: { first_name: 'Nelis', last_name: 'van de Wiel', lightning_address: null } },
      { id: 'l7', author_id: 'demo-l44', title: 'Bitcoin workshop voor beginners', description: 'Leer de basics van Bitcoin in 2 uur. Inclusief eerste wallet setup.', category: 'kennis', price_sats: null, is_active: true, profiles: { first_name: 'Ramon', last_name: 'Lagrand', lightning_address: null } },
      { id: 'l8', author_id: 'demo-l53', title: 'Bitcoin financieel advies', description: 'Persoonlijk adviesgesprek over Bitcoin als onderdeel van je vermogensstrategie.', category: 'kennis', price_sats: 100000, is_active: true, profiles: { first_name: 'Wenze', last_name: 'van Klink', lightning_address: null } },
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
        { id: 'm1', sender_id: 'demo-l10', content: 'Die Fed meeting gisteren was interessant. Powell houdt voet bij stuk.', created_at: '2026-04-09T08:30:00Z', profiles: { first_name: 'Jeroen', last_name: 'Blokland' } },
        { id: 'm2', sender_id: 'demo-l31', content: 'Ja, maar de markt prijst al 3 rate cuts in voor dit jaar. Bitcoin reageert amper.', created_at: '2026-04-09T08:35:00Z', profiles: { first_name: 'Khing', last_name: 'Oei' } },
        { id: 'm3', sender_id: 'demo-pieter', content: 'Volgende halving effect begint nu pas echt door te werken. Geduld.', created_at: '2026-04-09T09:12:00Z', profiles: { first_name: 'Pieter', last_name: 'Voogt' } },
        { id: 'm4', sender_id: 'demo-user-1', content: 'Iemand die het Tuur Demeester rapport heeft gelezen? Interessante take op de huidige cyclus.', created_at: '2026-04-09T10:05:00Z', profiles: { first_name: 'Vincent', last_name: 'de Wit' } },
        { id: 'm5', sender_id: 'demo-l35', content: 'Ja gelezen. Zijn analyse over de miner capitulatie fase is spot on.', created_at: '2026-04-09T10:22:00Z', profiles: { first_name: 'Mauro', last_name: 'Halve' } },
        { id: 'm6', sender_id: 'demo-l12', content: 'Wat ik vooral interessant vind is de institutionele adoptie curve. ETF inflows zijn echt ongekend.', created_at: '2026-04-09T10:45:00Z', profiles: { first_name: 'Jos', last_name: 'Lazet' } },
      ],
      ch2: [
        { id: 'm7', sender_id: 'demo-l20', content: 'Heeft iemand ervaring met LNbits voor een community Lightning wallet?', created_at: '2026-04-09T11:00:00Z', profiles: { first_name: 'Onno', last_name: 'Langbroek' } },
        { id: 'm8', sender_id: 'demo-user-1', content: 'Ja, draai het zelf. Werkt prima voor kleine bedragen. Tip: gebruik de LNURLp extensie.', created_at: '2026-04-09T11:15:00Z', profiles: { first_name: 'Vincent', last_name: 'de Wit' } },
        { id: 'm9', sender_id: 'demo-l18', content: 'Voor mining monitoring gebruik ik Braiins OS+. Iemand anders ervaring met Luxor firmware?', created_at: '2026-04-09T13:20:00Z', profiles: { first_name: 'Nelis', last_name: 'van de Wiel' } },
        { id: 'm10', sender_id: 'demo-l14', content: 'Wij draaien Luxor op 3 machines. Stabiel, goede pool payouts.', created_at: '2026-04-09T13:35:00Z', profiles: { first_name: 'Lars', last_name: 'Heerink' } },
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
      case 'kennis': loadKennis(); break;
      case 'polls': loadPolls(); break;
      case 'leaderboard': loadLeaderboard(); break;
      case 'vragen': loadQuestions(); break;
      case 'profiel-edit': fillEditForm(); break;
      case 'deals': loadDeals(); break;
      case 'pods': loadPods(); break;
      case 'educatie': loadEducatie(); break;
      case 'feed': loadFeed(); break;
      case 'admin': loadAdmin(); break;
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
      document.querySelectorAll('#btn-new-event, #btn-new-poll, .nav-admin, #meer-admin').forEach(el => {
        if (el) el.style.display = '';
      });
    }
    if (state.profile?.membership_tier === 'admin' || state.profile?.membership_tier === 'business_club') {
      const btnArticle = document.getElementById('btn-new-article');
      if (btnArticle) btnArticle.style.display = '';
    }
    // Award sats for onboarding
    tryAwardSats('login', 100, 'Eerste login');
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

    // Spotlight banner
    const grid = document.getElementById('members-grid');
    const spotlightHtml = renderSpotlight();
    if (spotlightHtml) {
      const container = grid.parentElement;
      let existing = container.querySelector('.spotlight-banner');
      if (existing) existing.remove();
      grid.insertAdjacentHTML('beforebegin', spotlightHtml);
    }

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
          </div>
          ${!isOwn ? `<button class="tip-btn" style="margin-top:12px" onclick="event.stopPropagation(); App.showTipModal('${m.lightning_address}')">&#9889; Tip sturen</button>` : ''}
          ` : ''}
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
        ${isOwn ? '<button class="btn btn-full" style="margin-top:20px" onclick="App.navigate(\'profiel-edit\')">Profiel bewerken</button>' : `
          <div style="display:flex;gap:8px;margin-top:20px">
            <button class="btn" style="flex:1" onclick="App.openDm('${m.id}', '${escapeHtml(m.first_name + ' ' + m.last_name)}')">Stuur bericht</button>
            ${m.lightning_address ? `<button class="tip-btn" onclick="App.showTipModal('${m.lightning_address}')">&#9889; Tip</button>` : ''}
          </div>`}
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
    document.getElementById('edit-nostr').value = p.nostr_npub || '';
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

  // --- Feature 1: Bitcoin Ticker ---

  let tickerData = { prices: [], current: null, change24h: null };

  async function initTicker() {
    try {
      const res = await fetch('https://mempool.space/api/v1/prices');
      if (!res.ok) return;
      const data = await res.json();
      tickerData.current = data.EUR;
      document.getElementById('ticker-price').textContent = '€' + Number(tickerData.current).toLocaleString('nl-NL');
      document.getElementById('ticker-bar').style.display = 'flex';

      // Fetch historical for chart
      const histRes = await fetch('https://mempool.space/api/v1/mining/blocks/timestamp/' + (Date.now() / 1000 - 86400).toFixed(0));
      // Simple: just show current price, chart later
      updateTickerChange();
    } catch (e) {
      // Ticker is optional, fail silently
    }

    // Refresh every 60s
    setInterval(async () => {
      try {
        const res = await fetch('https://mempool.space/api/v1/prices');
        if (res.ok) {
          const data = await res.json();
          const prev = tickerData.current;
          tickerData.current = data.EUR;
          document.getElementById('ticker-price').textContent = '€' + Number(data.EUR).toLocaleString('nl-NL');
          if (prev) {
            const pct = ((data.EUR - prev) / prev * 100).toFixed(2);
            const el = document.getElementById('ticker-change');
            el.textContent = (pct >= 0 ? '+' : '') + pct + '%';
            el.className = 'ticker-change ' + (pct >= 0 ? 'up' : 'down');
          }
        }
      } catch (e) {}
    }, 60000);
  }

  function updateTickerChange() {
    // Placeholder — will be replaced with actual 24h change when historical data is available
    const el = document.getElementById('ticker-change');
    el.textContent = '';
  }

  function toggleTickerChart() {
    const chart = document.getElementById('ticker-chart');
    const toggle = document.getElementById('ticker-toggle');
    if (chart.style.display === 'none') {
      chart.style.display = 'block';
      toggle.classList.add('open');
    } else {
      chart.style.display = 'none';
      toggle.classList.remove('open');
    }
  }

  // --- Feature 2: Lightning Tipping ---

  function showTipModal(lightningAddress) {
    if (!lightningAddress) {
      showToast('Dit lid heeft geen Lightning address', 'error');
      return;
    }
    const modal = document.getElementById('tip-modal');
    const qrBox = document.getElementById('tip-modal-qr');
    const addrEl = document.getElementById('tip-modal-address');

    addrEl.textContent = lightningAddress;

    // Generate LNURL-pay from Lightning address
    const lnurl = 'lightning:' + lightningAddress;
    qrBox.innerHTML = '';
    if (typeof qrcode !== 'undefined') {
      const qr = qrcode(0, 'M');
      qr.addData(lnurl);
      qr.make();
      qrBox.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0 });
    } else {
      qrBox.innerHTML = `<div style="color:#000;font-size:10px;padding:8px;word-break:break-all">${lnurl}</div>`;
    }

    document.getElementById('tip-modal-copy').onclick = () => {
      copyText(lightningAddress);
    };

    modal.classList.add('show');
  }

  function closeTipModal() {
    document.getElementById('tip-modal').classList.remove('show');
  }

  // --- Feature 3: Polls ---

  const DEMO_POLLS = [
    {
      id: 'poll1', author_id: 'demo-pieter', question: 'Welk onderwerp voor de volgende meetup?',
      is_active: true, created_at: '2026-04-08T10:00:00Z',
      options: [
        { id: 'po1', label: 'Lightning Network deep-dive', votes: 12 },
        { id: 'po2', label: 'Bitcoin & belasting in NL', votes: 18 },
        { id: 'po3', label: 'Mining in Nederland', votes: 8 },
        { id: 'po4', label: 'Multisig & security', votes: 15 }
      ],
      myVote: 'po2', totalVotes: 53
    },
    {
      id: 'poll2', author_id: 'demo-bram', question: 'Telegram volledig vervangen door de DBE app?',
      is_active: true, created_at: '2026-04-07T14:00:00Z',
      options: [
        { id: 'po5', label: 'Ja, volledig overstappen', votes: 22 },
        { id: 'po6', label: 'Nee, naast elkaar gebruiken', votes: 14 },
        { id: 'po7', label: 'Eerst testen met kleine groep', votes: 19 }
      ],
      myVote: 'po5', totalVotes: 55
    }
  ];

  async function loadPolls() {
    const list = document.getElementById('polls-list');
    let polls;

    if (DEV_MODE) {
      polls = DEMO_POLLS;
    } else {
      // TODO: fetch from supabase with joins
      polls = [];
    }

    if (state.profile?.membership_tier === 'admin') {
      document.getElementById('btn-new-poll').style.display = '';
    }

    if (!polls.length) {
      list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128499;</div><div class="empty-state-text">Nog geen polls</div></div>';
      return;
    }

    list.innerHTML = polls.map(p => {
      const total = p.totalVotes || p.options.reduce((s, o) => s + (o.votes || 0), 0);
      return `
        <div class="poll-card">
          <div class="poll-question">${escapeHtml(p.question)}</div>
          ${p.options.map(o => {
            const pct = total ? Math.round(o.votes / total * 100) : 0;
            const isMyVote = p.myVote === o.id;
            return `
              <div class="poll-option ${isMyVote ? 'voted' : ''}" onclick="App.votePoll('${p.id}','${o.id}')">
                <div class="poll-option-bar" style="width:${pct}%"></div>
                <span class="poll-option-label">${escapeHtml(o.label)}</span>
                <span class="poll-option-pct">${pct}%</span>
              </div>`;
          }).join('')}
          <div class="poll-meta">${total} stemmen</div>
        </div>`;
    }).join('');
  }

  function votePoll(pollId, optionId) {
    if (DEV_MODE) {
      const poll = DEMO_POLLS.find(p => p.id === pollId);
      if (!poll) return;
      // Remove old vote
      if (poll.myVote) {
        const oldOpt = poll.options.find(o => o.id === poll.myVote);
        if (oldOpt) oldOpt.votes--;
      }
      // Add new vote
      const newOpt = poll.options.find(o => o.id === optionId);
      if (newOpt) newOpt.votes++;
      poll.myVote = optionId;
      poll.totalVotes = poll.options.reduce((s, o) => s + o.votes, 0);
      loadPolls();
      showToast('Stem uitgebracht!', 'success');
    }
  }

  function addPollOption() {
    const container = document.getElementById('poll-options-inputs');
    const count = container.children.length + 1;
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'input';
    input.style.marginBottom = '8px';
    input.placeholder = 'Optie ' + count;
    container.appendChild(input);
  }

  function initNewPoll() {
    document.getElementById('new-poll-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const question = document.getElementById('poll-question').value.trim();
      const optionInputs = document.querySelectorAll('#poll-options-inputs input');
      const options = Array.from(optionInputs).map(i => i.value.trim()).filter(Boolean);

      if (options.length < 2) { showToast('Minimaal 2 opties', 'error'); return; }

      if (DEV_MODE) {
        DEMO_POLLS.unshift({
          id: 'poll-' + Date.now(), author_id: state.user.id, question,
          is_active: true, created_at: new Date().toISOString(),
          options: options.map((label, i) => ({ id: 'po-' + Date.now() + i, label, votes: 0 })),
          myVote: null, totalVotes: 0
        });
      }

      e.target.reset();
      document.getElementById('poll-options-inputs').innerHTML =
        '<input type="text" class="input" style="margin-bottom:8px" placeholder="Optie 1" required>' +
        '<input type="text" class="input" style="margin-bottom:8px" placeholder="Optie 2" required>';
      showToast('Poll gestart!', 'success');
      goBack();
    });
  }

  // --- Feature 4: Push Notifications (registration) ---

  async function initPushNotifications() {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return;
    if (Notification.permission === 'granted') return;
    // We'll ask permission when user navigates to profile settings
  }

  async function requestPushPermission() {
    if (!('Notification' in window)) {
      showToast('Push notificaties niet ondersteund', 'error');
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      showToast('Notificaties ingeschakeld!', 'success');
    }
  }

  // --- Feature 5: Kennisbank ---

  const DEMO_ARTICLES = [
    { id: 'a1', title: 'Wat is Bitcoin?', category: 'wiki', excerpt: 'Een introductie tot Bitcoin voor beginners. Wat maakt het anders dan gewoon geld?', body: 'Bitcoin is een gedecentraliseerd digitaal betaalsysteem dat in 2009 werd gelanceerd door de pseudonieme ontwikkelaar Satoshi Nakamoto.\n\nBitcoin maakt het mogelijk om waarde over het internet te versturen zonder tussenpersonen zoals banken. Transacties worden geverifieerd door netwerkdeelnemers (miners) en vastgelegd in een openbaar grootboek: de blockchain.\n\nBelangrijke eigenschappen:\n- Maximaal 21 miljoen Bitcoin\n- Gedecentraliseerd: geen enkele partij heeft controle\n- Censuurbestendig: niemand kan je transactie tegenhouden\n- Open source: iedereen kan de code controleren\n- Pseudoniem: adressen zijn niet direct gekoppeld aan identiteit', author: { first_name: 'Ramon', last_name: 'Lagrand' }, published_at: '2026-03-15', _tag: 'beginner' },
    { id: 'a2', title: 'Lightning Network uitgelegd', category: 'wiki', excerpt: 'Hoe werkt het Lightning Network en waarom is het belangrijk voor Bitcoin betalingen?', body: 'Het Lightning Network is een "layer 2" protocol bovenop Bitcoin dat snelle en goedkope betalingen mogelijk maakt.\n\nHoe werkt het?\n1. Twee partijen openen een betalingskanaal op de Bitcoin blockchain\n2. Ze kunnen onbeperkt transacties doen binnen dit kanaal\n3. Alleen de opening en sluiting worden op-chain vastgelegd\n\nVoordelen:\n- Vrijwel instant betalingen (milliseconden)\n- Extreem lage kosten (fracties van een cent)\n- Schaalbaarheid: miljoenen transacties per seconde\n- Privacy: tussenliggende transacties zijn niet publiek\n\nPopulaire Lightning wallets: Phoenix, Breez, Zeus, Alby', author: { first_name: 'Onno', last_name: 'Langbroek' }, published_at: '2026-03-20', _tag: 'gevorderd' },
    { id: 'a3', title: 'Bitcoin bewaren: hot vs cold wallet', category: 'education', excerpt: 'De verschillen tussen hot wallets en cold storage, en wanneer je welke gebruikt.', body: 'Hot wallet = verbonden met internet. Handig voor dagelijks gebruik, minder veilig voor grote bedragen.\n\nCold storage = offline bewaring. Veiliger, maar minder handig.\n\nVoorbeelden hot wallets:\n- Phoenix (Lightning)\n- BlueWallet\n- Alby (browser extension)\n\nVoorbeelden cold storage:\n- Trezor (hardware wallet)\n- Coldcard (hardware wallet)\n- Seed phrase op staal (Seedplate)\n\nVuistregel:\n- Dagelijks gebruik: hot wallet met klein bedrag\n- Spaargeld: hardware wallet\n- Groot vermogen: multisig setup', author: { first_name: 'Morris', last_name: 'Verdonk' }, published_at: '2026-04-01', _tag: 'beginner' },
    { id: 'a4', title: 'Multisig in de praktijk', category: 'article', excerpt: 'Een praktische gids voor het opzetten van een 2-of-3 multisig setup voor je Bitcoin.', body: 'Multisig (multi-signature) betekent dat meerdere sleutels nodig zijn om een transactie te tekenen.\n\nEen 2-of-3 setup: je hebt 3 sleutels, waarvan 2 nodig zijn om te spenderen.\n\nWaarom multisig?\n- Geen single point of failure\n- Bescherming tegen diefstal\n- Inheritance planning\n\nTools:\n- Sparrow Wallet (desktop)\n- Nunchuk (mobiel)\n- Specter (self-hosted)\n\nStappen:\n1. Koop 3 hardware wallets (bijv. 2x Trezor + 1x Coldcard)\n2. Genereer 3 seeds, bewaar ze op aparte locaties\n3. Stel multisig wallet in met Sparrow\n4. Test met klein bedrag\n5. Documenteer je setup (voor erfgenamen)', author: { first_name: 'Morris', last_name: 'Verdonk' }, published_at: '2026-04-05', _tag: 'technisch' },
  ];

  let activeKennisFilter = 'alle';

  async function loadKennis() {
    const list = document.getElementById('kennis-list');

    if (state.profile?.membership_tier === 'admin' || state.profile?.membership_tier === 'business_club') {
      document.getElementById('btn-new-article').style.display = '';
    }

    let articles;
    if (DEV_MODE) {
      articles = DEMO_ARTICLES;
    } else {
      const { data } = await supabase.from('content').select('*, profiles:author_id(first_name, last_name)')
        .eq('is_published', true).order('published_at', { ascending: false });
      articles = data || [];
    }

    const filtered = activeKennisFilter === 'alle' ? articles : articles.filter(a => a._tag === activeKennisFilter || a.category === activeKennisFilter);

    if (!filtered.length) {
      list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128218;</div><div class="empty-state-text">Nog geen artikelen</div></div>';
      return;
    }

    list.innerHTML = filtered.map(a => `
      <div class="kennis-card" onclick="App.showArticle('${a.id}')">
        <span class="kennis-cat">${a.category}</span>
        <div class="kennis-title">${escapeHtml(a.title)}</div>
        <div class="kennis-excerpt">${escapeHtml(a.excerpt || '')}</div>
      </div>
    `).join('');
  }

  function showArticle(id) {
    const a = (DEV_MODE ? DEMO_ARTICLES : []).find(x => x.id === id);
    if (!a) return;
    const author = a.author || a.profiles;
    document.getElementById('kennis-detail-content').innerHTML = `
      <span class="kennis-cat">${a.category}</span>
      <h2 style="margin:12px 0">${escapeHtml(a.title)}</h2>
      ${author ? `<div style="color:var(--muted);font-size:13px;margin-bottom:16px">Door ${author.first_name} ${author.last_name}</div>` : ''}
      <div class="kennis-body">${escapeHtml(a.body || '')}</div>
    `;
    navigate('kennis-detail');
  }

  function initKennisFilters() {
    document.getElementById('kennis-tags').addEventListener('click', (e) => {
      const tag = e.target.closest('.tag');
      if (!tag) return;
      activeKennisFilter = tag.dataset.cat;
      document.querySelectorAll('#kennis-tags .tag').forEach(t =>
        t.classList.toggle('active', t.dataset.cat === activeKennisFilter)
      );
      loadKennis();
    });
  }

  function initNewArticle() {
    document.getElementById('new-article-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const article = {
        title: document.getElementById('article-title').value.trim(),
        category: document.getElementById('article-category').value,
        excerpt: document.getElementById('article-excerpt').value.trim(),
        body: document.getElementById('article-body').value.trim(),
        slug: document.getElementById('article-title').value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        author_id: state.user.id,
        is_published: true,
        published_at: new Date().toISOString()
      };

      if (DEV_MODE) {
        article.id = 'a-' + Date.now();
        article.author = { first_name: state.profile.first_name, last_name: state.profile.last_name };
        DEMO_ARTICLES.unshift(article);
      } else {
        const { error } = await supabase.from('content').insert(article);
        if (error) { showToast('Fout: ' + error.message, 'error'); return; }
      }

      e.target.reset();
      showToast('Artikel gepubliceerd!', 'success');
      goBack();
    });
  }

  // --- Feature 6: Leden Zoek-Match ---

  function initMatch() {
    document.getElementById('match-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const query = document.getElementById('match-query').value.toLowerCase().trim();
      if (!query) return;

      const keywords = query.split(/[\s,]+/).filter(Boolean);
      const scored = state.members.map(m => {
        let score = 0;
        const searchable = [
          m.first_name, m.last_name, m.company, m.job_title, m.bio,
          ...(m.expertise_tags || [])
        ].filter(Boolean).join(' ').toLowerCase();

        keywords.forEach(kw => {
          if (searchable.includes(kw)) score += 10;
          // Partial match
          (m.expertise_tags || []).forEach(tag => {
            if (tag.toLowerCase().includes(kw)) score += 20;
          });
          if ((m.company || '').toLowerCase().includes(kw)) score += 5;
          if ((m.bio || '').toLowerCase().includes(kw)) score += 3;
        });

        return { member: m, score };
      }).filter(r => r.score > 0).sort((a, b) => b.score - a.score).slice(0, 5);

      const results = document.getElementById('match-results');
      if (!scored.length) {
        results.innerHTML = '<div class="empty-state"><div class="empty-state-text">Geen matches gevonden. Probeer andere zoektermen.</div></div>';
        return;
      }

      results.innerHTML = '<div class="chat-section-label">Beste matches</div>' +
        scored.map(({ member: m, score }) => {
          const initials = (m.first_name?.[0] || '') + (m.last_name?.[0] || '');
          return `
            <div class="channel-item" onclick="App.showProfile('${m.id}')" style="margin-bottom:8px">
              <div class="channel-icon" style="border-radius:50%;background:${getColor(m.id)};font-size:14px">${initials}</div>
              <div class="channel-info">
                <div class="channel-name">${m.first_name} ${m.last_name} <span class="match-score">${score}pt</span></div>
                <div class="channel-desc">${[m.job_title, m.company].filter(Boolean).join(' — ')}</div>
              </div>
            </div>`;
        }).join('');
    });
  }

  // --- Feature 7: Event Foto's (in event detail) ---

  // Photo upload is handled in event detail view — add upload button there
  // For demo: show placeholder message

  // --- Feature 8: Sats Leaderboard & Achievements ---

  const DEMO_ACHIEVEMENTS = [
    { slug: 'early_adopter', name: 'Early Adopter', icon: '🏆', earned: true },
    { slug: 'profile_complete', name: 'Profiel Compleet', icon: '✅', earned: true },
    { slug: 'first_message', name: 'Eerste Bericht', icon: '💬', earned: true },
    { slug: 'event_attendee', name: 'Event Bezoeker', icon: '🎫', earned: true },
    { slug: 'marketplace_seller', name: 'Aanbieder', icon: '🏪', earned: false },
    { slug: 'community_builder', name: 'Community Builder', icon: '🔥', earned: false },
    { slug: 'lightning_pro', name: 'Lightning Pro', icon: '⚡', earned: true },
    { slug: 'social_butterfly', name: 'Netwerker', icon: '🦋', earned: false },
    { slug: 'poll_voter', name: 'Stemmer', icon: '🗳️', earned: true },
    { slug: 'nostr_linked', name: 'Nostr Verified', icon: '🟣', earned: false },
  ];

  async function loadLeaderboard() {
    const list = document.getElementById('leaderboard-list');
    const badgeList = document.getElementById('achievements-list');

    // Sort members by sats
    const ranked = [...state.members].sort((a, b) => (b.sats_balance || 0) - (a.sats_balance || 0)).slice(0, 15);

    list.innerHTML = ranked.map((m, i) => {
      const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
      return `
        <div class="lb-item" onclick="App.showProfile('${m.id}')">
          <div class="lb-rank ${rankClass}">#${i + 1}</div>
          <div class="avatar" style="width:36px;height:36px;font-size:14px;background:${getColor(m.id)};margin:0">${(m.first_name?.[0] || '') + (m.last_name?.[0] || '')}</div>
          <div class="lb-info">
            <div class="lb-name">${m.first_name} ${m.last_name}</div>
            <div class="lb-company">${m.company || ''}</div>
          </div>
          <div class="lb-sats">&#9889; ${formatSats(m.sats_balance || 0)}</div>
        </div>`;
    }).join('');

    // Badges
    const badges = DEV_MODE ? DEMO_ACHIEVEMENTS : [];
    badgeList.innerHTML = badges.map(b =>
      `<span class="badge-card ${b.earned ? 'earned' : ''}"><span class="badge-icon">${b.icon}</span> ${b.name}</span>`
    ).join('');
  }

  // --- Feature: Accountability Pods ---

  const DEMO_PODS = [
    { id: 'pod1', name: 'DCA Discipline', goal: 'Elke week Bitcoin kopen', description: 'We houden elkaar scherp op consistent stacking.', members: ['demo-user-1', 'demo-l09', 'demo-l14', 'demo-l35'], max_members: 6, memberProfiles: [
      { first_name: 'Vincent', last_name: 'de Wit' }, { first_name: 'Jamie', last_name: 'van Vliet' },
      { first_name: 'Lars', last_name: 'Heerink' }, { first_name: 'Mauro', last_name: 'Halve' }
    ]},
    { id: 'pod2', name: 'Node Runners', goal: 'Eigen Bitcoin node draaien', description: 'Van installatie tot onderhoud — samen leren.', members: ['demo-l20', 'demo-l06', 'demo-l37'], max_members: 5, memberProfiles: [
      { first_name: 'Onno', last_name: 'Langbroek' }, { first_name: 'Thomas', last_name: 'Rep' },
      { first_name: 'Morris', last_name: 'Verdonk' }
    ]},
    { id: 'pod3', name: 'Bitcoin Bookclub', goal: 'Elke maand een Bitcoin boek lezen', description: 'The Bitcoin Standard, Broken Money, etc.', members: ['demo-marc', 'demo-l36', 'demo-l53', 'demo-l44', 'demo-l10'], max_members: 6, memberProfiles: [
      { first_name: 'Marc', last_name: 'van Versendaal' }, { first_name: 'Max', last_name: 'van den Tempel' },
      { first_name: 'Wenze', last_name: 'van Klink' }, { first_name: 'Ramon', last_name: 'Lagrand' },
      { first_name: 'Jeroen', last_name: 'Blokland' }
    ]},
  ];

  async function loadPods() {
    const list = document.getElementById('pods-list');
    const pods = DEV_MODE ? DEMO_PODS : [];

    if (!pods.length) {
      list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128101;</div><div class="empty-state-text">Nog geen pods</div></div>';
      return;
    }

    list.innerHTML = pods.map(p => {
      const isMember = p.members.includes(state.user?.id);
      const isFull = p.members.length >= p.max_members;
      return `
        <div class="pod-card">
          <div class="pod-goal">${escapeHtml(p.goal)}</div>
          <div class="market-title">${escapeHtml(p.name)}</div>
          <div class="market-desc">${escapeHtml(p.description || '')}</div>
          <div class="pod-members-row">
            ${p.memberProfiles.map(m => `<div class="avatar" style="background:${getColor(m.first_name)}">${m.first_name[0]}${m.last_name[0]}</div>`).join('')}
            <span class="pod-count">${p.members.length}/${p.max_members}</span>
          </div>
          <button class="btn btn-sm" style="margin-top:12px;width:100%" ${isMember ? 'disabled' : ''}>
            ${isMember ? 'Lid' : isFull ? 'Vol' : 'Deelnemen'}
          </button>
        </div>`;
    }).join('');
  }

  function initNewPod() {
    document.getElementById('new-pod-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (DEV_MODE) {
        DEMO_PODS.push({
          id: 'pod-' + Date.now(),
          name: document.getElementById('pod-name').value.trim(),
          goal: document.getElementById('pod-goal').value.trim(),
          description: document.getElementById('pod-desc').value.trim(),
          members: [state.user.id], max_members: 6,
          memberProfiles: [{ first_name: state.profile.first_name, last_name: state.profile.last_name }]
        });
      }
      e.target.reset();
      showToast('Pod gestart!', 'success');
      goBack();
    });
  }

  // --- Feature: Deal Flow ---

  const DEMO_DEALS = [
    { id: 'd1', author_id: 'demo-l32', title: 'Mede-investeerder gezocht voor Bitcoin mining faciliteit', description: 'We hebben een locatie in Zeeland met goedkoop stroomcontract. Zoeken 1-2 partners voor gezamenlijke investering in 10 Antminer S21 Pro machines.', deal_type: 'investering', status: 'open', profiles: { first_name: 'Leon', last_name: 'Kerckhaert' } },
    { id: 'd2', author_id: 'demo-pieter', title: 'Spreker gezocht voor Lightning Workshop', description: 'We zoeken iemand die een hands-on Lightning workshop kan geven voor de mei-meetup. Vergoeding in sats.', deal_type: 'samenwerking', status: 'open', profiles: { first_name: 'Pieter', last_name: 'Voogt' } },
    { id: 'd3', author_id: 'demo-user-1', title: 'Bitcoin betaalintegratie voor webshop', description: 'Ik bouw een BTCPay Server integratie voor Nederlandse webshops. Zoek beta-testers met een eigen shop.', deal_type: 'project', status: 'open', profiles: { first_name: 'Vincent', last_name: 'de Wit' } },
    { id: 'd4', author_id: 'demo-l12', title: 'Compliance Officer - Blockrise', description: 'Blockrise zoekt een compliance officer met kennis van crypto regelgeving in NL/EU. Parttime mogelijk.', deal_type: 'vacature', status: 'open', profiles: { first_name: 'Jos', last_name: 'Lazet' } },
  ];

  let activeDealFilter = 'alle';

  async function loadDeals() {
    const list = document.getElementById('deals-list');
    const deals = DEV_MODE ? DEMO_DEALS : [];
    const filtered = activeDealFilter === 'alle' ? deals : deals.filter(d => d.deal_type === activeDealFilter);

    if (!filtered.length) {
      list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#129309;</div><div class="empty-state-text">Geen deals</div></div>';
      return;
    }

    list.innerHTML = filtered.map(d => `
      <div class="deal-card">
        <span class="deal-type-badge ${d.deal_type}">${d.deal_type}</span>
        <span class="deal-type-badge" style="background:${d.status === 'open' ? 'var(--success-dim)' : 'var(--border)'};color:${d.status === 'open' ? 'var(--success)' : 'var(--muted)'};margin-left:4px">${d.status}</span>
        <div class="market-title">${escapeHtml(d.title)}</div>
        <div class="market-desc">${escapeHtml(d.description || '')}</div>
        <div class="market-author">${d.profiles.first_name} ${d.profiles.last_name}</div>
      </div>`).join('');
  }

  function initDealFilters() {
    document.getElementById('deal-tags').addEventListener('click', (e) => {
      const tag = e.target.closest('.tag');
      if (!tag) return;
      activeDealFilter = tag.dataset.cat;
      document.querySelectorAll('#deal-tags .tag').forEach(t => t.classList.toggle('active', t.dataset.cat === activeDealFilter));
      loadDeals();
    });
  }

  function initNewDeal() {
    document.getElementById('new-deal-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (DEV_MODE) {
        DEMO_DEALS.unshift({
          id: 'd-' + Date.now(), author_id: state.user.id,
          title: document.getElementById('deal-title').value.trim(),
          description: document.getElementById('deal-desc').value.trim(),
          deal_type: document.getElementById('deal-type').value,
          status: 'open', profiles: { first_name: state.profile.first_name, last_name: state.profile.last_name }
        });
      }
      e.target.reset();
      showToast('Deal geplaatst!', 'success');
      goBack();
    });
  }

  // --- Feature: Bitcoin Educatie Paden ---

  const DEMO_EDU = [
    { id: 'ep1', title: 'Bitcoin Basics', description: 'Begrijp wat Bitcoin is en hoe het werkt', difficulty: 'beginner', lessons: [
      { id: 'les1', title: 'Wat is geld?', done: true },
      { id: 'les2', title: 'Het probleem met fiatgeld', done: true },
      { id: 'les3', title: 'Wat is Bitcoin?', done: true },
      { id: 'les4', title: 'Hoe werkt de blockchain?', done: false },
      { id: 'les5', title: 'Je eerste wallet', done: false },
      { id: 'les6', title: 'Bitcoin kopen in Nederland', done: false },
    ]},
    { id: 'ep2', title: 'Bitcoin Verdiepen', description: 'Van HODLen tot Lightning Network', difficulty: 'intermediate', lessons: [
      { id: 'les7', title: 'UTXO model uitgelegd', done: false },
      { id: 'les8', title: 'Mining en proof-of-work', done: false },
      { id: 'les9', title: 'Lightning Network basics', done: false },
      { id: 'les10', title: 'Multisig en veiligheid', done: false },
      { id: 'les11', title: 'Privacy op Bitcoin', done: false },
    ]},
    { id: 'ep3', title: 'Bitcoin voor Ondernemers', description: 'Bitcoin in je bedrijf: treasury, betalingen, strategie', difficulty: 'advanced', lessons: [
      { id: 'les12', title: 'Bitcoin treasury strategie', done: false },
      { id: 'les13', title: 'BTCPay Server opzetten', done: false },
      { id: 'les14', title: 'Boekhoudkundige verwerking', done: false },
      { id: 'les15', title: 'Belasting en Bitcoin in NL', done: false },
    ]},
  ];

  async function loadEducatie() {
    const list = document.getElementById('educatie-paths');
    const paths = DEV_MODE ? DEMO_EDU : [];

    list.innerHTML = paths.map(p => {
      const done = p.lessons.filter(l => l.done).length;
      const pct = Math.round(done / p.lessons.length * 100);
      return `
        <div class="edu-path-card" onclick="App.showEduPath('${p.id}')">
          <span class="edu-difficulty ${p.difficulty}">${p.difficulty}</span>
          <div class="market-title">${escapeHtml(p.title)}</div>
          <div class="market-desc">${escapeHtml(p.description)}</div>
          <div style="font-size:12px;color:var(--muted);margin-top:8px">${done}/${p.lessons.length} lessen &bull; ${pct}% compleet</div>
          <div class="edu-progress"><div class="edu-progress-fill" style="width:${pct}%"></div></div>
        </div>`;
    }).join('');
  }

  function showEduPath(id) {
    const p = DEMO_EDU.find(x => x.id === id);
    if (!p) return;
    document.getElementById('educatie-pad-content').innerHTML = `
      <span class="edu-difficulty ${p.difficulty}">${p.difficulty}</span>
      <h2 style="margin:12px 0">${escapeHtml(p.title)}</h2>
      <p class="text-muted" style="margin-bottom:20px">${escapeHtml(p.description)}</p>
      ${p.lessons.map((l, i) => `
        <div class="edu-lesson" onclick="App.toggleLesson('${id}','${l.id}')">
          <div class="edu-lesson-num ${l.done ? 'done' : ''}">${l.done ? '&#10003;' : i + 1}</div>
          <div class="edu-lesson-title">${escapeHtml(l.title)}</div>
        </div>`).join('')}
    `;
    navigate('educatie-pad');
  }

  function toggleLesson(pathId, lessonId) {
    const p = DEMO_EDU.find(x => x.id === pathId);
    if (!p) return;
    const l = p.lessons.find(x => x.id === lessonId);
    if (!l) return;
    l.done = !l.done;
    if (l.done) {
      awardSats(100, 'Les afgerond: ' + l.title);
    }
    showEduPath(pathId);
  }

  // --- Feature: Sats Verdien-Systeem ---

  function awardSats(amount, reason) {
    if (!state.profile) return;
    state.profile.sats_balance = (state.profile.sats_balance || 0) + amount;
    // Update in members array too
    const me = state.members.find(m => m.id === state.user?.id);
    if (me) me.sats_balance = state.profile.sats_balance;
    showToast(`+${amount} sats: ${reason}`, 'success');

    if (!DEV_MODE && supabase) {
      supabase.rpc('increment_sats_balance', { user_id_input: state.user.id, amount_input: amount });
      supabase.from('sats_transactions').insert({ user_id: state.user.id, amount, type: 'earn', reason });
    }
  }

  // Track actions for sats
  let satsAwarded = {};
  function tryAwardSats(key, amount, reason) {
    if (satsAwarded[key]) return;
    satsAwarded[key] = true;
    awardSats(amount, reason);
  }

  // --- Feature: Member Spotlight ---

  function getSpotlightMember() {
    // Pick a member based on the current week
    const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    const eligible = state.members.filter(m => m.id !== state.user?.id && m.first_name);
    if (!eligible.length) return null;
    return eligible[weekNum % eligible.length];
  }

  function renderSpotlight() {
    const m = getSpotlightMember();
    if (!m) return '';
    const initials = (m.first_name?.[0] || '') + (m.last_name?.[0] || '');
    return `
      <div class="spotlight-banner" onclick="App.showProfile('${m.id}')">
        <div class="avatar" style="width:40px;height:40px;font-size:14px;background:${getColor(m.id)};margin:0">${initials}</div>
        <div>
          <div class="spotlight-label">Member Spotlight</div>
          <div class="spotlight-name">${m.first_name} ${m.last_name}</div>
          <div class="spotlight-sub">${[m.job_title, m.company].filter(Boolean).join(' bij ')}</div>
        </div>
      </div>`;
  }

  // --- Feature: DM vanuit Profiel ---
  // Already handled via openDm — just need button in showProfile

  // --- Feature: Notificatie Badges ---

  let unreadChannels = new Set();

  function updateNavBadges() {
    const chatNav = document.querySelector('.nav-item[data-screen="chat"]');
    if (!chatNav) return;
    const existing = chatNav.querySelector('.nav-badge');
    if (unreadChannels.size > 0 && !existing) {
      const badge = document.createElement('div');
      badge.className = 'nav-badge';
      chatNav.appendChild(badge);
    } else if (unreadChannels.size === 0 && existing) {
      existing.remove();
    }
  }

  // Simulate some unread in demo
  function initUnreadTracking() {
    if (DEV_MODE) {
      unreadChannels.add('ch3');
      unreadChannels.add('ch4');
      updateNavBadges();
    }
  }

  // --- Feature: Chat Images ---

  let pendingChatImage = null;

  function attachChatImage(input) {
    if (!input.files.length) return;
    const file = input.files[0];
    const preview = document.getElementById('chat-image-preview');
    const img = document.getElementById('chat-preview-img');
    img.src = URL.createObjectURL(file);
    preview.style.display = 'flex';
    pendingChatImage = file;
  }

  function removeChatImage() {
    pendingChatImage = null;
    document.getElementById('chat-image-preview').style.display = 'none';
    document.getElementById('chat-image-input').value = '';
  }

  // --- Feature: Content Feed ---

  const DEMO_FEED = [
    { type: 'article', title: 'Bitcoin breekt $100k grens', excerpt: 'Na maanden van consolidatie heeft Bitcoin eindelijk de psychologische grens doorbroken.', author: 'Jeroen Blokland', date: '2026-04-09' },
    { type: 'event_recap', title: 'Recap: Monthly Meetup Maart', excerpt: '56 aanwezigen, 3 presentaties, en een onvergetelijke avond. Lees het verslag.', author: 'Bram Kanstein', date: '2026-04-02' },
    { type: 'spotlight', title: 'Member Spotlight: Morris Verdonk', excerpt: 'Van IT-security naar Bitcoin custody. Hoe Morris zijn expertise inzet voor de community.', author: 'DBE Redactie', date: '2026-03-28' },
    { type: 'analysis', title: 'Macro Weekly: Fed, ETF flows & halving', excerpt: 'Wekelijkse analyse van de belangrijkste Bitcoin macro-ontwikkelingen.', author: 'Khing Oei', date: '2026-03-25', exclusive: true },
  ];

  async function loadFeed() {
    const list = document.getElementById('feed-list');
    const feed = DEV_MODE ? DEMO_FEED : [];

    if (!feed.length) {
      list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128240;</div><div class="empty-state-text">Nog geen berichten</div></div>';
      return;
    }

    list.innerHTML = feed.map(f => `
      <div class="feed-card">
        <div class="feed-meta">
          <span class="feed-type">${f.type.replace('_', ' ')}</span>
          ${f.exclusive ? '<span class="feed-type" style="background:var(--purple-dim);color:var(--purple)">Exclusief</span>' : ''}
          <span>${f.date}</span>
          <span>&bull; ${f.author}</span>
        </div>
        <div class="market-title">${escapeHtml(f.title)}</div>
        <div class="market-desc">${escapeHtml(f.excerpt)}</div>
      </div>`).join('');
  }

  // --- Feature: Admin Dashboard ---

  async function loadAdmin() {
    const stats = document.getElementById('admin-stats');
    const qList = document.getElementById('admin-questions');

    const totalMembers = state.members.length;
    const activeToday = DEV_MODE ? 12 : 0;
    const totalEvents = DEV_MODE ? DEMO.events.length : 0;
    const totalListings = DEV_MODE ? state.listings.length : 0;
    const totalMessages = DEV_MODE ? 47 : 0;
    const totalSats = state.members.reduce((s, m) => s + (m.sats_balance || 0), 0);

    stats.innerHTML = `
      <div class="admin-grid">
        <div class="admin-stat"><div class="admin-stat-value">${totalMembers}</div><div class="admin-stat-label">Leden</div></div>
        <div class="admin-stat"><div class="admin-stat-value">${activeToday}</div><div class="admin-stat-label">Actief vandaag</div></div>
        <div class="admin-stat"><div class="admin-stat-value">${totalEvents}</div><div class="admin-stat-label">Events</div></div>
        <div class="admin-stat"><div class="admin-stat-value">${totalListings}</div><div class="admin-stat-label">Marktplaats</div></div>
        <div class="admin-stat"><div class="admin-stat-value">${totalMessages}</div><div class="admin-stat-label">Berichten</div></div>
        <div class="admin-stat"><div class="admin-stat-value">${formatSats(totalSats)}</div><div class="admin-stat-label">Totaal sats</div></div>
      </div>`;

    // Onbeantwoorde vragen
    const unanswered = DEV_MODE ? DEMO_QUESTIONS.filter(q => !q.is_answered) : [];
    if (unanswered.length) {
      qList.innerHTML = unanswered.map(q => `
        <div class="question-card">
          <div class="question-text">"${escapeHtml(q.question)}"</div>
          <button class="btn btn-sm" style="margin-top:8px">Beantwoorden</button>
        </div>`).join('');
    } else {
      qList.innerHTML = '<p class="text-muted" style="font-size:13px">Alle vragen beantwoord!</p>';
    }
  }

  // --- Feature: Event Check-in QR ---
  // Added to showEventDetail — generates QR for admin to share

  // --- Feature 9: Nostr Identity ---
  // Handled in profile edit form (nostr_npub field added to HTML)

  // --- Feature 10: Anonieme Vragenbox ---

  const DEMO_QUESTIONS = [
    { id: 'q1', question: 'Hoe kan ik als beginner het beste starten met Bitcoin kopen in Nederland?', answer: 'Begin met een kleine aankoop via een Nederlandse exchange zoals Bitvavo of Relai. Stuur je Bitcoin daarna naar je eigen wallet (bijv. Phoenix of BlueWallet). Koop regelmatig een vast bedrag — dat heet DCA (Dollar Cost Averaging).', answered_by: 'Pieter Voogt', is_answered: true },
    { id: 'q2', question: 'Wordt de DBE app verplicht of blijft Telegram bestaan?', answer: 'We willen eerst testen met een kleine groep. Als de app goed werkt, bespreken we met alle leden of we Telegram willen uitfaseren. Jullie stem telt — zie de poll!', answered_by: 'Bram Kanstein', is_answered: true },
    { id: 'q3', question: 'Kan de DBE ook workshops organiseren over Bitcoin mining in Nederland?', answer: null, answered_by: null, is_answered: false },
  ];

  async function loadQuestions() {
    const list = document.getElementById('questions-list');

    let questions;
    if (DEV_MODE) {
      questions = DEMO_QUESTIONS.filter(q => q.is_answered);
    } else {
      const { data } = await supabase.from('questions').select('*').eq('is_answered', true).eq('is_public', true).order('created_at', { ascending: false });
      questions = data || [];
    }

    if (!questions.length) {
      list.innerHTML = '<div class="empty-state"><div class="empty-state-text" style="font-size:13px">Nog geen beantwoorde vragen</div></div>';
      return;
    }

    list.innerHTML = questions.map(q => `
      <div class="question-card">
        <div class="question-text">"${escapeHtml(q.question)}"</div>
        ${q.answer ? `<div class="question-answer">${escapeHtml(q.answer)}</div>` : ''}
        ${q.answered_by ? `<div class="question-meta">Beantwoord door ${typeof q.answered_by === 'string' ? q.answered_by : 'Bestuur'}</div>` : ''}
      </div>
    `).join('');
  }

  function initQuestionForm() {
    document.getElementById('question-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = document.getElementById('question-text').value.trim();
      if (!text) return;

      if (DEV_MODE) {
        DEMO_QUESTIONS.push({ id: 'q-' + Date.now(), question: text, answer: null, answered_by: null, is_answered: false });
      } else {
        await supabase.from('questions').insert({ question: text });
      }

      document.getElementById('question-text').value = '';
      showToast('Vraag anoniem verstuurd!', 'success');
    });
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
      // Dev mode: skip login, ga direct naar de app
      devLogin();
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
    initNewPoll();
    initKennisFilters();
    initNewArticle();
    initMatch();
    initQuestionForm();
    initTicker();
    initPushNotifications();
    initNewPod();
    initDealFilters();
    initNewDeal();
    initUnreadTracking();

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
    showTipModal,
    closeTipModal,
    toggleTickerChart,
    votePoll,
    addPollOption,
    showArticle,
    showEduPath,
    toggleLesson,
    requestPushPermission,
    attachChatImage,
    removeChatImage,
    init
  };

  // Start app
  document.addEventListener('DOMContentLoaded', init);

  return window.App;
})();

// Global navigation helper
function navigate(s) { App.navigate(s); }
function goBack() { App.goBack(); }
