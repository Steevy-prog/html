# 🛠️ Guide de configuration personnalisé du backend

## 📋 Configuration actuelle analysée

Votre backend est configuré avec :
- **Base de données :** `Archiva` sur `localhost`
- **Utilisateur MySQL :** `root` (sans mot de passe)
- **Serveur web :** Apache sur port 80
- **Frontend :** React sur port 5173
- **CORS :** Autorisé depuis `http://localhost:5173`

---

## 🔧 Éléments à vérifier/modifier selon votre environnement

### 1. **Configuration de la base de données** (`backend/config/db_connect.php`)

```php
// LIGNES 7-11 : À modifier si différent de votre setup
define('DB_HOST', 'localhost');        // ✅ Probablement correct
define('DB_NAME', 'Archiva');          // ✅ Nom de votre DB
define('DB_USER', 'root');             // ⚠️ Votre utilisateur MySQL
define('DB_PASS', '');                 // ⚠️ Mot de passe de votre utilisateur
define('DB_CHARSET', 'utf8mb4');       // ✅ Correct
```

**À vérifier :**
- **DB_USER** : Quel est votre utilisateur MySQL ? (souvent `root` sur XAMPP)
- **DB_PASS** : Mot de passe de cet utilisateur ? (souvent vide sur XAMPP)

**Pour vérifier :**
```bash
# Ouvrez phpMyAdmin et regardez le nom d'utilisateur actuel
# Ou testez dans le terminal :
mysql -u root -p
# (laissez vide si pas de mot de passe)
```

---

### 2. **Configuration CORS** (ligne 14)

```php
header('Access-Control-Allow-Origin: http://localhost:5173');
```

**À modifier si :**
- Votre frontend React tourne sur un autre port
- Vous utilisez un autre domaine

**Comment vérifier le port de votre frontend :**
```bash
cd Prosit
npm run dev
# Regardez la ligne "Local: http://localhost:XXXX"
```

---

### 3. **Chemin du backend** (`http://localhost/backend/`)

**Structure actuelle attendue :**
```
C:\xampp\htdocs\
└── backend\
    ├── config\
    │   └── db_connect.php
    ├── models\
    │   ├── User.php
    │   └── Cer.php
    └── routes\
        ├── api.php
        └── upload.php
```

**Si différent chez vous :**
- Modifiez l'URL dans `Prosit/src/services/apiService.ts` ligne 3 :
```typescript
const API_BASE_URL = 'http://localhost/backend/routes/api.php';
// Changez "backend" selon votre dossier
```

---

### 4. **Nom de la base de données**

**Actuellement :** `Archiva`

**Si vous voulez utiliser un autre nom :**
1. Créez une nouvelle base dans phpMyAdmin
2. Modifiez `DB_NAME` dans `db_connect.php`
3. Réimportez `test_data.sql` dans la nouvelle base

---

## ✅ Checklist avant de tester

- [ ] **XAMPP ouvert** avec Apache et MySQL verts
- [ ] **Base de données créée** dans phpMyAdmin (nom : `Archiva`)
- [ ] **Script `fix_database.sql` exécuté** dans phpMyAdmin
- [ ] **Backend copié** dans `C:\xampp\htdocs\backend\`
- [ ] **Frontend démarré** avec `npm run dev` dans le dossier `Prosit`
- [ ] **Port du frontend vérifié** (probablement 5173)

---

## 🧪 Tests rapides

### Test 1 : Vérifier l'API
```bash
# Dans votre navigateur :
http://localhost/backend/routes/api.php/categories
```
✅ Devrait retourner un JSON avec les catégories

### Test 2 : Vérifier la connexion
```bash
# Dans la console navigateur (F12 > Console) :
fetch('http://localhost/backend/routes/api.php/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

---

## 🔍 Problèmes courants et solutions

### Si "NetworkError" persiste :

**Problème :** Backend pas trouvé
**Solution :**
```php
// Dans apiService.ts, modifiez l'URL :
const API_BASE_URL = 'http://localhost:8080/backend/routes/api.php';
// Si vous avez changé le port d'Apache
```

**Problème :** Port du frontend différent
**Solution :**
```php
// Dans db_connect.php, modifiez le port CORS :
header('Access-Control-Allow-Origin: http://localhost:VOTRE_PORT');
```

**Problème :** Base de données différente
**Solution :**
```php
// Dans db_connect.php, modifiez :
define('DB_NAME', 'VOTRE_NOM_DE_DB');
```

---

## 📋 Configuration minimale recommandée

Pour un setup rapide, je recommande :

1. **Utilisez XAMPP par défaut** (root, pas de mot de passe)
2. **Base :** `Archiva` (comme configuré)
3. **Ports :** Apache 80, React 5173 (par défaut)
4. **Emplacement :** `C:\xampp\htdocs\backend\`

**Puis testez immédiatement** - si ça ne marche pas, nous ajusterons la configuration selon votre environnement spécifique.

---

## 🎯 Prochaines étapes

1. **Exécutez les tests ci-dessus**
2. **Notez les erreurs spécifiques**
3. **Je vous aiderai à ajuster la configuration en conséquence**

**Votre environnement est-il différent de la configuration par défaut ?** (Ports différents, nom de DB différent, etc.)
