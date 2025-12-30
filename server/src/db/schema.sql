-- Create cards table
CREATE TABLE IF NOT EXISTS cards (
	id VARCHAR(255) PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	set_name VARCHAR(255),
	rarity VARCHAR(100),
	image_small_url TEXT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on name for faster searches
CREATE INDEX IF NOT EXISTS idx_cards_name ON cards(name);

-- Create index on set_name
CREATE INDEX IF NOT EXISTS idx_cards_set_name ON cards(set_name);

-- Create index on rarity
CREATE INDEX IF NOT EXISTS idx_cards_rarity ON cards(rarity);

