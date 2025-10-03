# 🔧 Guide de résolution - NetworkError lors de la connexion

## ❌ Erreur : "NetworkError when attempting to fetch resource"

Cette erreur signifie que le **frontend ne peut pas atteindre le backend PHP**.

---

## ✅ Checklist de diagnostic (dans l'ordre)

### 1. **Vérifier que XAMPP est démarré** ⚠️ CRITIQUE

**Ouvrez XAMPP Control Panel :**
- Apache doit être **vert (Running)**
- MySQL doit être **vert (Running)**

**Si ce n'est pas le cas :**
1. Cliquez sur "Start" pour Apache
2. Cliquez sur "Start" pour MySQL
3. Attendez qu'ils deviennent verts

---

### 2. **Vérifier que le backend est au bon endroit**

**Chemin attendu :** `C:\xampp\htdocs\backend\`

**Structure nécessaire :**
```
C:\xampp\htdocs\
└── backend\
    ├── config\
    │   └── db_connect.php
    ├── routes\
    │   ├── api.php
    │   └── upload.php
    └── models\
        ├── User.php
        └── Cer.php
```

**Comment vérifier :**
1. Ouvrez l'Explorateur de fichiers
2. Allez dans `C:\xampp\htdocs\`
3. Vérifiez que le dossier `backend` existe
4. Vérifiez que `backend\routes\api.php` existe

**Si le backend n'est pas là :**
Copiez le dossier `backend` depuis votre projet vers `C:\xampp\htdocs\`

---

### 3. **Tester l'API directement dans le navigateur**

**Ouvrez votre navigateur et testez ces URLs :**

**Test 1 - Route de base :**
```
http://localhost/backend/routes/api.php/categories
```

✅ **Résultat attendu :** Un JSON avec la liste des catégories
```json
{
  "success": true,
  "message": "Liste des catégories",
  "data": [...]
}
```

❌ **Si vous voyez une erreur 404 :** Le backend n'est pas au bon endroit
❌ **Si la page ne charge pas :** Apache n'est pas démarré
❌ **Si vous voyez du code PHP :** Apache n'exécute pas PHP

**Test 2 - Route d'authentification :**
```
http://localhost/backend/routes/api.php/auth/me
```

✅ **Résultat attendu :** Un JSON (erreur normale si non connecté)
```json
{
  "success": false,
  "message": "Non authentifié"
}
```

---

### 4. **Vérifier l'URL de l'API dans le frontend**

**Fichier :** `Prosit/src/services/apiService.ts`

**Ligne 3 doit être :**
```typescript
const API_BASE_URL = 'http://localhost/backend/routes/api.php';
```

⚠️ **Vérifiez que c'est exactement cette URL** (pas de `/` à la fin)

---

### 5. **Vérifier la configuration CORS**

**Fichier :** `backend/config/db_connect.php`

**Lignes 14-17 doivent être :**
```php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
```

⚠️ **Le port 5173 doit correspondre à celui de votre frontend Vite**

---

## 🔍 Diagnostic avancé

### Vérifier les logs d'erreur

**Logs PHP :**
- `C:\xampp\php\logs\php_error_log`

**Logs Apache :**
- `C:\xampp\apache\logs\error.log`

### Tester avec curl (si disponible)

```bash
curl http://localhost/backend/routes/api.php/categories
```

---

## 💡 Solutions aux problèmes courants

### Problème : Apache ne démarre pas

**Cause :** Port 80 déjà utilisé par Skype ou autre application

**Solution :**
1. Dans XAMPP, cliquez sur "Config" à côté d'Apache
2. Choisir "httpd.conf"
3. Chercher `Listen 80`
4. Remplacer par `Listen 8080`
5. Sauvegarder et redémarrer Apache
6. Mettre à jour l'URL de l'API : `http://localhost:8080/backend/routes/api.php`

---

### Problème : MySQL ne démarre pas

**Cause :** Port 3306 déjà utilisé

**Solution :**
1. Arrêter les autres services MySQL
2. Ou changer le port dans XAMPP Config

---

### Problème : Le backend est au mauvais endroit

**Solution rapide :**

1. Copiez votre dossier `backend` complet
2. Collez-le dans `C:\xampp\htdocs\`
3. Le chemin final doit être : `C:\xampp\htdocs\backend\`

---

### Problème : Session PHP ne persiste pas

**Symptôme :** Vous êtes déconnecté immédiatement après connexion

**Solution :**
Vérifier `php.ini` :
```ini
session.save_path = "C:/xampp/tmp"
```

---

## 🧪 Test rapide complet

**Exécutez ces commandes dans l'ordre :**

1. **Ouvrir le navigateur :**
   ```
   http://localhost/backend/routes/api.php/categories
   ```
   → Doit retourner un JSON

2. **Tester la connexion (méthode POST)** - Utilisez un outil comme Postman ou :
   - Ouvrez la console navigateur (F12)
   - Allez dans l'onglet Console
   - Collez et exécutez :
   ```javascript
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
   → Doit retourner un JSON avec succès ou erreur

3. **Vérifier que le frontend fonctionne :**
   ```bash
   cd Prosit
   npm run dev
   ```
   → Doit démarrer sur http://localhost:5173

---

## ✅ Checklist finale

- [ ] XAMPP est ouvert
- [ ] Apache est démarré (vert)
- [ ] MySQL est démarré (vert)
- [ ] `C:\xampp\htdocs\backend\` existe
- [ ] `http://localhost/backend/routes/api.php/categories` retourne un JSON
- [ ] La base de données `Archiva` existe
- [ ] Le script `fix_database.sql` a été exécuté
- [ ] Le frontend est démarré (`npm run dev`)
- [ ] L'URL de l'API dans `apiService.ts` est correcte

---

## 🆘 Si rien ne fonctionne

1. **Redémarrez XAMPP complètement**
2. **Redémarrez le frontend** (`Ctrl+C` puis `npm run dev`)
3. **Videz le cache du navigateur** (Ctrl+Shift+Delete)
4. **Essayez en navigation privée**

---

## 📞 Message d'erreur spécifique à rechercher

Dans la console du navigateur (F12 > Console), vous devriez voir :
- L'URL exacte qui échoue
- Le type d'erreur (CORS, 404, 500, etc.)
- Plus de détails sur l'erreur

Copiez ce message pour un diagnostic plus précis.
