-- Ajouter la colonne schedule à la table courses
ALTER TABLE courses ADD COLUMN IF NOT EXISTS schedule VARCHAR(255);

-- Mettre à jour les cours existants avec un horaire par défaut
UPDATE courses SET schedule = 'Lundi 14:00-16:00' WHERE schedule IS NULL;