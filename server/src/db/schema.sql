-- =========================================
-- Extensions
-- =========================================
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================================
-- cards
-- Global Pokémon card catalogue (read-only)
-- =========================================
CREATE TABLE cards (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  set_name VARCHAR(255),
  rarity VARCHAR(100),
  image_small_url TEXT,

  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_cards_name ON cards(name);
CREATE INDEX idx_cards_set_name ON cards(set_name);
CREATE INDEX idx_cards_rarity ON cards(rarity);

-- =========================================
-- users
-- Minimal identity (auth later)
-- =========================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,

  created_at TIMESTAMP DEFAULT now()
);

-- =========================================
-- binders
-- Logical collections of owned cards
-- =========================================
CREATE TABLE binders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true,

  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_binders_user_id ON binders(user_id);

-- =========================================
-- binder_cards
-- Core ownership + intent table
-- =========================================
CREATE TABLE binder_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  binder_id UUID NOT NULL REFERENCES binders(id) ON DELETE CASCADE,
  card_id VARCHAR(255) NOT NULL REFERENCES cards(id),

  quantity INT NOT NULL DEFAULT 1,

  condition TEXT,          -- NM, LP, MP, HP
  grade TEXT,              -- PSA 9, BGS 10, etc.

  for_trade BOOLEAN DEFAULT false,
  for_sale BOOLEAN DEFAULT false,
  asking_price NUMERIC(10,2),

  created_at TIMESTAMP DEFAULT now(),

  UNIQUE (binder_id, card_id)
);

CREATE INDEX idx_binder_cards_binder_id ON binder_cards(binder_id);
CREATE INDEX idx_binder_cards_card_id ON binder_cards(card_id);

-- =========================================
-- Constraints (data integrity)
-- =========================================
ALTER TABLE binder_cards
ADD CONSTRAINT quantity_positive
CHECK (quantity > 0);

ALTER TABLE binder_cards
ADD CONSTRAINT sale_requires_price
CHECK (
  for_sale = false OR asking_price IS NOT NULL
);
