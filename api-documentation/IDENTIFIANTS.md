# Identifiants de Test CampusMaster

## Comptes disponibles

### Admin
- **Email:** admin@campus.sn
- **Mot de passe:** password

### Enseignant
- **Email:** prof@campus.sn
- **Mot de passe:** password

### Étudiant
- **Email:** etudiant@campus.sn
- **Mot de passe:** password

## Test rapide avec curl

```bash
# Connexion étudiant
curl -X POST http://localhost:8082/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "etudiant@campus.sn", "password": "password"}'

# Connexion enseignant
curl -X POST http://localhost:8082/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "prof@campus.sn", "password": "password"}'

# Connexion admin
curl -X POST http://localhost:8082/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@campus.sn", "password": "password"}'
```

## Pour Postman

Dans la collection, utilisez ces identifiants dans les requêtes de connexion.