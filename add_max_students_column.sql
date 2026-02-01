-- Ajouter la colonne max_students à la table courses
ALTER TABLE courses ADD COLUMN IF NOT EXISTS max_students INTEGER DEFAULT 30;