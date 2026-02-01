-- Mettre à jour les emails des comptes de démonstration
UPDATE users SET email = 'admin@campus.sn' WHERE email = 'admin@campus.fr';
UPDATE users SET email = 'prof@campus.sn' WHERE email = 'prof@campus.fr';
UPDATE users SET email = 'etudiant@campus.sn' WHERE email = 'etudiant@campus.fr';