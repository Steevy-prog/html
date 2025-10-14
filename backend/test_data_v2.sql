-- ============================================
-- ARCHIVA - TEST DATA
-- ============================================
-- This script populates the database with test data
-- Run this after executing database_schema.sql

-- Set the database context
USE archiva;

-- ============================================
-- USERS
-- ============================================
-- Password for all test users: password123
INSERT INTO users (username, email, password_hash, first_name, last_name, role, institution, country, is_active, created_at) 
VALUES 
-- Admin users
('admin', 'admin@archiva.test', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'admin', 'CESI', 'France', TRUE, NOW()),
('jdupont', 'jean.dupont@archiva.test', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jean', 'Dupont', 'admin', 'Université Paris-Saclay', 'France', TRUE, NOW()),

-- Teachers/Professors
('mleprof', 'marie.leroy@univ.test', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Marie', 'Leroy', 'teacher', 'Sorbonne Université', 'France', TRUE, NOW()),
('pdurand', 'pierre.durand@univ.test', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Pierre', 'Durand', 'teacher', 'Université Paris Cité', 'France', TRUE, NOW()),
('lmoreau', 'lucie.moreau@univ.test', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Lucie', 'Moreau', 'teacher', 'École Polytechnique', 'France', TRUE, NOW()),

-- Students
('etudiant1', 'etudiant1@student.test', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Thomas', 'Martin', 'student', 'Sorbonne Université', 'France', TRUE, NOW()),
('etudiant2', 'etudiant2@student.test', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sophie', 'Bernard', 'student', 'Université Paris-Saclay', 'France', TRUE, NOW()),
('etudiant3', 'etudiant3@student.test', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nicolas', 'Petit', 'student', 'Université Paris Cité', 'France', TRUE, NOW()),
('etudiant4', 'etudiant4@student.test', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Julie', 'Robert', 'student', 'École Polytechnique', 'France', TRUE, NOW()),
('etudiant5', 'etudiant5@student.test', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Alexandre', 'Richard', 'student', 'Sorbonne Université', 'France', TRUE, NOW());

-- ============================================
-- UNIVERSITIES
-- ============================================
-- Note: Some universities are pre-populated in database_schema.sql
INSERT INTO universities (name, country, city, website, is_active, created_at)
VALUES
('CESI École dIngénieurs', 'France', 'Paris', 'https://www.cesi.fr', TRUE, NOW()),
('Université de Technologie de Compiègne', 'France', 'Compiègne', 'https://www.utc.fr', TRUE, NOW()),
('INSA Lyon', 'France', 'Lyon', 'https://www.insa-lyon.fr', TRUE, NOW()),
('Télécom Paris', 'France', 'Palaiseau', 'https://www.telecom-paris.fr', TRUE, NOW()),
('CentraleSupélec', 'France', 'Gif-sur-Yvette', 'https://www.centralesupelec.fr', TRUE, NOW());

-- ============================================
-- CATEGORIES
-- ============================================
-- Note: Categories are pre-populated in database_schema.sql
-- We'll just add a few more specific ones
INSERT INTO categories (name, description, color_code, created_at)
VALUES
('Intelligence Artificielle', 'Machine learning, deep learning, réseaux de neurones', '#8B5CF6', NOW()),
('Cybersécurité', 'Sécurité informatique, cryptographie, pentesting', '#EF4444', NOW()),
('Développement Web', 'Frontend, backend, frameworks web', '#3B82F6', NOW()),
('Cloud Computing', 'AWS, Azure, GCP, infrastructure as code', '#10B981', NOW()),
('DevOps', 'CI/CD, conteneurisation, orchestration', '#F59E0B', NOW());

-- ============================================
-- TAGS
-- ============================================
INSERT INTO tags (name, usage_count, created_at)
VALUES
('Java', 0, NOW()),
('Python', 0, NOW()),
('JavaScript', 0, NOW()),
('Machine Learning', 0, NOW()),
('Web', 0, NOW()),
('Sécurité', 0, NOW()),
('Cloud', 0, NOW()),
('DevOps', 0, NOW()),
('Base de données', 0, NOW()),
('Réseaux', 0, NOW()),
('Algorithmique', 0, NOW()),
('IA', 0, NOW()),
('Docker', 0, NOW()),
('Kubernetes', 0, NOW()),
('React', 0, NOW()),
('Node.js', 0, NOW()),
('Spring', 0, NOW()),
('Cybersécurité', 0, NOW()),
('Big Data', 0, NOW()),
('IoT', 0, NOW());

-- ============================================
-- CERS (Documents)
-- ============================================
INSERT INTO cers (
    title, 
    description, 
    author_id, 
    category_id, 
    university_id, 
    status, 
    language, 
    keywords, 
    file_path, 
    file_type, 
    file_size, 
    is_public,
    views_count,
    downloads_count,
    favorite_count,
    created_at, 
    updated_at
) VALUES 
-- Document 1
(
    'Introduction à l\'intelligence artificielle',
    'Cours complet sur les bases de l\'intelligence artificielle, couvrant l\'apprentissage supervisé, non supervisé et par renforcement.',
    3, -- Marie Leroy
    11, -- Intelligence Artificielle
    1,  -- Université Paris-Saclay
    'published',
    'fr',
    'IA, machine learning, deep learning, réseaux de neurones',
    '/uploads/documents/ia_intro.pdf',
    'application/pdf',
    2456789,
    TRUE,
    156,
    45,
    23,
    DATE_SUB(NOW(), INTERVAL 30 DAY),
    NOW()
),
-- Document 2
(
    'Sécurité des applications web modernes',
    'Guide complet sur les vulnérabilités des applications web et les bonnes pratiques de sécurisation.',
    4, -- Pierre Durand
    12, -- Cybersécurité
    2,  -- Sorbonne Université
    'published',
    'fr',
    'sécurité, OWASP, XSS, CSRF, injection SQL',
    '/uploads/documents/securite_web.pdf',
    'application/pdf',
    1890567,
    TRUE,
    234,
    78,
    45,
    DATE_SUB(NOW(), INTERVAL 25 DAY),
    NOW()
),
-- Document 3
(
    'Développement Full Stack avec React et Node.js',
    'Tutoriel complet pour créer une application full stack moderne avec React en frontend et Node.js en backend.',
    5, -- Lucie Moreau
    13, -- Développement Web
    3,  -- Université Paris Cité
    'published',
    'fr',
    'React, Node.js, Express, MongoDB, full stack',
    '/uploads/documents/fullstack_react_node.pdf',
    'application/pdf',
    3120456,
    TRUE,
    189,
    62,
    34,
    DATE_SUB(NOW(), INTERVAL 20 DAY),
    NOW()
),
-- Document 4
(
    'Cloud Computing avec AWS',
    'Introduction aux services AWS et au déploiement d\'applications dans le cloud.',
    3, -- Marie Leroy
    14, -- Cloud Computing
    1,  -- Université Paris-Saclay
    'published',
    'fr',
    'AWS, cloud computing, EC2, S3, Lambda',
    '/uploads/documents/aws_cloud.pdf',
    'application/pdf',
    2789345,
    TRUE,
    145,
    51,
    28,
    DATE_SUB(NOW(), INTERVAL 15 DAY),
    NOW()
),
-- Document 5
(
    'Introduction à Docker et Kubernetes',
    'Guide pratique pour la conteneurisation d\'applications avec Docker et leur orchestration avec Kubernetes.',
    4, -- Pierre Durand
    15, -- DevOps
    2,  -- Sorbonne Université
    'published',
    'fr',
    'Docker, Kubernetes, conteneurs, orchestration, DevOps',
    '/uploads/documents/docker_kubernetes.pdf',
    'application/pdf',
    3210456,
    TRUE,
    201,
    89,
    52,
    DATE_SUB(NOW(), INTERVAL 10 DAY),
    NOW()
);

-- ============================================
-- CER_TAGS (Associations between CERS and TAGS)
-- ============================================
-- Get tag IDs
SET @tag_ia = (SELECT tag_id FROM tags WHERE name = 'IA');
SET @tag_ml = (SELECT tag_id FROM tags WHERE name = 'Machine Learning');
SET @tag_securite = (SELECT tag_id FROM tags WHERE name = 'Sécurité');
SET @tag_web = (SELECT tag_id FROM tags WHERE name = 'Web');
SET @tag_cloud = (SELECT tag_id FROM tags WHERE name = 'Cloud');
SET @tag_devops = (SELECT tag_id FROM tags WHERE name = 'DevOps');
SET @tag_react = (SELECT tag_id FROM tags WHERE name = 'React');
SET @tag_node = (SELECT tag_id FROM tags WHERE name = 'Node.js');
SET @tag_cybersecurite = (SELECT tag_id FROM tags WHERE name = 'Cybersécurité');
SET @tag_docker = (SELECT tag_id FROM tags WHERE name = 'Docker');
SET @tag_kubernetes = (SELECT tag_id FROM tags WHERE name = 'Kubernetes');

-- Associate tags with CERS
-- Document 1: IA
INSERT INTO cer_tags (cer_id, tag_id) VALUES (1, @tag_ia), (1, @tag_ml);

-- Document 2: Sécurité Web
INSERT INTO cer_tags (cer_id, tag_id) VALUES (2, @tag_web), (2, @tag_securite), (2, @tag_cybersecurite);

-- Document 3: Full Stack
INSERT INTO cer_tags (cer_id, tag_id) VALUES (3, @tag_web), (3, @tag_react), (3, @tag_node);

-- Document 4: Cloud
INSERT INTO cer_tags (cer_id, tag_id) VALUES (4, @tag_cloud), (4, @tag_ia);

-- Document 5: DevOps
INSERT INTO cer_tags (cer_id, tag_id) VALUES (5, @tag_devops), (5, @tag_docker), (5, @tag_kubernetes);

-- Update tag usage counts
UPDATE tags t
JOIN (
    SELECT tag_id, COUNT(*) as count
    FROM cer_tags
    GROUP BY tag_id
) ct ON t.tag_id = ct.tag_id
SET t.usage_count = ct.count;

-- ============================================
-- COMMENTS
-- ============================================
-- Comments for Document 1
INSERT INTO comments (cer_id, user_id, content, is_approved, created_at) VALUES
(1, 6, 'Très bon document, les explications sont claires et bien structurées.', TRUE, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(1, 7, 'Merci pour ce cours, il m\'a beaucoup aidé à comprendre les bases de l\'IA.', TRUE, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(1, 8, 'Est-ce qu\'il y aura une suite sur le deep learning ?', TRUE, DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Comments for Document 2
INSERT INTO comments (cer_id, user_id, content, is_approved, created_at) VALUES
(2, 6, 'Document très complet sur la sécurité web, merci !', TRUE, DATE_SUB(NOW(), INTERVAL 4 DAY)),
(2, 9, 'Les exemples pratiques sont très utiles.', TRUE, DATE_SUB(NOW(), INTERVAL 2 DAY));

-- Comments for Document 3
INSERT INTO comments (cer_id, user_id, content, is_approved, created_at) VALUES
(3, 7, 'Super tutoriel, j\'ai pu créer ma première application full stack grâce à ça !', TRUE, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(3, 10, 'Je recommande vivement, les explications sont claires et le code est bien commenté.', TRUE, DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Comments for Document 4
INSERT INTO comments (cer_id, user_id, content, is_approved, created_at) VALUES
(4, 8, 'Très bonne introduction à AWS, ça m\'a permis de bien commencer avec le cloud.', TRUE, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(4, 9, 'Est-ce qu\'il y a des exercices pratiques pour s\'entraîner ?', TRUE, NOW());

-- Comments for Document 5
INSERT INTO comments (cer_id, user_id, content, is_approved, created_at) VALUES
(5, 6, 'Parfait pour comprendre les bases de Docker et Kubernetes.', TRUE, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(5, 10, 'Les exemples sont très bien faits, merci pour ce partage !', TRUE, NOW());

-- ============================================
-- RATINGS
-- ============================================
-- Ratings for Document 1
INSERT INTO ratings (cer_id, user_id, rating, comment, created_at) VALUES
(1, 6, 5, 'Excellent cours d\'introduction à l\'IA', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(1, 7, 4, 'Très instructif, mais certains concepts mériteraient plus d\'approfondissement', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(1, 8, 5, 'Parfait pour les débutants en IA', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Ratings for Document 2
INSERT INTO ratings (cer_id, user_id, rating, comment, created_at) VALUES
(2, 6, 5, 'Document très complet sur la sécurité web', DATE_SUB(NOW(), INTERVAL 4 DAY)),
(2, 9, 4, 'Bonne introduction, mais manque d\'exemples concrets', DATE_SUB(NOW(), INTERVAL 2 DAY));

-- Ratings for Document 3
INSERT INTO ratings (cer_id, user_id, rating, comment, created_at) VALUES
(3, 7, 5, 'Super tutoriel, très bien expliqué', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(3, 10, 5, 'Je recommande vivement !', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Ratings for Document 4
INSERT INTO ratings (cer_id, user_id, rating, comment, created_at) VALUES
(4, 8, 4, 'Bonne introduction à AWS', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(4, 9, 3, 'Utile mais un peu trop basique à mon goût', NOW());

-- Ratings for Document 5
INSERT INTO ratings (cer_id, user_id, rating, comment, created_at) VALUES
(5, 6, 5, 'Parfait pour comprendre Docker et Kubernetes', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(5, 10, 5, 'Les exemples sont très bien faits, merci !', NOW());

-- ============================================
-- FAVORITES
-- ============================================
-- User 6 favorites
INSERT INTO favorites (user_id, cer_id, created_at) VALUES
(6, 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(6, 3, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(6, 5, DATE_SUB(NOW(), INTERVAL 1 DAY));

-- User 7 favorites
INSERT INTO favorites (user_id, cer_id, created_at) VALUES
(7, 2, DATE_SUB(NOW(), INTERVAL 4 DAY)),
(7, 4, DATE_SUB(NOW(), INTERVAL 2 DAY));

-- User 8 favorites
INSERT INTO favorites (user_id, cer_id, created_at) VALUES
(8, 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(8, 3, DATE_SUB(NOW(), INTERVAL 1 DAY));

-- User 9 favorites
INSERT INTO favorites (user_id, cer_id, created_at) VALUES
(9, 2, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(9, 4, NOW());

-- User 10 favorites
INSERT INTO favorites (user_id, cer_id, created_at) VALUES
(10, 3, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(10, 5, NOW());

-- ============================================
-- DOWNLOADS
-- ============================================
-- Function to generate random IP addresses
DELIMITER //
CREATE FUNCTION random_ip() RETURNS VARCHAR(15)
DETERMINISTIC
BEGIN
    RETURN CONCAT(
        FLOOR(1 + RAND() * 254), '.',
        FLOOR(0 + RAND() * 255), '.',
        FLOOR(0 + RAND() * 255), '.',
        FLOOR(1 + RAND() * 254)
    );
END //

-- Function to generate random user agents
CREATE FUNCTION random_user_agent() RETURNS TEXT
DETERMINISTIC
BEGIN
    DECLARE agents TEXT;
    SET agents = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36|';
    SET agents = CONCAT(agents, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0|');
    SET agents = CONCAT(agents, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15|');
    SET agents = CONCAT(agents, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59|');
    SET agents = CONCAT(agents, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    RETURN SUBSTRING_INDEX(SUBSTRING_INDEX(agents, '|', FLOOR(1 + RAND() * 5)), '|', -1);
END //

-- Generate downloads for each document
DELIMITER ;

-- Document 1 downloads (45 total)
INSERT INTO downloads (cer_id, user_id, ip_address, user_agent, downloaded_at)
SELECT 
    1 as cer_id,
    CASE WHEN RAND() > 0.3 THEN FLOOR(6 + RAND() * 5) ELSE NULL END as user_id,
    random_ip() as ip_address,
    random_user_agent() as user_agent,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 30) DAY) as downloaded_at
FROM 
    (SELECT 1 as n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) a,
    (SELECT 1 as n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) b,
    (SELECT 1 as n UNION SELECT 2) c
LIMIT 45;

-- Document 2 downloads (78 total)
INSERT INTO downloads (cer_id, user_id, ip_address, user_agent, downloaded_at)
SELECT 
    2 as cer_id,
    CASE WHEN RAND() > 0.3 THEN FLOOR(6 + RAND() * 5) ELSE NULL END as user_id,
    random_ip() as ip_address,
    random_user_agent() as user_agent,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 25) DAY) as downloaded_at
FROM 
    (SELECT 1 as n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) a,
    (SELECT 1 as n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) b,
    (SELECT 1 as n UNION SELECT 2 UNION SELECT 3) c
LIMIT 78;

-- Document 3 downloads (62 total)
INSERT INTO downloads (cer_id, user_id, ip_address, user_agent, downloaded_at)
SELECT 
    3 as cer_id,
    CASE WHEN RAND() > 0.3 THEN FLOOR(6 + RAND() * 5) ELSE NULL END as user_id,
    random_ip() as ip_address,
    random_user_agent() as user_agent,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 20) DAY) as downloaded_at
FROM 
    (SELECT 1 as n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) a,
    (SELECT 1 as n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4) b,
    (SELECT 1 as n UNION SELECT 2 UNION SELECT 3) c
LIMIT 62;

-- Document 4 downloads (51 total)
INSERT INTO downloads (cer_id, user_id, ip_address, user_agent, downloaded_at)
SELECT 
    4 as cer_id,
    CASE WHEN RAND() > 0.3 THEN FLOOR(6 + RAND() * 5) ELSE NULL END as user_id,
    random_ip() as ip_address,
    random_user_agent() as user_agent,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 15) DAY) as downloaded_at
FROM 
    (SELECT 1 as n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4) a,
    (SELECT 1 as n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4) b,
    (SELECT 1 as n UNION SELECT 2) c
LIMIT 51;

-- Document 5 downloads (89 total)
INSERT INTO downloads (cer_id, user_id, ip_address, user_agent, downloaded_at)
SELECT 
    5 as cer_id,
    CASE WHEN RAND() > 0.3 THEN FLOOR(6 + RAND() * 5) ELSE NULL END as user_id,
    random_ip() as ip_address,
    random_user_agent() as user_agent,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 10) DAY) as downloaded_at
FROM 
    (SELECT 1 as n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) a,
    (SELECT 1 as n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) b,
    (SELECT 1 as n UNION SELECT 2 UNION SELECT 3) c
LIMIT 89;

-- Clean up temporary functions
DROP FUNCTION IF EXISTS random_ip;
DROP FUNCTION IF EXISTS random_user_agent;

-- ============================================
-- UPDATE COUNTERS
-- ============================================
-- Update comment counts
UPDATE cers c
SET comment_count = (
    SELECT COUNT(*) 
    FROM comments 
    WHERE cer_id = c.cer_id AND is_approved = TRUE
);

-- Update rating counts and averages
UPDATE cers c
JOIN (
    SELECT 
        cer_id, 
        COUNT(*) as count,
        AVG(rating) as avg_rating
    FROM ratings
    GROUP BY cer_id
) r ON c.cer_id = r.cer_id
SET 
    c.rating_count = r.count,
    c.average_rating = ROUND(r.avg_rating, 2);

-- ============================================
-- TEST DATA LOADED SUCCESSFULLY
-- ============================================
SELECT 'Test data loaded successfully!' as message;

-- ============================================
-- SAMPLE QUERIES TO VERIFY DATA
-- ============================================
-- List all documents with their authors and categories
SELECT 
    c.cer_id,
    c.title,
    CONCAT(u.first_name, ' ', u.last_name) as author,
    cat.name as category,
    c.views_count,
    c.downloads_count,
    c.average_rating,
    c.comment_count
FROM 
    cers c
    JOIN users u ON c.author_id = u.user_id
    JOIN categories cat ON c.category_id = cat.category_id
ORDER BY 
    c.created_at DESC;

-- List most popular tags
SELECT 
    t.name as tag,
    t.usage_count,
    COUNT(ct.cer_id) as document_count
FROM 
    tags t
    LEFT JOIN cer_tags ct ON t.tag_id = ct.tag_id
GROUP BY 
    t.tag_id
ORDER BY 
    t.usage_count DESC;

-- List recent comments
SELECT 
    c.comment_id,
    cer.title as document,
    CONCAT(u.first_name, ' ', u.last_name) as user,
    c.content,
    c.created_at
FROM 
    comments c
    JOIN cers cer ON c.cer_id = cer.cer_id
    JOIN users u ON c.user_id = u.user_id
WHERE 
    c.is_approved = TRUE
ORDER BY 
    c.created_at DESC
LIMIT 10;
