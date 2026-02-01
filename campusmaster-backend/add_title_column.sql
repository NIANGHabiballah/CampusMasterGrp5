-- Ajouter la colonne title si elle n'existe pas
ALTER TABLE materials ADD COLUMN IF NOT EXISTS title VARCHAR(255) NOT NULL DEFAULT 'Document';