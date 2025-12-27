-- YouTube Configuration Table
-- Stores the connected YouTube channel configuration

CREATE TABLE IF NOT EXISTS youtube_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id TEXT NOT NULL,
    channel_url TEXT NOT NULL,
    channel_name TEXT,
    channel_thumbnail TEXT,
    subscriber_count TEXT,
    video_count TEXT,
    description TEXT,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_youtube_config_enabled ON youtube_config(enabled);

-- RLS Policies
ALTER TABLE youtube_config ENABLE ROW LEVEL SECURITY;

-- Allow public read access for enabled configs
CREATE POLICY "youtube_config_public_read" ON youtube_config
    FOR SELECT
    TO public
    USING (enabled = true);

-- Allow authenticated users full access
CREATE POLICY "youtube_config_authenticated_all" ON youtube_config
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow service role full access
CREATE POLICY "youtube_config_service_all" ON youtube_config
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_youtube_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER trigger_youtube_config_updated_at
    BEFORE UPDATE ON youtube_config
    FOR EACH ROW
    EXECUTE FUNCTION update_youtube_config_updated_at();

-- Add comment
COMMENT ON TABLE youtube_config IS 'Stores YouTube channel configuration for the EdaShow website';
