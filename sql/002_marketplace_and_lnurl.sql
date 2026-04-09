-- DBE App — Marketplace + LNURL-auth extensions
-- Run AFTER 001_initial_schema.sql

-- ============================================
-- SCHEMA EXTENSIONS
-- ============================================

-- LNURL-auth: pubkey als identity
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS lightning_address TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS lnurl_pubkey TEXT UNIQUE;

-- Email nullable maken voor LNURL-auth users (hebben geen email)
ALTER TABLE profiles ALTER COLUMN email DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN email SET DEFAULT '';

-- ============================================
-- MARKETPLACE
-- ============================================

CREATE TABLE marketplace_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('dienst', 'kennis', 'product')),
    price_sats INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read active listings"
ON marketplace_listings FOR SELECT TO authenticated
USING (is_active = true);

CREATE POLICY "Users can insert own listings"
ON marketplace_listings FOR INSERT TO authenticated
WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can update own listings"
ON marketplace_listings FOR UPDATE TO authenticated
USING (author_id = auth.uid());

CREATE POLICY "Users can delete own listings"
ON marketplace_listings FOR DELETE TO authenticated
USING (author_id = auth.uid());

CREATE TRIGGER marketplace_updated_at
BEFORE UPDATE ON marketplace_listings
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- FIX: handle_new_user voor LNURL (email kan leeg zijn)
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO profiles (id, email)
    VALUES (NEW.id, COALESCE(NEW.email, ''));

    INSERT INTO notification_preferences (user_id)
    VALUES (NEW.id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
