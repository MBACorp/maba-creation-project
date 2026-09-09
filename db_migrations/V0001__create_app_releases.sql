CREATE TABLE IF NOT EXISTS app_releases (
    id SERIAL PRIMARY KEY,
    version TEXT NOT NULL,
    platform TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size BIGINT NOT NULL DEFAULT 0,
    notes TEXT DEFAULT '',
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    downloads INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_app_releases_platform ON app_releases (platform, created_at DESC);
