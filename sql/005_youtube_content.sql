-- DBE App — YouTube & Content Automation

-- YouTube channels linked to members
CREATE TABLE youtube_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    channel_url TEXT NOT NULL,
    channel_name TEXT NOT NULL,
    is_member_channel BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_checked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- YouTube videos (auto-imported + curated)
CREATE TABLE youtube_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID REFERENCES youtube_channels(id) ON DELETE CASCADE,
    video_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    published_at TIMESTAMPTZ,
    is_curated BOOLEAN NOT NULL DEFAULT false,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    ai_summary TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Content schedule
CREATE TABLE content_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type TEXT NOT NULL CHECK (content_type IN ('article', 'video', 'podcast', 'announcement', 'recap')),
    title TEXT NOT NULL,
    body TEXT,
    external_url TEXT,
    is_exclusive BOOLEAN NOT NULL DEFAULT false,
    scheduled_at TIMESTAMPTZ NOT NULL,
    published_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('draft', 'scheduled', 'published', 'cancelled')),
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RSS feed sources for auto-import
CREATE TABLE rss_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    feed_url TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL DEFAULT 'news',
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_fetched_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE youtube_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE youtube_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE rss_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read youtube" ON youtube_channels FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can read videos" ON youtube_videos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can read schedule" ON content_schedule FOR SELECT TO authenticated USING (status = 'published' OR created_by = auth.uid());
CREATE POLICY "Admins can manage schedule" ON content_schedule FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND membership_tier = 'admin'));
CREATE POLICY "Authenticated can read rss" ON rss_sources FOR SELECT TO authenticated USING (true);

-- Seed some Bitcoin RSS sources
INSERT INTO rss_sources (name, feed_url, category) VALUES
('Bitcoin Magazine', 'https://bitcoinmagazine.com/feed', 'news'),
('Mempool.space Blog', 'https://mempool.space/feed', 'technisch');
