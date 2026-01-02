-- =========================================
-- Drop all existing PokeVault tables
-- Run this before applying the new schema
-- =========================================

-- Drop tables in reverse dependency order (child tables first)
DROP TABLE IF EXISTS binder_cards CASCADE;
DROP TABLE IF EXISTS binders CASCADE;
DROP TABLE IF EXISTS prices CASCADE;
DROP TABLE IF EXISTS card_pokedex_numbers CASCADE;
DROP TABLE IF EXISTS card_resistances CASCADE;
DROP TABLE IF EXISTS card_weaknesses CASCADE;
DROP TABLE IF EXISTS abilities CASCADE;
DROP TABLE IF EXISTS attack_costs CASCADE;
DROP TABLE IF EXISTS attacks CASCADE;
DROP TABLE IF EXISTS card_subtypes CASCADE;
DROP TABLE IF EXISTS card_types CASCADE;
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS sets CASCADE;

-- Also drop old tables that might exist from previous schema
DROP TABLE IF EXISTS users CASCADE;

