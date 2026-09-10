ALTER TABLE app_releases ADD COLUMN IF NOT EXISTS sha256 TEXT DEFAULT '';
ALTER TABLE app_releases ADD COLUMN IF NOT EXISTS arch TEXT DEFAULT '';
ALTER TABLE app_releases ADD COLUMN IF NOT EXISTS mandatory BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_app_releases_lookup
  ON app_releases (platform, arch, is_published, created_at DESC);
