-- DBE App — New Features Schema
-- Polls, Event Photos, Questions, Achievements, Nostr

-- ============================================
-- POLLS
-- ============================================

CREATE TABLE polls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    channel_id UUID REFERENCES channels(id),
    is_sats_weighted BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    closes_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE poll_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE poll_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    option_id UUID NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    sats_amount INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(poll_id, user_id)
);

ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read polls" ON polls FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can create polls" ON polls FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND membership_tier = 'admin'));
CREATE POLICY "Authenticated can read options" ON poll_options FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can read votes" ON poll_votes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can vote" ON poll_votes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- ============================================
-- EVENT PHOTOS
-- ============================================

CREATE TABLE event_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    uploader_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE event_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read event photos" ON event_photos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can upload photos" ON event_photos FOR INSERT TO authenticated WITH CHECK (uploader_id = auth.uid());
CREATE POLICY "Users can delete own photos" ON event_photos FOR DELETE TO authenticated USING (uploader_id = auth.uid());

-- Add recap field to events
ALTER TABLE events ADD COLUMN IF NOT EXISTS recap TEXT;

-- ============================================
-- ANONYMOUS QUESTIONS
-- ============================================

CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id),
    question TEXT NOT NULL,
    answer TEXT,
    answered_by UUID REFERENCES profiles(id),
    is_public BOOLEAN NOT NULL DEFAULT true,
    is_answered BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read public answered questions" ON questions FOR SELECT TO authenticated
  USING (is_public = true OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND membership_tier = 'admin'));
CREATE POLICY "Anyone can submit questions" ON questions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update questions" ON questions FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND membership_tier = 'admin'));

-- ============================================
-- ACHIEVEMENTS / BADGES
-- ============================================

CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT NOT NULL DEFAULT '',
    sats_reward INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read achievements" ON achievements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can read user achievements" ON user_achievements FOR SELECT TO authenticated USING (true);
CREATE POLICY "System can grant achievements" ON user_achievements FOR INSERT TO authenticated WITH CHECK (true);

-- Seed achievements
INSERT INTO achievements (slug, name, description, icon, sats_reward) VALUES
('early_adopter', 'Early Adopter', 'Een van de eerste app-gebruikers', '🏆', 1000),
('profile_complete', 'Profiel Compleet', 'Alle profielvelden ingevuld', '✅', 500),
('first_message', 'Eerste Bericht', 'Je eerste chatbericht verstuurd', '💬', 100),
('event_attendee', 'Event Bezoeker', 'Aangemeld voor je eerste event', '🎫', 200),
('marketplace_seller', 'Aanbieder', 'Eerste aanbod op de marktplaats', '🏪', 300),
('community_builder', 'Community Builder', '10+ berichten verstuurd', '🔥', 1000),
('lightning_pro', 'Lightning Pro', 'Lightning address ingesteld', '⚡', 500),
('social_butterfly', 'Netwerker', '5+ profielen bekeken', '🦋', 200),
('poll_voter', 'Stemmer', 'Eerste stem uitgebracht', '🗳️', 100),
('nostr_linked', 'Nostr Verified', 'Nostr pubkey gekoppeld', '🟣', 500);

-- ============================================
-- NOSTR IDENTITY
-- ============================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS nostr_pubkey TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS nostr_npub TEXT;

-- ============================================
-- KENNISBANK (uses existing content table, add wiki category)
-- ============================================

ALTER TABLE content DROP CONSTRAINT IF EXISTS content_category_check;
ALTER TABLE content ADD CONSTRAINT content_category_check
  CHECK (category IN ('news', 'article', 'podcast', 'video', 'education', 'wiki'));

-- Admin can insert/update content
CREATE POLICY "Admins can insert content" ON content FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND membership_tier IN ('admin', 'business_club')));
CREATE POLICY "Admins can update content" ON content FOR UPDATE TO authenticated
  USING (author_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND membership_tier = 'admin'));
