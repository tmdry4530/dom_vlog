-- Add view_count, meta_description, and featured_image_url columns to the posts table
ALTER TABLE posts
ADD COLUMN view_count INTEGER DEFAULT 0,
ADD COLUMN meta_description TEXT,
ADD COLUMN featured_image_url VARCHAR(255);

-- Add index for view_count for popular posts
CREATE INDEX IF NOT EXISTS idx_posts_view_count ON posts(view_count);
