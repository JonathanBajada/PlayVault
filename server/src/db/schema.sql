-- =========================================
-- PokeVault Database Schema
-- Scalable, normalized design for Pokémon TCG card collection platform
-- =========================================

-- =========================================
-- 1️⃣ SETS
-- Stores reusable set metadata for filtering, timelines, and analytics
-- =========================================
CREATE TABLE sets (
  id TEXT PRIMARY KEY,              -- e.g. "hgss4"
  name TEXT NOT NULL,
  series TEXT NOT NULL,
  printed_total INTEGER,
  total INTEGER,
  ptcgo_code TEXT,
  release_date DATE NOT NULL,       -- derive year from this
  updated_at TIMESTAMP,
  symbol_image TEXT,
  logo_image TEXT,
  
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_sets_release_date ON sets(release_date);
CREATE INDEX idx_sets_series ON sets(series);
CREATE INDEX idx_sets_name ON sets(name);

-- =========================================
-- 2️⃣ CARDS
-- Central catalog table. One row per card.
-- =========================================
CREATE TABLE cards (
  id TEXT PRIMARY KEY,              -- e.g. "hgss4-1"
  name TEXT NOT NULL,
  number TEXT NOT NULL,
  rarity TEXT,                      -- Some cards may not have rarity
  supertype TEXT NOT NULL,          -- Pokémon / Trainer / Energy
  hp TEXT,
  level TEXT,
  artist TEXT,
  flavor_text TEXT,
  
  set_id TEXT NOT NULL REFERENCES sets(id),
  
  image_small TEXT NOT NULL,
  image_large TEXT NOT NULL,
  
  -- Evolution chain (optional, only for Pokémon)
  evolves_from TEXT,
  converted_retreat_cost INTEGER,
  
  -- Legalities (simple key-value for now, can normalize later)
  legality_unlimited TEXT,
  legality_expanded TEXT,
  
  -- Pokédex numbers normalized in card_pokedex_numbers table
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_cards_name ON cards(name);
CREATE INDEX idx_cards_set_id ON cards(set_id);
CREATE INDEX idx_cards_rarity ON cards(rarity);
CREATE INDEX idx_cards_supertype ON cards(supertype);
CREATE INDEX idx_cards_evolves_from ON cards(evolves_from);

-- =========================================
-- 3️⃣ CARD_TYPES
-- Supports multi-type cards and type-based filtering
-- =========================================
CREATE TABLE card_types (
  card_id TEXT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  type TEXT NOT NULL,               -- Fire, Water, Metal, etc.
  PRIMARY KEY (card_id, type)
);

CREATE INDEX idx_card_types_card_id ON card_types(card_id);
CREATE INDEX idx_card_types_type ON card_types(type);

-- =========================================
-- 4️⃣ CARD_SUBTYPES
-- Supports Stage, Item, Supporter, etc.
-- =========================================
CREATE TABLE card_subtypes (
  card_id TEXT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  subtype TEXT NOT NULL,
  PRIMARY KEY (card_id, subtype)
);

CREATE INDEX idx_card_subtypes_card_id ON card_subtypes(card_id);
CREATE INDEX idx_card_subtypes_subtype ON card_subtypes(subtype);

-- =========================================
-- 5️⃣ ATTACKS
-- Attack definitions are separate to allow future gameplay or search logic
-- =========================================
CREATE TABLE attacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id TEXT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  damage TEXT,
  text TEXT,
  converted_energy_cost INTEGER,
  attack_order INTEGER NOT NULL,    -- Order of attack on the card (0-indexed)
  
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_attacks_card_id ON attacks(card_id);
CREATE INDEX idx_attacks_card_order ON attacks(card_id, attack_order);

-- =========================================
-- 6️⃣ ATTACK_COSTS
-- Energy costs are normalized for filtering and analytics
-- =========================================
CREATE TABLE attack_costs (
  attack_id UUID NOT NULL REFERENCES attacks(id) ON DELETE CASCADE,
  energy_type TEXT NOT NULL,        -- Fire, Water, Colorless, etc.
  cost_order INTEGER NOT NULL,      -- Order within the cost array
  PRIMARY KEY (attack_id, energy_type, cost_order)
);

CREATE INDEX idx_attack_costs_attack_id ON attack_costs(attack_id);
CREATE INDEX idx_attack_costs_energy_type ON attack_costs(energy_type);

-- =========================================
-- 7️⃣ ABILITIES
-- Optional abilities per card
-- =========================================
CREATE TABLE abilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id TEXT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  text TEXT NOT NULL,
  type TEXT,                        -- Ability, Poké-Body, Poké-Power, etc.
  ability_order INTEGER NOT NULL,   -- Order of ability on the card (0-indexed)
  
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_abilities_card_id ON abilities(card_id);
CREATE INDEX idx_abilities_card_order ON abilities(card_id, ability_order);

-- =========================================
-- 8️⃣ CARD_WEAKNESSES
-- Weaknesses for Pokémon cards
-- =========================================
CREATE TABLE card_weaknesses (
  card_id TEXT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  value TEXT NOT NULL,              -- e.g., "×2", "+30"
  PRIMARY KEY (card_id, type)
);

CREATE INDEX idx_card_weaknesses_card_id ON card_weaknesses(card_id);

-- =========================================
-- 9️⃣ CARD_RESISTANCES
-- Resistances for Pokémon cards
-- =========================================
CREATE TABLE card_resistances (
  card_id TEXT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  value TEXT NOT NULL,              -- e.g., "-20"
  PRIMARY KEY (card_id, type)
);

CREATE INDEX idx_card_resistances_card_id ON card_resistances(card_id);

-- =========================================
-- 🔟 CARD_POKEDEX_NUMBERS
-- National Pokédex numbers (arrays → join tables)
-- =========================================
CREATE TABLE card_pokedex_numbers (
  card_id TEXT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  pokedex_number INTEGER NOT NULL,
  PRIMARY KEY (card_id, pokedex_number)
);

CREATE INDEX idx_card_pokedex_numbers_card_id ON card_pokedex_numbers(card_id);
CREATE INDEX idx_card_pokedex_numbers_number ON card_pokedex_numbers(pokedex_number);

-- =========================================
-- 1️⃣1️⃣ PRICES
-- Unified pricing table for all sources and variants
-- Critical for future matching algorithms
-- =========================================
CREATE TABLE prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id TEXT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  source TEXT NOT NULL,             -- "tcgplayer" | "cardmarket"
  variant TEXT NOT NULL,            -- "normal" | "holofoil" | "reverseHolofoil" | etc.
  low NUMERIC(10, 2),
  mid NUMERIC(10, 2),
  high NUMERIC(10, 2),
  market NUMERIC(10, 2),
  direct_low NUMERIC(10, 2),
  updated_at DATE,
  
  created_at TIMESTAMP DEFAULT now(),
  
  UNIQUE (card_id, source, variant)
);

CREATE INDEX idx_prices_card_id ON prices(card_id);
CREATE INDEX idx_prices_card_variant ON prices(card_id, variant);
CREATE INDEX idx_prices_source ON prices(source);
CREATE INDEX idx_prices_updated_at ON prices(updated_at);

-- =========================================
-- 1️⃣2️⃣ BINDERS
-- Abstracts ownership from users (future-proof)
-- =========================================
CREATE TABLE binders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'My Binder',
  is_public BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_binders_name ON binders(name);

-- =========================================
-- 1️⃣3️⃣ BINDER_CARDS
-- Most important table for future algorithms
-- =========================================
CREATE TABLE binder_cards (
  binder_id UUID NOT NULL REFERENCES binders(id) ON DELETE CASCADE,
  card_id TEXT NOT NULL REFERENCES cards(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  
  -- Future-ready columns (nullable for now)
  condition TEXT,                   -- NM / LP / MP / HP / DMG
  grade TEXT,                       -- PSA 10, BGS 9.5, Raw, etc.
  intent TEXT,                      -- own / sell / trade / want
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  
  PRIMARY KEY (binder_id, card_id),
  
  CONSTRAINT quantity_positive CHECK (quantity > 0)
);

CREATE INDEX idx_binder_cards_binder_id ON binder_cards(binder_id);
CREATE INDEX idx_binder_cards_card_id ON binder_cards(card_id);
CREATE INDEX idx_binder_cards_intent ON binder_cards(intent) WHERE intent IS NOT NULL;

-- =========================================
-- Constraints (data integrity)
-- =========================================
-- Note: Sale validation can be added later when pricing logic is implemented

-- =========================================
-- Notes for future extensibility:
-- 
-- This schema is designed to be additive:
-- - Can add user_id to binders later when auth is added
-- - Can add offers, trades, listings tables later
-- - Can add computed indexes/materialized views later
-- - Can normalize legalities, pokedex numbers if needed
-- - Can add more price sources without schema changes
-- - Can add more binder metadata (description, tags, etc.)
-- =========================================
