-- DBE App — Engagement Features
-- Pods, Deal Flow, Content Feed, Admin stats

-- ============================================
-- ACCOUNTABILITY PODS
-- ============================================

CREATE TABLE pods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    goal TEXT,
    max_members INTEGER NOT NULL DEFAULT 6,
    channel_id UUID REFERENCES channels(id),
    created_by UUID NOT NULL REFERENCES profiles(id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE pod_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pod_id UUID NOT NULL REFERENCES pods(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(pod_id, user_id)
);

ALTER TABLE pods ENABLE ROW LEVEL SECURITY;
ALTER TABLE pod_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read pods" ON pods FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can create pods" ON pods FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Authenticated can read pod members" ON pod_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can join pods" ON pod_members FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can leave pods" ON pod_members FOR DELETE TO authenticated USING (user_id = auth.uid());

-- ============================================
-- DEAL FLOW / OPPORTUNITIES
-- ============================================

CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    deal_type TEXT NOT NULL CHECK (deal_type IN ('investering', 'samenwerking', 'project', 'vacature')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_gesprek', 'gesloten')),
    is_exclusive BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Business Club can read deals" ON deals FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND membership_tier IN ('business_club', 'admin')));
CREATE POLICY "Users can create deals" ON deals FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());
CREATE POLICY "Users can update own deals" ON deals FOR UPDATE TO authenticated USING (author_id = auth.uid());

CREATE TRIGGER deals_updated_at BEFORE UPDATE ON deals FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- MEMBER SPOTLIGHT
-- ============================================

CREATE TABLE spotlights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    week_start DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(week_start)
);

ALTER TABLE spotlights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read spotlights" ON spotlights FOR SELECT TO authenticated USING (true);

-- ============================================
-- EVENT CHECK-IN
-- ============================================

ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMPTZ;
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS check_in_code TEXT;

-- ============================================
-- UNREAD TRACKING
-- ============================================

CREATE TABLE read_receipts (
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    channel_id UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
    last_read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, channel_id)
);

ALTER TABLE read_receipts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own receipts" ON read_receipts FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can upsert own receipts" ON read_receipts FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own receipts" ON read_receipts FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- ============================================
-- IMAGES IN MESSAGES (already has image_url column)
-- Just need storage bucket
-- ============================================
