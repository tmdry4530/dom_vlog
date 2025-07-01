-- Create the external_links table for sidebar links
CREATE TABLE IF NOT EXISTS external_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    url VARCHAR(255) NOT NULL,
    display_order INTEGER DEFAULT 0, -- To control the order of links in the UI
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add index for display_order
CREATE INDEX IF NOT EXISTS idx_external_links_display_order ON external_links(display_order);
