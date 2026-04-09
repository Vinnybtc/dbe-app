-- DBE App — Prijsalerts, Bounties, Challenges, Map, Feedback, Referrals

-- Bitcoin price alerts
CREATE TABLE price_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    direction TEXT NOT NULL CHECK (direction IN ('above', 'below')),
    price_eur DECIMAL(15,2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    triggered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Meeting scheduler
CREATE TABLE meeting_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID NOT NULL REFERENCES profiles(id),
    host_id UUID NOT NULL REFERENCES profiles(id),
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    note TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bounty board
CREATE TABLE bounties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES profiles(id),
    title TEXT NOT NULL,
    description TEXT,
    reward_sats INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'claimed', 'completed', 'cancelled')),
    claimed_by UUID REFERENCES profiles(id),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Event recordings/notes
ALTER TABLE events ADD COLUMN IF NOT EXISTS recording_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS ai_summary TEXT;

-- Referral system
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES profiles(id);

-- Challenges
CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    month DATE NOT NULL,
    reward_sats INTEGER NOT NULL DEFAULT 1000,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE challenge_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(challenge_id, user_id)
);

-- Local Bitcoin map
CREATE TABLE map_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    location_type TEXT NOT NULL CHECK (location_type IN ('winkel', 'atm', 'meetup', 'bedrijf', 'restaurant')),
    address TEXT,
    lat DECIMAL(10,7),
    lng DECIMAL(10,7),
    accepts_lightning BOOLEAN NOT NULL DEFAULT false,
    added_by UUID REFERENCES profiles(id),
    is_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Event feedback
CREATE TABLE event_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    suggestion TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bounties ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE map_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own alerts" ON price_alerts FOR ALL TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users own slots" ON meeting_slots FOR ALL TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users own meetings" ON meetings FOR SELECT TO authenticated USING (requester_id = auth.uid() OR host_id = auth.uid());
CREATE POLICY "Authenticated read bounties" ON bounties FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read challenges" ON challenges FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users own completions" ON challenge_completions FOR ALL TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Authenticated read map" ON map_locations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users add locations" ON map_locations FOR INSERT TO authenticated WITH CHECK (added_by = auth.uid());
CREATE POLICY "Anonymous feedback" ON event_feedback FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins read feedback" ON event_feedback FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND membership_tier = 'admin'));

-- Seed challenges
INSERT INTO challenges (title, description, month, reward_sats) VALUES
('Stel je node in', 'Draai je eigen Bitcoin full node (Umbrel, Start9, of RaspiBlitz)', '2026-04-01', 2000),
('Eerste Lightning betaling', 'Doe je eerste echte Lightning betaling via je eigen wallet', '2026-05-01', 1000),
('Lees The Bitcoin Standard', 'Lees het boek van Saifedean Ammous en deel je takeaways', '2026-06-01', 1500);

-- Seed map locations
INSERT INTO map_locations (name, description, location_type, address, lat, lng, accepts_lightning) VALUES
('Paviljoen de Witte', 'DBE Monthly Meetup locatie', 'meetup', 'Plein 24, Den Haag', 52.0799, 4.3127, false),
('Bitcoin ATM Centraal Station', 'Bitcoin ATM bij Den Haag Centraal', 'atm', 'Koningin Julianaplein 10, Den Haag', 52.0811, 4.3233, false),
('Dutch Bitcoin Embassy', 'Thuisbasis van de DBE community', 'meetup', 'Den Haag', 52.0705, 4.3007, true);
