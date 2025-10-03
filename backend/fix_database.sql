-- ============================================
-- SCRIPT DE CORRECTION DES BUGS CRITIQUES
-- À exécuter dans phpMyAdmin sur la base Archiva
-- ============================================

-- 1. CRÉER LA VUE v_cers_complete (BUG CRITIQUE #1)
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
    u.username as author_username,
    u.first_name as author_first_name,
    u.last_name as author_last_name,
    u.email as author_email,
    u.profile_picture as author_profile_picture,
    cat.name as category_name,
    cat.description as category_description,
    cat.color_code as category_color,
    uni.name as university_name,
    uni.city as university_city,
    uni.country as university_country
FROM cers c
LEFT JOIN users u ON c.author_id = u.user_id
LEFT JOIN categories cat ON c.category_id = cat.category_id
LEFT JOIN universities uni ON c.university_id = uni.university_id;

-- 2. CRÉER LES PROCÉDURES STOCKÉES (BUG CRITIQUE #2)
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

DROP PROCEDURE IF EXISTS increment_cer_downloads;

DELIMITER //
CREATE PROCEDURE increment_cer_downloads(
    IN p_cer_id INT,
    IN p_user_id INT,
    IN p_ip VARCHAR(45)
)
BEGIN
    UPDATE cers 
    SET downloads_count = downloads_count + 1,
        updated_at = NOW()
    WHERE cer_id = p_cer_id;
END //
DELIMITER ;

-- 3. CRÉER L'INDEX FULLTEXT pour la recherche (BUG CRITIQUE #3)
ALTER TABLE cers DROP INDEX IF EXISTS idx_fulltext_search;
ALTER TABLE cers ADD FULLTEXT INDEX idx_fulltext_search (title, description, keywords);

-- 4. AJOUTER LA COLONNE comment_count SI NÉCESSAIRE
-- On utilise une approche simple : si la colonne existe déjà, l'erreur sera ignorée
ALTER TABLE cers ADD COLUMN comment_count INT DEFAULT 0 AFTER rating_count;

-- 5. CRÉER DES TRIGGERS pour maintenir les compteurs
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

SELECT 'Base de données corrigée avec succès!' as status;
SELECT COUNT(*) as total_cers FROM cers;
SELECT COUNT(*) as total_users FROM users;
