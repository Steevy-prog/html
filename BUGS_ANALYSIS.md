# 🐛 Analyse complète des bugs - Pourquoi les CERs ne se chargent pas

## ❌ BUGS CRITIQUES (Empêchent le fonctionnement)

### 1. **Vue SQL manquante `v_cers_complete`** - CRITIQUE ⚠️
**Fichier :** `backend/models/Cer.php` lignes 16, 60, 184

**Problème :**
```php
$sql = "SELECT * FROM v_cers_complete WHERE 1=1";
```

Cette vue SQL **n'existe pas** dans votre base de données ! Quand le frontend appelle `/api/cers`, le backend essaie de faire une requête sur une vue qui n'existe pas → **Erreur SQL** → Aucun CER ne se charge.

**Symptômes :**
- La page `/cers` est vide
- Les CERs uploadés ne s'affichent pas
- Erreur dans les logs PHP : "Table 'Archiva.v_cers_complete' doesn't exist"

**Solution :**
Créer la vue SQL manquante (voir section Solutions ci-dessous)

---

### 2. **Procédures stockées manquantes** - CRITIQUE ⚠️
**Fichier :** `backend/models/Cer.php` lignes 129, 143

**Problème :**
```php
$stmt = $this->db->prepare("CALL increment_cer_views(:cer_id)");
$stmt = $this->db->prepare("CALL increment_cer_downloads(:cer_id, :user_id, :ip)");
```

Ces procédures stockées **n'existent pas** → Quand vous consultez un CER, erreur SQL.

**Symptômes :**
- Impossible de consulter un CER (page blanche ou erreur)
- Les compteurs de vues ne s'incrémentent pas

**Solution :**
Créer les procédures stockées (voir section Solutions)

---

### 3. **Index FULLTEXT manquant pour la recherche** - BLOQUANT
**Fichier :** `backend/models/Cer.php` ligne 160

**Problème :**
```php
MATCH(c.title, c.description, c.keywords) AGAINST(:query)
```

Le MATCH...AGAINST nécessite un index FULLTEXT qui n'existe probablement pas.

**Symptômes :**
- La recherche ne fonctionne pas
- Erreur : "Can't find FULLTEXT index matching the column list"

**Solution :**
Créer l'index FULLTEXT (voir section Solutions)

---

## ⚠️ BUGS MOYENS (Fonctionnalité partielle)

### 4. **Sessions PHP non persistantes**
**Fichier :** `backend/routes/api.php` ligne 7

**Problème :**
Les sessions PHP peuvent ne pas persister entre les requêtes à cause des cookies cross-origin.

**Symptômes :**
- Déconnexion automatique
- "Non authentifié" même après connexion
- Impossible de créer un CER

**Solution actuelle :**
CORS est déjà configuré avec `Access-Control-Allow-Credentials: true`, mais vérifier que :
- Le frontend utilise `credentials: 'include'` ✅ (déjà fait)
- Les cookies de session sont bien envoyés

---

### 5. **Timestamps avec timezone**
**Fichier :** `backend/routes/api.php` ligne 114

**Problème :**
```php
$data = json_decode(file_get_contents('php://input'), true);
```

Si le frontend envoie des dates avec timezone, PHP pourrait avoir des problèmes.

**Impact :** Faible, mais peut causer des erreurs de parsing

---

### 6. **Validation des fichiers uploadés insuffisante**
**Fichier :** `backend/routes/upload.php`

**Problème :**
Pas de vérification du contenu réel du fichier (seulement l'extension).

**Risque :** Sécurité - quelqu'un pourrait uploader un fichier malveillant avec extension .pdf

---

## 🔧 BUGS MINEURS (UX/UI)

### 7. **Type TypeScript incomplet pour Notification**
**Fichier :** `Prosit/src/components/NotificationBell.tsx`

**Problème :**
Le type `Notification` n'est pas importé depuis `../types`

**Symptôme :**
Avertissement TypeScript dans l'IDE

---

### 8. **Gestion d'erreur limitée côté frontend**
**Fichier :** Plusieurs composants React

**Problème :**
Quand l'API retourne une erreur, le message n'est pas toujours affiché clairement à l'utilisateur.

**Amélioration :**
Ajouter un système de notifications toast pour les erreurs

---

## ✅ SOLUTIONS - FICHIER SQL À EXÉCUTER

Créez ce fichier et exécutez-le dans phpMyAdmin :

```sql
-- ============================================
-- FICHIER DE CORRECTION DES BUGS
-- À exécuter dans phpMyAdmin sur la base Archiva
-- ============================================

-- 1. CRÉER LA VUE v_cers_complete (BUG CRITIQUE #1)
-- Cette vue combine les informations des CERs avec les données des auteurs et catégories

DROP VIEW IF EXISTS v_cers_complete;

CREATE VIEW v_cers_complete AS
SELECT 
    c.cer_id,
    c.title,
    c.description,
    c.author_id,
    c.category_id,
    c.university_id,
    c.status,
    c.language,
    c.keywords,
    c.file_path,
    c.file_type,
    c.file_size,
    c.thumbnail,
    c.views_count,
    c.downloads_count,
    c.favorite_count,
    c.average_rating,
    c.rating_count,
    c.is_public,
    c.created_at,
    c.updated_at,
    -- Informations de l'auteur
    u.username as author_username,
    u.first_name as author_first_name,
    u.last_name as author_last_name,
    u.email as author_email,
    u.profile_picture as author_profile_picture,
    -- Informations de la catégorie
    cat.name as category_name,
    cat.description as category_description,
    cat.color_code as category_color,
    -- Informations de l'université
    uni.name as university_name,
    uni.city as university_city,
    uni.country as university_country
FROM cers c
LEFT JOIN users u ON c.author_id = u.user_id
LEFT JOIN categories cat ON c.category_id = cat.category_id
LEFT JOIN universities uni ON c.university_id = uni.university_id;

-- 2. CRÉER LES PROCÉDURES STOCKÉES (BUG CRITIQUE #2)

-- Procédure pour incrémenter les vues
DROP PROCEDURE IF EXISTS increment_cer_views;

DELIMITER //
CREATE PROCEDURE increment_cer_views(IN p_cer_id INT)
BEGIN
    UPDATE cers 
    SET views_count = views_count + 1,
        updated_at = NOW()
    WHERE cer_id = p_cer_id;
END //
DELIMITER ;

-- Procédure pour incrémenter les téléchargements
DROP PROCEDURE IF EXISTS increment_cer_downloads;

DELIMITER //
CREATE PROCEDURE increment_cer_downloads(
    IN p_cer_id INT,
    IN p_user_id INT,
    IN p_ip VARCHAR(45)
)
BEGIN
    -- Incrémenter le compteur
    UPDATE cers 
    SET downloads_count = downloads_count + 1,
        updated_at = NOW()
    WHERE cer_id = p_cer_id;
    
    -- Enregistrer le téléchargement (optionnel, pour les statistiques)
    -- INSERT INTO download_logs (cer_id, user_id, ip_address, downloaded_at)
    -- VALUES (p_cer_id, p_user_id, p_ip, NOW());
END //
DELIMITER ;

-- 3. CRÉER L'INDEX FULLTEXT pour la recherche (BUG CRITIQUE #3)

-- Vérifier si l'index existe déjà, sinon le créer
ALTER TABLE cers DROP INDEX IF EXISTS idx_fulltext_search;
ALTER TABLE cers ADD FULLTEXT INDEX idx_fulltext_search (title, description, keywords);

-- 4. VÉRIFIER LES COLONNES MANQUANTES

-- Ajouter la colonne comment_count si elle n'existe pas
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'Archiva' 
  AND TABLE_NAME = 'cers' 
  AND COLUMN_NAME = 'comment_count';

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE cers ADD COLUMN comment_count INT DEFAULT 0 AFTER rating_count',
    'SELECT "Column comment_count already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 5. CRÉER DES TRIGGERS pour maintenir les compteurs à jour

-- Trigger pour mettre à jour le compteur de commentaires
DROP TRIGGER IF EXISTS after_comment_insert;
DELIMITER //
CREATE TRIGGER after_comment_insert
AFTER INSERT ON comments
FOR EACH ROW
BEGIN
    UPDATE cers 
    SET comment_count = (SELECT COUNT(*) FROM comments WHERE cer_id = NEW.cer_id AND is_approved = TRUE)
    WHERE cer_id = NEW.cer_id;
END //
DELIMITER ;

DROP TRIGGER IF EXISTS after_comment_delete;
DELIMITER //
CREATE TRIGGER after_comment_delete
AFTER DELETE ON comments
FOR EACH ROW
BEGIN
    UPDATE cers 
    SET comment_count = (SELECT COUNT(*) FROM comments WHERE cer_id = OLD.cer_id AND is_approved = TRUE)
    WHERE cer_id = OLD.cer_id;
END //
DELIMITER ;

-- Trigger pour mettre à jour le compteur de favoris
DROP TRIGGER IF EXISTS after_favorite_insert;
DELIMITER //
CREATE TRIGGER after_favorite_insert
AFTER INSERT ON favorites
FOR EACH ROW
BEGIN
    UPDATE cers 
    SET favorite_count = favorite_count + 1
    WHERE cer_id = NEW.cer_id;
END //
DELIMITER ;

DROP TRIGGER IF EXISTS after_favorite_delete;
DELIMITER //
CREATE TRIGGER after_favorite_delete
AFTER DELETE ON favorites
FOR EACH ROW
BEGIN
    UPDATE cers 
    SET favorite_count = favorite_count - 1
    WHERE cer_id = OLD.cer_id;
END //
DELIMITER ;

-- Trigger pour mettre à jour la moyenne des ratings
DROP TRIGGER IF EXISTS after_rating_insert;
DELIMITER //
CREATE TRIGGER after_rating_insert
AFTER INSERT ON ratings
FOR EACH ROW
BEGIN
    UPDATE cers 
    SET average_rating = (SELECT AVG(rating) FROM ratings WHERE cer_id = NEW.cer_id),
        rating_count = (SELECT COUNT(*) FROM ratings WHERE cer_id = NEW.cer_id)
    WHERE cer_id = NEW.cer_id;
END //
DELIMITER ;

DROP TRIGGER IF EXISTS after_rating_update;
DELIMITER //
CREATE TRIGGER after_rating_update
AFTER UPDATE ON ratings
FOR EACH ROW
BEGIN
    UPDATE cers 
    SET average_rating = (SELECT AVG(rating) FROM ratings WHERE cer_id = NEW.cer_id),
        rating_count = (SELECT COUNT(*) FROM ratings WHERE cer_id = NEW.cer_id)
    WHERE cer_id = NEW.cer_id;
END //
DELIMITER ;

DROP TRIGGER IF EXISTS after_rating_delete;
DELIMITER //
CREATE TRIGGER after_rating_delete
AFTER DELETE ON ratings
FOR EACH ROW
BEGIN
    UPDATE cers 
    SET average_rating = (SELECT COALESCE(AVG(rating), 0) FROM ratings WHERE cer_id = OLD.cer_id),
        rating_count = (SELECT COUNT(*) FROM ratings WHERE cer_id = OLD.cer_id)
    WHERE cer_id = OLD.cer_id;
END //
DELIMITER ;

-- 6. METTRE À JOUR LES COMPTEURS EXISTANTS

-- Recalculer tous les compteurs pour les CERs existants
UPDATE cers c
SET comment_count = (
    SELECT COUNT(*) FROM comments 
    WHERE cer_id = c.cer_id AND is_approved = TRUE
),
favorite_count = (
    SELECT COUNT(*) FROM favorites 
    WHERE cer_id = c.cer_id
),
average_rating = (
    SELECT COALESCE(AVG(rating), 0) FROM ratings 
    WHERE cer_id = c.cer_id
),
rating_count = (
    SELECT COUNT(*) FROM ratings 
    WHERE cer_id = c.cer_id
);

-- VÉRIFICATION
SELECT 'Setup completed successfully!' as status;
SELECT COUNT(*) as total_cers FROM cers;
SELECT COUNT(*) as total_users FROM users;
```

---

## 📋 CHECKLIST DE CORRECTION

Exécutez ces étapes dans l'ordre :

1. ✅ **Ouvrir phpMyAdmin** : `http://localhost/phpmyadmin`
2. ✅ **Sélectionner la base** : `Archiva`
3. ✅ **Copier tout le code SQL ci-dessus**
4. ✅ **Aller dans l'onglet "SQL"**
5. ✅ **Coller et exécuter**
6. ✅ **Vérifier qu'il n'y a pas d'erreurs**
7. ✅ **Tester l'application**

---

## 🧪 TESTS APRÈS CORRECTION

### Test 1 : Vérifier la vue
```sql
SELECT * FROM v_cers_complete LIMIT 1;
```
✅ Devrait retourner au moins un CER avec toutes les infos

### Test 2 : Vérifier les procédures
```sql
CALL increment_cer_views(1);
SELECT views_count FROM cers WHERE cer_id = 1;
```
✅ Le compteur devrait avoir augmenté

### Test 3 : Vérifier la recherche
```sql
SELECT * FROM cers 
WHERE MATCH(title, description, keywords) AGAINST('base de données');
```
✅ Devrait retourner des résultats

### Test 4 : Tester le frontend
1. Allez sur `http://localhost:5173/cers`
2. ✅ Les CERs devraient s'afficher
3. Cliquez sur "Consulter"
4. ✅ La page de détail devrait s'afficher
5. Le compteur de vues devrait augmenter

---

## 🎯 BUGS RÉSOLUS APRÈS CORRECTION

Après avoir exécuté le SQL ci-dessus :

✅ Les CERs se chargeront correctement
✅ La consultation fonctionnera
✅ Les compteurs de vues/téléchargements fonctionneront
✅ La recherche fonctionnera
✅ Les favoris et commentaires mettront à jour les compteurs automatiquement

---

## 🔍 DEBUGGING EN CAS DE PROBLÈME

### Si les CERs ne se chargent toujours pas :

1. **Vérifier les logs PHP :**
   - `C:\xampp\php\logs\php_error_log`
   - Cherchez les erreurs SQL

2. **Vérifier les logs Apache :**
   - `C:\xampp\apache\logs\error.log`

3. **Tester l'API directement :**
   ```
   http://localhost/backend/routes/api.php/cers
   ```
   Devrait retourner un JSON avec la liste des CERs

4. **Console du navigateur (F12) :**
   - Onglet Network : voir si les requêtes réussissent
   - Onglet Console : voir les erreurs JavaScript

5. **Vérifier la base de données :**
   ```sql
   -- La vue existe ?
   SHOW FULL TABLES WHERE Table_type = 'VIEW';
   
   -- Les procédures existent ?
   SHOW PROCEDURE STATUS WHERE Db = 'Archiva';
   
   -- L'index FULLTEXT existe ?
   SHOW INDEX FROM cers WHERE Index_type = 'FULLTEXT';
   ```

---

## 📌 RÉSUMÉ

**Cause principale :** La vue SQL `v_cers_complete` n'existe pas dans votre base de données.

**Impact :** TOUTES les requêtes pour charger les CERs échouent silencieusement.

**Solution :** Exécuter le script SQL de correction ci-dessus.

**Temps estimé :** 2 minutes pour exécuter le script, puis tout devrait fonctionner.
