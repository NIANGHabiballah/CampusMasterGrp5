-- Supprimer la contrainte de vérification sur le statut
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check;