# 🏗️ Plan de nettoyage de l'architecture

## Problèmes identifiés

### 1. Duplication des pages de liste
- `/cer` (ancienne) avec données statiques
- `/cers` (nouvelle) avec API

### 2. Duplication de la création de CER
- Page Gestion avec formulaire intégré (ne fonctionne pas)
- Page CreateCer dédiée (fonctionne)

### 3. Page Gestion utilise des données statiques
- Ne charge pas les vrais CERs de l'utilisateur
- Formulaire ne soumet pas à l'API

## 🎯 Solution recommandée

### Option A : Architecture simple (RECOMMANDÉE)

**Pages à conserver :**
1. `/acceuil` - Page d'accueil avec aperçu des CERs
2. `/cers` - Liste complète de tous les CERs (nouvelle version)
3. `/cers/:id` - Détail d'un CER
4. `/cers/create` - Création d'un CER (dédiée)
5. `/dashboard` - Dashboard utilisateur (remplace Gestion)
6. `/favoris` - Favoris de l'utilisateur

**Pages à supprimer/modifier :**
- ❌ `/cer` (ancienne version) → Supprimer
- ⚠️ `/gestion` → Transformer en redirection vers `/dashboard`

**Avantages :**
- Architecture claire et cohérente
- Une seule page par fonctionnalité
- Toutes les pages utilisent l'API
- Maintenance simplifiée

---

### Option B : Garder la page Gestion mais la moderniser

**Si vous voulez garder `/gestion` :**
1. Supprimer l'onglet "Ajouter un CER"
2. Rediriger vers `/cers/create` à la place
3. Charger les vrais CERs de l'utilisateur depuis l'API
4. Ajouter les statistiques (comme le dashboard)

---

## 🔧 Modifications à faire (Option A)

### 1. Supprimer la route `/cer`
```typescript
// Dans main.tsx, supprimer cette ligne :
<Route path="/cer" element={<Cer />} />
```

### 2. Modifier la page Gestion
Transformer `/gestion` en page de gestion moderne qui :
- Charge les CERs de l'utilisateur depuis l'API
- Affiche des statistiques
- Bouton "Créer un CER" → Redirige vers `/cers/create`
- Fonctions Éditer/Supprimer intégrées

OU simplement rediriger `/gestion` vers `/dashboard`

### 3. Mettre à jour le Header
Modifier les liens de navigation pour pointer vers les bonnes pages

---

## 📋 Checklist de nettoyage

- [ ] Supprimer le fichier `Pages/cers.tsx` (ancienne version)
- [ ] Supprimer la route `/cer` dans `main.tsx`
- [ ] Moderniser `Pages/gestion.tsx` pour utiliser l'API
- [ ] OU rediriger `/gestion` vers `/dashboard`
- [ ] Mettre à jour tous les liens dans le Header
- [ ] Mettre à jour tous les liens dans les composants
- [ ] Tester toutes les redirections

---

## 🎨 Architecture finale recommandée

```
/acceuil          → Page d'accueil (aperçu)
/cers             → Liste complète des CERs
/cers/create      → Créer un nouveau CER
/cers/:id         → Détail d'un CER
/dashboard        → Dashboard utilisateur (stats + mes CERs)
/favoris          → Mes favoris
/connexion        → Connexion
/inscription      → Inscription
```

**Navigation suggérée :**
- Header : Accueil | Explorer les CERs | Mes Favoris | Dashboard
- Dashboard : Bouton "Créer un CER" → `/cers/create`
- Page CERs : Filtres, recherche, pagination

---

## 💡 Recommandation finale

**Je recommande l'Option A** car :
1. Plus simple et plus claire
2. Le Dashboard remplace avantageusement la page Gestion
3. Une seule page par fonctionnalité
4. Architecture moderne et maintenable
5. Évite la confusion pour les utilisateurs

**Voulez-vous que j'implémente ces changements ?**
