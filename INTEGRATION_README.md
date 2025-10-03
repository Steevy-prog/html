# Guide d'intégration Frontend React - Backend PHP

## 🎯 Configuration complétée

J'ai connecté avec succès votre frontend React (dans le dossier `Prosit`) avec votre backend PHP (dans le dossier `backend`).

## 📁 Structure du projet

```
html/
├── Prosit/                          # Frontend React + Vite
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.tsx      # ✅ NOUVEAU - Gestion de l'authentification
│   │   ├── Pages/
│   │   │   ├── acceuil.tsx          # ✅ MODIFIÉ - Charge les CERs depuis l'API
│   │   │   ├── connexion.tsx        # ✅ MODIFIÉ - Connexion fonctionnelle
│   │   │   └── InscriptionNew.tsx   # ✅ NOUVEAU - Inscription fonctionnelle
│   │   ├── services/
│   │   │   └── apiService.ts        # ✅ Service API déjà configuré
│   │   ├── types/
│   │   │   └── index.ts             # ✅ Types TypeScript
│   │   └── main.tsx                 # ✅ MODIFIÉ - Routing avec AuthProvider
│   └── package.json
├── backend/                         # Backend PHP
│   ├── config/
│   │   └── db_connect.php           # ✅ Configuration DB + CORS
│   ├── controllers/
│   ├── models/
│   └── routes/
│       └── api.php                  # ✅ API REST complète
└── package.json
```

## 🚀 Démarrage du projet

### 1. Démarrer le backend PHP

**Option A : Avec XAMPP**
1. Placez le dossier `backend` dans `C:\xampp\htdocs\`
2. Démarrez Apache et MySQL depuis XAMPP Control Panel
3. L'API sera accessible à : `http://localhost/backend/routes/api.php`

**Option B : Avec PHP intégré**
```bash
cd backend
php -S localhost:8000
```

### 2. Configurer la base de données

1. Créez la base de données `Archiva` dans phpMyAdmin
2. Importez votre schéma SQL (si vous en avez un)
3. Vérifiez les credentials dans `backend/config/db_connect.php` :
   - Host: `localhost`
   - Database: `Archiva`
   - User: `root`
   - Password: `` (vide par défaut)

### 3. Démarrer le frontend React

```bash
cd Prosit
npm install
npm run dev
```

Le frontend sera accessible à : `http://localhost:5173`

## 🔧 Fonctionnalités implémentées

### ✅ Authentification
- **Connexion** : `/connexion`
  - Formulaire connecté à l'API
  - Gestion des erreurs
  - Redirection automatique après connexion
  
- **Inscription** : `/inscription`
  - Formulaire complet avec validation
  - Création de compte utilisateur
  - Redirection automatique après inscription

- **Contexte d'authentification** : `AuthContext`
  - Gestion globale de l'utilisateur connecté
  - Persistance de la session
  - Méthodes `login()`, `logout()`, `register()`

### ✅ Page d'accueil
- Chargement dynamique des CERs depuis l'API
- Affichage des 6 meilleurs CERs
- Barre de recherche fonctionnelle
- Gestion des états de chargement et d'erreur

### ✅ Service API
Le fichier `apiService.ts` fournit toutes les méthodes nécessaires :
- **Auth** : `login()`, `register()`, `logout()`, `getCurrentUser()`
- **CERs** : `getCers()`, `getCer()`, `createCer()`, `updateCer()`, `deleteCer()`
- **Favoris** : `getFavorites()`, `addFavorite()`, `removeFavorite()`
- **Recherche** : `searchCers()`
- **Catégories/Tags** : `getCategories()`, `getTags()`, `getUniversities()`

## 🔐 Configuration CORS

Le backend PHP est configuré pour accepter les requêtes depuis `http://localhost:5173` (port Vite par défaut).

Si vous utilisez un autre port, modifiez dans `backend/config/db_connect.php` :
```php
header('Access-Control-Allow-Origin: http://localhost:VOTRE_PORT');
```

## 📝 Endpoints API disponibles

### Authentification
- `POST /auth/login` - Connexion
- `POST /auth/register` - Inscription
- `POST /auth/logout` - Déconnexion
- `GET /auth/me` - Utilisateur connecté

### CERs
- `GET /cers` - Liste des CERs (avec filtres)
- `GET /cers/:id` - Détails d'un CER
- `POST /cers` - Créer un CER (authentifié)
- `PUT /cers/:id` - Modifier un CER (authentifié)
- `DELETE /cers/:id` - Supprimer un CER (authentifié)
- `GET /cers/search?q=...` - Rechercher des CERs

### Favoris
- `GET /favorites` - Liste des favoris (authentifié)
- `POST /favorites` - Ajouter aux favoris (authentifié)
- `DELETE /favorites/:id` - Retirer des favoris (authentifié)
- `GET /favorites/check/:id` - Vérifier si favori (authentifié)

### Autres
- `GET /categories` - Liste des catégories
- `GET /tags` - Liste des tags
- `GET /universities` - Liste des universités

## 🎨 Utilisation dans vos composants

### Exemple : Utiliser l'authentification

```tsx
import { useAuth } from '../context/AuthContext';

function MonComposant() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (isAuthenticated) {
    return <div>Bonjour {user?.first_name} !</div>;
  }
  
  return <button onClick={() => login(email, password)}>Se connecter</button>;
}
```

### Exemple : Charger des données

```tsx
import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

function MesComposants() {
  const [cers, setCers] = useState([]);
  
  useEffect(() => {
    const loadData = async () => {
      const response = await apiService.getCers({ limit: 10 });
      if (response.success) {
        setCers(response.data);
      }
    };
    loadData();
  }, []);
  
  return <div>{/* Afficher les CERs */}</div>;
}
```

## 🐛 Dépannage

### Erreur CORS
- Vérifiez que le backend est bien démarré
- Vérifiez l'URL dans `apiService.ts` (ligne 3)
- Vérifiez les headers CORS dans `db_connect.php`

### Erreur de connexion à la base de données
- Vérifiez que MySQL est démarré
- Vérifiez les credentials dans `db_connect.php`
- Vérifiez que la base `Archiva` existe

### Les données ne s'affichent pas
- Ouvrez la console du navigateur (F12)
- Vérifiez les erreurs réseau dans l'onglet Network
- Vérifiez que l'API retourne bien des données

## 📚 Prochaines étapes suggérées

1. **Créer des données de test** dans la base de données
2. **Implémenter les pages manquantes** :
   - Page détail d'un CER (`/cers/:id`)
   - Page favoris (`/favoris`)
   - Page de gestion (`/gestion`)
3. **Ajouter la protection des routes** (redirection si non authentifié)
4. **Améliorer la gestion des erreurs**
5. **Ajouter des notifications toast**

## ✅ Résumé des modifications

1. ✅ Créé `AuthContext.tsx` pour la gestion de l'authentification
2. ✅ Modifié `connexion.tsx` pour utiliser l'API backend
3. ✅ Créé `InscriptionNew.tsx` avec formulaire complet
4. ✅ Modifié `acceuil.tsx` pour charger les CERs depuis l'API
5. ✅ Modifié `main.tsx` pour intégrer l'AuthProvider
6. ✅ Le service API était déjà configuré et prêt à l'emploi

Votre application est maintenant **entièrement connectée** ! 🎉
