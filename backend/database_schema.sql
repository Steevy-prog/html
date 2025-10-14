-- ============================================
-- ARCHIVA - DATABASE CREATION SCRIPT
-- ============================================

-- Drop database if exists and create a new one
DROP DATABASE IF EXISTS archiva;
CREATE DATABASE archiva CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE archiva;

-- ============================================
-- TABLE: users
-- Stores user account information
-- ============================================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role ENUM('student', 'teacher', 'admin') NOT NULL DEFAULT 'student',
    institution VARCHAR(255),
    country VARCHAR(100),
    profile_picture VARCHAR(255),
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_username (username)
) ENGINE=InnoDB;

-- ============================================
-- TABLE: categories
-- Document categories
-- ============================================
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color_code VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category_name (name)
) ENGINE=InnoDB;

-- ============================================
-- TABLE: universities
-- Universities and institutions
-- ============================================
CREATE TABLE universities (
    university_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    website VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_university_name (name)
) ENGINE=InnoDB;

-- ============================================
-- TABLE: cers
-- Main table for storing documents (CERs)
-- ============================================
CREATE TABLE cers (
    cer_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    author_id INT NOT NULL,
    category_id INT,
    university_id INT,
    status ENUM('draft', 'pending_review', 'published', 'rejected') DEFAULT 'draft',
    language VARCHAR(10) DEFAULT 'fr',
    keywords TEXT,
    file_path VARCHAR(512) NOT NULL,
    file_type VARCHAR(50),
    file_size BIGINT,
    thumbnail VARCHAR(512),
    views_count INT DEFAULT 0,
    downloads_count INT DEFAULT 0,
    favorite_count INT DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    rating_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    FOREIGN KEY (university_id) REFERENCES universities(university_id) ON DELETE SET NULL,
    FULLTEXT INDEX idx_fulltext_search (title, description, keywords)
) ENGINE=InnoDB;

-- ============================================
-- TABLE: tags
-- Tags for categorizing documents
-- ============================================
CREATE TABLE tags (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    usage_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tag_name (name)
) ENGINE=InnoDB;

-- ============================================
-- TABLE: cer_tags
-- Many-to-many relationship between cers and tags
-- ============================================
CREATE TABLE cer_tags (
    cer_id INT NOT NULL,
    tag_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (cer_id, tag_id),
    FOREIGN KEY (cer_id) REFERENCES cers(cer_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(tag_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- TABLE: comments
-- User comments on documents
-- ============================================
CREATE TABLE comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    cer_id INT NOT NULL,
    user_id INT NOT NULL,
    parent_id INT,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cer_id) REFERENCES cers(cer_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(comment_id) ON DELETE SET NULL,
    INDEX idx_comment_cer (cer_id),
    INDEX idx_comment_user (user_id)
) ENGINE=InnoDB;

-- ============================================
-- TABLE: ratings
-- User ratings for documents
-- ============================================
CREATE TABLE ratings (
    rating_id INT AUTO_INCREMENT PRIMARY KEY,
    cer_id INT NOT NULL,
    user_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_rating (cer_id, user_id),
    FOREIGN KEY (cer_id) REFERENCES cers(cer_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- TABLE: favorites
-- User favorites
-- ============================================
CREATE TABLE favorites (
    favorite_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    cer_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_favorite (user_id, cer_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (cer_id) REFERENCES cers(cer_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- TABLE: downloads
-- Track document downloads
-- ============================================
CREATE TABLE downloads (
    download_id INT AUTO_INCREMENT PRIMARY KEY,
    cer_id INT NOT NULL,
    user_id INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cer_id) REFERENCES cers(cer_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_download_cer (cer_id),
    INDEX idx_download_user (user_id)
) ENGINE=InnoDB;

-- ============================================
-- TABLE: password_resets
-- Password reset tokens
-- ============================================
CREATE TABLE password_resets (
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_password_reset_email (email),
    INDEX idx_password_reset_token (token)
) ENGINE=InnoDB;

-- ============================================
-- TRIGGERS
-- ============================================

-- Update comment_count when a new comment is added
DELIMITER //
CREATE TRIGGER after_comment_insert
AFTER INSERT ON comments
FOR EACH ROW
BEGIN
    UPDATE cers 
    SET comment_count = (
        SELECT COUNT(*) 
        FROM comments 
        WHERE cer_id = NEW.cer_id AND is_approved = TRUE
    )
    WHERE cer_id = NEW.cer_id;
END //

-- Update comment_count when a comment is deleted
CREATE TRIGGER after_comment_delete
AFTER DELETE ON comments
FOR EACH ROW
BEGIN
    UPDATE cers 
    SET comment_count = (
        SELECT COUNT(*) 
        FROM comments 
        WHERE cer_id = OLD.cer_id AND is_approved = TRUE
    )
    WHERE cer_id = OLD.cer_id;
END //

-- Update comment_count when a comment is updated
CREATE TRIGGER after_comment_update
AFTER UPDATE ON comments
FOR EACH ROW
BEGIN
    IF OLD.is_approved != NEW.is_approved OR OLD.cer_id != NEW.cer_id THEN
        -- Update old cer's comment count
        UPDATE cers 
        SET comment_count = (
            SELECT COUNT(*) 
            FROM comments 
            WHERE cer_id = OLD.cer_id AND is_approved = TRUE
        )
        WHERE cer_id = OLD.cer_id;
        
        -- Update new cer's comment count if cer_id changed
        IF OLD.cer_id != NEW.cer_id THEN
            UPDATE cers 
            SET comment_count = (
                SELECT COUNT(*) 
                FROM comments 
                WHERE cer_id = NEW.cer_id AND is_approved = TRUE
            )
            WHERE cer_id = NEW.cer_id;
        END IF;
    END IF;
END //

-- Update average_rating and rating_count when a new rating is added
CREATE TRIGGER after_rating_insert
AFTER INSERT ON ratings
FOR EACH ROW
BEGIN
    UPDATE cers c
    SET 
        average_rating = (
            SELECT AVG(rating) 
            FROM ratings 
            WHERE cer_id = NEW.cer_id
        ),
        rating_count = (
            SELECT COUNT(*) 
            FROM ratings 
            WHERE cer_id = NEW.cer_id
        )
    WHERE c.cer_id = NEW.cer_id;
END //

-- Update average_rating and rating_count when a rating is updated
CREATE TRIGGER after_rating_update
AFTER UPDATE ON ratings
FOR EACH ROW
BEGIN
    IF OLD.cer_id = NEW.cer_id THEN
        -- Same cer_id, just update the single cer
        UPDATE cers c
        SET 
            average_rating = (
                SELECT AVG(rating) 
                FROM ratings 
                WHERE cer_id = NEW.cer_id
            )
        WHERE c.cer_id = NEW.cer_id;
    ELSE
        -- cer_id changed, update both old and new cers
        -- Update old cer
        UPDATE cers c
        SET 
            average_rating = (
                SELECT AVG(rating) 
                FROM ratings 
                WHERE cer_id = OLD.cer_id
            ),
            rating_count = (
                SELECT COUNT(*) 
                FROM ratings 
                WHERE cer_id = OLD.cer_id
            )
        WHERE c.cer_id = OLD.cer_id;
        
        -- Update new cer
        UPDATE cers c
        SET 
            average_rating = (
                SELECT AVG(rating) 
                FROM ratings 
                WHERE cer_id = NEW.cer_id
            ),
            rating_count = (
                SELECT COUNT(*) 
                FROM ratings 
                WHERE cer_id = NEW.cer_id
            )
        WHERE c.cer_id = NEW.cer_id;
    END IF;
END //

-- Update average_rating and rating_count when a rating is deleted
CREATE TRIGGER after_rating_delete
AFTER DELETE ON ratings
FOR EACH ROW
BEGIN
    DECLARE avg_rating DECIMAL(3,2);
    DECLARE count_ratings INT;
    
    -- Get average and count for the cer
    SELECT 
        IFNULL(AVG(rating), 0),
        COUNT(*)
    INTO 
        avg_rating,
        count_ratings
    FROM ratings 
    WHERE cer_id = OLD.cer_id;
    
    -- Update the cer
    UPDATE cers 
    SET 
        average_rating = avg_rating,
        rating_count = count_ratings
    WHERE cer_id = OLD.cer_id;
END //

-- Update favorite_count when a favorite is added
CREATE TRIGGER after_favorite_insert
AFTER INSERT ON favorites
FOR EACH ROW
BEGIN
    UPDATE cers 
    SET favorite_count = favorite_count + 1
    WHERE cer_id = NEW.cer_id;
END //

-- Update favorite_count when a favorite is removed
CREATE TRIGGER after_favorite_delete
AFTER DELETE ON favorites
FOR EACH ROW
BEGIN
    UPDATE cers 
    SET favorite_count = GREATEST(0, favorite_count - 1)
    WHERE cer_id = OLD.cer_id;
END //

-- Update downloads_count when a download is recorded
CREATE TRIGGER after_download_insert
AFTER INSERT ON downloads
FOR EACH ROW
BEGIN
    UPDATE cers 
    SET downloads_count = downloads_count + 1
    WHERE cer_id = NEW.cer_id;
END //

DELIMITER ;

-- ============================================
-- STORED PROCEDURES
-- ============================================

-- Procedure to increment view count for a CER
DELIMITER //
CREATE PROCEDURE increment_cer_views(IN p_cer_id INT)
BEGIN
    UPDATE cers 
    SET views_count = views_count + 1,
        updated_at = NOW()
    WHERE cer_id = p_cer_id;
END //

-- Procedure to record a download
CREATE PROCEDURE record_download(
    IN p_cer_id INT,
    IN p_user_id INT,
    IN p_ip_address VARCHAR(45),
    IN p_user_agent TEXT
)
BEGIN
    -- Record the download
    INSERT INTO downloads (cer_id, user_id, ip_address, user_agent)
    VALUES (p_cer_id, p_user_id, p_ip_address, p_user_agent);
    
    -- The after_download_insert trigger will handle the count update
END //

-- Procedure to get user's favorite CERS
CREATE PROCEDURE get_user_favorites(IN p_user_id INT)
BEGIN
    SELECT c.* 
    FROM cers c
    JOIN favorites f ON c.cer_id = f.cer_id
    WHERE f.user_id = p_user_id
    ORDER BY f.created_at DESC;
END //

-- Procedure to search CERS with filters
CREATE PROCEDURE search_cers(
    IN p_search_term VARCHAR(255),
    IN p_category_id INT,
    IN p_university_id INT,
    IN p_min_rating DECIMAL(3,2),
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SET @sql = '
        SELECT DISTINCT c.*,
               u.username as author_username,
               cat.name as category_name,
               uni.name as university_name
        FROM cers c
        LEFT JOIN users u ON c.author_id = u.user_id
        LEFT JOIN categories cat ON c.category_id = cat.category_id
        LEFT JOIN universities uni ON c.university_id = uni.university_id
        WHERE c.status = "published" AND c.is_public = 1
    ';
    
    -- Add search term condition
    IF p_search_term IS NOT NULL AND p_search_term != '' THEN
        SET @sql = CONCAT(@sql, ' AND MATCH(c.title, c.description, c.keywords) AGAINST(', QUOTE(p_search_term), ' IN BOOLEAN MODE)');
    END IF;
    
    -- Add category filter
    IF p_category_id IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND c.category_id = ', p_category_id);
    END IF;
    
    -- Add university filter
    IF p_university_id IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND c.university_id = ', p_university_id);
    END IF;
    
    -- Add minimum rating filter
    IF p_min_rating IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND c.average_rating >= ', p_min_rating);
    END IF;
    
    -- Add sorting and pagination
    SET @sql = CONCAT(@sql, ' ORDER BY c.updated_at DESC');
    
    IF p_limit IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' LIMIT ', p_limit);
        
        IF p_offset IS NOT NULL THEN
            SET @sql = CONCAT(@sql, ' OFFSET ', p_offset);
        END IF;
    END IF;
    
    -- Execute the dynamic SQL
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END //

DELIMITER ;

-- ============================================
-- VIEWS
-- ============================================

-- View for complete CER information
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
    c.comment_count,
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

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password_hash, first_name, last_name, role, is_active)
VALUES (
    'admin', 
    'admin@archiva.local', 
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    'Admin', 
    'User', 
    'admin', 
    TRUE
);

-- Insert default categories
INSERT INTO categories (name, description, color_code) VALUES
('Informatique', 'Documents liés à l\'informatique et aux technologies', '#3B82F6'),
('Mathématiques', 'Documents de mathématiques pures et appliquées', '#10B981'),
('Physique', 'Physique théorique et expérimentale', '#F59E0B'),
('Chimie', 'Chimie organique, inorganique et physique', '#EF4444'),
('Biologie', 'Sciences de la vie et biologie', '#8B5CF6'),
('Économie', 'Sciences économiques et gestion', '#EC4899'),
('Lettres', 'Littérature et sciences humaines', '#14B8A6'),
('Droit', 'Droit public et privé', '#F97316'),
('Médecine', 'Sciences médicales', '#06B6D4'),
('Autres', 'Autres catégories', '#9CA3AF');

-- Insert some universities
INSERT INTO universities (name, country, city, website, is_active) VALUES
('Université Paris-Saclay', 'France', 'Saclay', 'https://www.universite-paris-saclay.fr', TRUE),
('Sorbonne Université', 'France', 'Paris', 'https://www.sorbonne-universite.fr', TRUE),
('Université Paris Cité', 'France', 'Paris', 'https://u-paris.fr', TRUE),
('Université PSL', 'France', 'Paris', 'https://psl.eu', TRUE),
('École Polytechnique', 'France', 'Palaiseau', 'https://www.polytechnique.edu', TRUE),
('Sorbonne Université - Faculté des Sciences', 'France', 'Paris', 'https://sciences.sorbonne-universite.fr', TRUE),
('Université de Montpellier', 'France', 'Montpellier', 'https://www.umontpellier.fr', TRUE),
('Aix-Marseille Université', 'France', 'Marseille', 'https://www.univ-amu.fr', TRUE),
('Université de Bordeaux', 'France', 'Bordeaux', 'https://www.u-bordeaux.fr', TRUE),
('Université de Strasbourg', 'France', 'Strasbourg', 'https://www.unistra.fr', TRUE);

-- ============================================
-- DATABASE USER AND PRIVILEGES
-- ============================================

-- Create database user (adjust password as needed)
CREATE USER 'archiva_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE ON archiva.* TO 'archiva_user'@'localhost';
FLUSH PRIVILEGES;

-- ============================================
-- DATABASE MAINTENANCE
-- ============================================

-- Create an event to clean up old password reset tokens
DELIMITER //
CREATE EVENT IF NOT EXISTS cleanup_password_resets
ON SCHEDULE EVERY 1 DAY
DO
BEGIN
    DELETE FROM password_resets WHERE created_at < DATE_SUB(NOW(), INTERVAL 24 HOUR);
END //
DELIMITER ;

-- Enable the event scheduler
SET GLOBAL event_scheduler = ON;

-- ============================================
-- DATABASE VERSION
-- ============================================

-- Store database version for future migrations
CREATE TABLE IF NOT EXISTS database_version (
    version_id INT AUTO_INCREMENT PRIMARY KEY,
    version_number VARCHAR(20) NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
) ENGINE=InnoDB;

-- Insert initial version
INSERT INTO database_version (version_number, notes) 
VALUES ('1.0.0', 'Initial database schema');

-- ============================================
-- END OF DATABASE CREATION SCRIPT
-- ============================================
