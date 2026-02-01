-- Supprimer la contrainte existante et recréer avec toutes les valeurs
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check;
ALTER TABLE users ADD CONSTRAINT users_status_check CHECK (status IN ('ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED'));