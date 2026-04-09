-- Dutch Bitcoin Embassy App — Initial Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- TABLES
-- ============================================

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT NOT NULL DEFAULT '',
    last_name TEXT NOT NULL DEFAULT '',
    avatar_url TEXT,
    company TEXT,
    job_title TEXT,
    bio TEXT,
    expertise_tags TEXT[] DEFAULT '{}',
    linkedin_url TEXT,
    website_url TEXT,
    membership_tier TEXT NOT NULL DEFAULT 'open' CHECK (membership_tier IN ('open', 'business_club', 'admin')),
    membership_status TEXT NOT NULL DEFAULT 'active' CHECK (membership_status IN ('active', 'expired', 'cancelled', 'trial')),
    membership_expires_at TIMESTAMPTZ,
    sats_balance INTEGER NOT NULL DEFAULT 0,
    is_profile_visible BOOLEAN NOT NULL DEFAULT true,
    onboarding_completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    is_business_club_only BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    image_url TEXT,
    is_direct_message BOOLEAN NOT NULL DEFAULT false,
    recipient_id UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_channel_created ON messages(channel_id, created_at DESC);
CREATE INDEX idx_messages_dm ON messages(sender_id, recipient_id) WHERE is_direct_message = true;

CREATE TABLE content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    body TEXT NOT NULL,
    excerpt TEXT,
    cover_image_url TEXT,
    category TEXT NOT NULL CHECK (category IN ('news', 'article', 'podcast', 'video', 'education')),
    is_exclusive BOOLEAN NOT NULL DEFAULT false,
    author_id UUID REFERENCES profiles(id),
    published_at TIMESTAMPTZ,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learning_path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    event_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    capacity INTEGER,
    is_exclusive BOOLEAN NOT NULL DEFAULT false,
    cover_image_url TEXT,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE event_rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'waitlist')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

CREATE TABLE sats_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('earn', 'claim', 'admin_grant', 'admin_deduct')),
    reason TEXT NOT NULL,
    lightning_address TEXT,
    claim_status TEXT CHECK (claim_status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sats_user ON sats_transactions(user_id, created_at DESC);

CREATE TABLE notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    dm_enabled BOOLEAN NOT NULL DEFAULT true,
    mention_enabled BOOLEAN NOT NULL DEFAULT true,
    content_enabled BOOLEAN NOT NULL DEFAULT true,
    event_enabled BOOLEAN NOT NULL DEFAULT true,
    sats_enabled BOOLEAN NOT NULL DEFAULT true,
    device_token TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- REALTIME
-- ============================================

ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE sats_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can read visible Business Club profiles"
ON profiles FOR SELECT
USING (
    (membership_tier IN ('business_club', 'admin') AND is_profile_visible = true)
    OR id = auth.uid()
);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (id = auth.uid());

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (id = auth.uid());

-- Channels
CREATE POLICY "Authenticated users can read channels"
ON channels FOR SELECT TO authenticated
USING (true);

-- Messages
CREATE POLICY "Business Club members can read channel messages"
ON messages FOR SELECT
USING (
    (NOT is_direct_message AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND membership_tier IN ('business_club', 'admin')
    ))
    OR (is_direct_message AND (sender_id = auth.uid() OR recipient_id = auth.uid()))
);

CREATE POLICY "Business Club members can insert channel messages"
ON messages FOR INSERT
WITH CHECK (
    sender_id = auth.uid()
    AND (
        (NOT is_direct_message AND EXISTS (
            SELECT 1 FROM profiles WHERE id = auth.uid() AND membership_tier IN ('business_club', 'admin')
        ))
        OR (is_direct_message AND sender_id = auth.uid())
    )
);

-- Content
CREATE POLICY "Anyone can read published non-exclusive content"
ON content FOR SELECT TO authenticated
USING (
    is_published = true
    AND (
        NOT is_exclusive
        OR EXISTS (
            SELECT 1 FROM profiles WHERE id = auth.uid() AND membership_tier IN ('business_club', 'admin')
        )
    )
);

-- Learning paths & lessons: open to all authenticated
CREATE POLICY "Authenticated users can read learning paths"
ON learning_paths FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Authenticated users can read lessons"
ON lessons FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can read own lesson progress"
ON lesson_progress FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own lesson progress"
ON lesson_progress FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Events
CREATE POLICY "Authenticated users can read published events"
ON events FOR SELECT TO authenticated
USING (
    is_published = true
    AND (
        NOT is_exclusive
        OR EXISTS (
            SELECT 1 FROM profiles WHERE id = auth.uid() AND membership_tier IN ('business_club', 'admin')
        )
    )
);

-- Event RSVPs
CREATE POLICY "Users can read own RSVPs"
ON event_rsvps FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own RSVPs"
ON event_rsvps FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own RSVPs"
ON event_rsvps FOR DELETE
USING (user_id = auth.uid());

-- Sats transactions
CREATE POLICY "Users can read own sats transactions"
ON sats_transactions FOR SELECT
USING (user_id = auth.uid());

-- Notification preferences
CREATE POLICY "Users can read own notification preferences"
ON notification_preferences FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can upsert own notification preferences"
ON notification_preferences FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own notification preferences"
ON notification_preferences FOR UPDATE
USING (user_id = auth.uid());

-- ============================================
-- FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION increment_sats_balance(user_id_input UUID, amount_input INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE profiles
    SET sats_balance = sats_balance + amount_input, updated_at = NOW()
    WHERE id = user_id_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO profiles (id, email)
    VALUES (NEW.id, NEW.email);

    INSERT INTO notification_preferences (user_id)
    VALUES (NEW.id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER content_updated_at BEFORE UPDATE ON content FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SEED DATA
-- ============================================

INSERT INTO channels (name, slug, description, sort_order) VALUES
('Macro & Markten', 'macro', 'Bitcoin macro-economie, markten en trends', 1),
('Technologie', 'tech', 'Lightning, mining, development, privacy', 2),
('Business & Deals', 'business', 'Ondernemerschap, samenwerkingen, dealflow', 3),
('Investeren', 'investeren', 'Bitcoin als belegging, treasury, fondsen', 4),
('Off-Topic', 'off-topic', 'Alles buiten Bitcoin', 5);

INSERT INTO learning_paths (title, description, difficulty, sort_order) VALUES
('Bitcoin Basics', 'Begrijp wat Bitcoin is en hoe het werkt', 'beginner', 1),
('Bitcoin Verdiepen', 'Van HODLen tot Lightning Network', 'intermediate', 2),
('Bitcoin voor Ondernemers', 'Bitcoin in je bedrijf: treasury, betalingen, strategie', 'advanced', 3);
