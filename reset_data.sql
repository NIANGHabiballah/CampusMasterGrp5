-- Supprimer toutes les données existantes pour permettre la recréation avec les nouveaux emails
DELETE FROM posts;
DELETE FROM topics;
DELETE FROM forums;
DELETE FROM assignments;
DELETE FROM courses;
DELETE FROM users;

-- Réinitialiser les séquences
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE courses_id_seq RESTART WITH 1;
ALTER SEQUENCE assignments_id_seq RESTART WITH 1;
ALTER SEQUENCE forums_id_seq RESTART WITH 1;
ALTER SEQUENCE topics_id_seq RESTART WITH 1;
ALTER SEQUENCE posts_id_seq RESTART WITH 1;