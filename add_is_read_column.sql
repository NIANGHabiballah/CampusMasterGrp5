-- Ajouter la colonne is_read si elle n'existe pas
ALTER TABLE messages ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;