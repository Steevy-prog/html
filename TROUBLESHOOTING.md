# Guide de dépannage - Connexion et CERs

## 🔧 Problèmes de connexion

### Comptes de test disponibles

Utilisez ces identifiants pour vous connecter :

**Compte étudiant :**
- Email: `test@example.com`
- Mot de passe: `password`

**Compte admin :**
- Email: `admin@archiva.com`
- Mot de passe: `password`

**Compte enseignant :**
- Email: `marie@example.com`
- Mot de passe: `password`

### Étapes de configuration

#### 1. Vérifier que MySQL est démarré
- Ouvrez XAMPP Control Panel
- Démarrez Apache et MySQL
- Vérifiez que les deux sont en vert (Running)

#### 2. Créer la base de données
1. Ouvrez phpMyAdmin : `http://localhost/phpmyadmin`
2. Créez une nouvelle base de données nommée `Archiva`
3. Sélectionnez l'encodage `utf8mb4_unicode_ci`

#### 3. Importer les données de test
1. Dans phpMyAdmin, sélectionnez la base `Archiva`
2. Cliquez sur l'onglet "SQL"
3. Copiez le contenu du fichier `backend/test_data.sql`
4. Collez-le dans la zone de texte
5. Cliquez sur "Exécuter"

#### 4. Vérifier la configuration backend
Le fichier `backend/config/db_connect.php` doit contenir :
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'Archiva');
define('DB_USER', 'root');
define('DB_PASS', ''); // Vide pour XAMPP par défaut
```

#### 5. Placer le backend au bon endroit
- Copiez le dossier `backend` dans `C:\xampp\htdocs\`
- L'API doit être accessible à : `http://localhost/backend/routes/api.php`

#### 6. Tester l'API
Ouvrez dans votre navigateur :
```
http://localhost/backend/routes/api.php/categories
```

Vous devriez voir une réponse JSON avec la liste des catégories.

#### 7. Démarrer le frontend React
```bash
cd Prosit
npm install
npm run dev
```

Le frontend sera accessible à : `http://localhost:5173`

## 🐛 Problèmes courants

### Erreur CORS
**Symptôme :** Erreur dans la console du navigateur mentionnant CORS

**Solution :**
1. Vérifiez que le port du frontend est bien `5173`
2. Si vous utilisez un autre port, modifiez dans `backend/config/db_connect.php` :
```php
header('Access-Control-Allow-Origin: http://localhost:VOTRE_PORT');
```

### Erreur de connexion à la base de données
**Symptôme :** Message "Erreur de connexion à la base de données"

**Solutions :**
1. Vérifiez que MySQL est démarré dans XAMPP
2. Vérifiez que la base `Archiva` existe
3. Vérifiez les credentials dans `db_connect.php`
4. Testez la connexion dans phpMyAdmin

### Les CERs ne s'affichent pas
**Symptôme :** Page vide ou "Aucun CER disponible"

**Solutions :**
1. Vérifiez que vous avez importé `test_data.sql`
2. Dans phpMyAdmin, vérifiez que la table `cers` contient des données :
```sql
SELECT * FROM cers;
```
3. Ouvrez la console du navigateur (F12) pour voir les erreurs
4. Vérifiez l'onglet Network pour voir si l'API répond

### Impossible de se connecter
**Symptôme :** "Email ou mot de passe incorrect"

**Solutions :**
1. Vérifiez que vous utilisez les bons identifiants (voir ci-dessus)
2. Vérifiez que la table `users` contient des données :
```sql
SELECT * FROM users;
```
3. Si la table est vide, réimportez `test_data.sql`
4. Vérifiez que les sessions PHP fonctionnent (dans `php.ini`, `session.save_path` doit être configuré)

### Erreur 404 sur l'API
**Symptôme :** "Route non trouvée" ou erreur 404

**Solutions :**
1. Vérifiez que le backend est dans `C:\xampp\htdocs\backend\`
2. Testez l'URL directement : `http://localhost/backend/routes/api.php/auth/me`
3. Vérifiez le fichier `.htaccess` dans le dossier backend

## 🔍 Débogage avancé

### Activer les logs PHP
Dans `php.ini` (via XAMPP Control Panel > Config) :
```ini
error_reporting = E_ALL
display_errors = On
log_errors = On
error_log = "C:/xampp/php/logs/php_error_log"
```

### Vérifier les logs
- **PHP errors :** `C:\xampp\php\logs\php_error_log`
- **Apache errors :** `C:\xampp\apache\logs\error.log`
- **Console navigateur :** F12 > Console

### Tester l'API avec curl
```bash
# Test de connexion
curl -X POST http://localhost/backend/routes/api.php/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Test de récupération des CERs
curl http://localhost/backend/routes/api.php/cers
```

## 📝 Créer un compte manuellement

Si vous voulez créer votre propre compte :

1. Allez sur la page d'inscription : `http://localhost:5173/inscription`
2. Remplissez le formulaire
3. Le mot de passe sera automatiquement hashé avec bcrypt

Ou via SQL dans phpMyAdmin :
```sql
INSERT INTO users (username, email, password_hash, first_name, last_name, role, is_active, created_at) 
VALUES (
    'monusername',
    'mon@email.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: "password"
    'Mon',
    'Nom',
    'student',
    TRUE,
    NOW()
);
```

## ✅ Checklist de vérification

- [ ] XAMPP est installé et démarré (Apache + MySQL)
- [ ] La base de données `Archiva` existe
- [ ] Les données de test sont importées (`test_data.sql`)
- [ ] Le backend est dans `C:\xampp\htdocs\backend\`
- [ ] L'API répond : `http://localhost/backend/routes/api.php/categories`
- [ ] Le frontend est démarré : `npm run dev` dans le dossier `Prosit`
- [ ] Le frontend est accessible : `http://localhost:5173`
- [ ] Vous pouvez vous connecter avec `test@example.com` / `password`
- [ ] Les CERs s'affichent sur la page d'accueil

## 🆘 Besoin d'aide supplémentaire ?

Si le problème persiste :
1. Vérifiez la console du navigateur (F12 > Console)
2. Vérifiez l'onglet Network pour voir les requêtes API
3. Vérifiez les logs PHP et Apache
4. Assurez-vous que tous les fichiers sont bien en place
