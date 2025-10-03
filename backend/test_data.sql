-- Script pour créer des données de test pour Archiva
-- Exécutez ce script dans phpMyAdmin après avoir créé la base de données

-- Créer un utilisateur de test
INSERT INTO users (username, email, password_hash, first_name, last_name, role, institution, country, is_active, created_at) 
VALUES 
('testuser', 'test@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test', 'User', 'student', 'CESI', 'France', TRUE, NOW()),
('admin', 'admin@archiva.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'Archiva', 'admin', 'CESI', 'France', TRUE, NOW()),
('marie', 'marie@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Marie', 'Dubois', 'teacher', 'CESI', 'France', TRUE, NOW());

-- Note: Le mot de passe pour tous ces comptes est "password"

-- Créer des catégories
INSERT INTO categories (name, description, color_code, created_at) 
VALUES 
('Base de données', 'Systèmes de gestion de bases de données', '#3B82F6', NOW()),
('Programmation', 'Langages et paradigmes de programmation', '#10B981', NOW()),
('Réseaux', 'Réseaux informatiques et protocoles', '#F59E0B', NOW()),
('Sécurité', 'Cybersécurité et protection des données', '#EF4444', NOW()),
('Web', 'Développement web et technologies', '#8B5CF6', NOW());

-- Créer des universités
INSERT INTO universities (name, country, city, website, is_active, created_at) 
VALUES 
('CESI', 'France', 'Paris', 'https://www.cesi.fr', TRUE, NOW()),
('Université Paris-Saclay', 'France', 'Saclay', 'https://www.universite-paris-saclay.fr', TRUE, NOW()),
('EPITA', 'France', 'Paris', 'https://www.epita.fr', TRUE, NOW());

-- Créer des CERs de test
INSERT INTO cers (title, description, category_id, university_id, author_id, status, language, keywords, views_count, downloads_count, is_public, created_at, updated_at) 
VALUES 
(
    'Prosit 3.2 - Base de données relationnelles',
    'Introduction aux systèmes de gestion de base de données relationnelles, conception de schémas, requêtes SQL avancées, optimisation des performances et sécurité des données.',
    1, 1, 3, 'published', 'fr',
    'SQL, MySQL, PostgreSQL, Base de données',
    156, 45, TRUE, NOW(), NOW()
),
(
    'Prosit 4.1 - Programmation orientée objet',
    'Concepts avancés de programmation orientée objet, design patterns, gestion de mémoire et bonnes pratiques de développement logiciel.',
    2, 1, 3, 'published', 'fr',
    'POO, Java, Python, Design Patterns',
    234, 67, TRUE, NOW(), NOW()
),
(
    'Prosit 5.3 - Analyse de données avec Python',
    'Techniques modernes d\'analyse de données, visualisation avec des outils interactifs et applications dans le domaine du big data et de l\'intelligence artificielle.',
    2, 1, 3, 'published', 'fr',
    'Python, Data Science, Machine Learning, Pandas',
    189, 52, TRUE, NOW(), NOW()
),
(
    'Prosit 2.1 - Réseaux TCP/IP',
    'Étude approfondie des protocoles TCP/IP, architecture réseau, routage et configuration des équipements réseau.',
    3, 1, 1, 'published', 'fr',
    'TCP/IP, Réseaux, Routage, Cisco',
    98, 34, TRUE, NOW(), NOW()
),
(
    'Prosit 6.2 - Sécurité des applications web',
    'Vulnérabilités courantes des applications web (OWASP Top 10), techniques de protection et bonnes pratiques de sécurité.',
    4, 1, 1, 'published', 'fr',
    'Sécurité, OWASP, XSS, SQL Injection',
    145, 41, TRUE, NOW(), NOW()
),
(
    'Prosit 3.5 - Développement React moderne',
    'Création d\'applications web modernes avec React, hooks, context API, et intégration avec des APIs REST.',
    5, 1, 2, 'published', 'fr',
    'React, JavaScript, TypeScript, Frontend',
    267, 78, TRUE, NOW(), NOW()
);

-- Créer des tags
INSERT INTO tags (name, usage_count, created_at) 
VALUES 
('SQL', 3, NOW()),
('Python', 2, NOW()),
('JavaScript', 1, NOW()),
('Sécurité', 1, NOW()),
('Réseaux', 1, NOW()),
('Web', 2, NOW()),
('POO', 1, NOW()),
('Data Science', 1, NOW());

-- Associer des tags aux CERs
INSERT INTO cer_tags (cer_id, tag_id) 
VALUES 
(1, 1), (1, 6),
(2, 7), (2, 2),
(3, 2), (3, 8),
(4, 5),
(5, 4), (5, 6),
(6, 3), (6, 6);

-- Créer quelques commentaires
INSERT INTO comments (cer_id, user_id, content, is_approved, created_at) 
VALUES 
(1, 1, 'Excellent CER ! Les explications sont claires et les exemples très pertinents.', TRUE, NOW()),
(1, 2, 'Très utile pour comprendre les bases de données. Merci pour ce partage !', TRUE, NOW()),
(2, 1, 'Les design patterns sont bien expliqués avec des exemples concrets.', TRUE, NOW()),
(3, 2, 'Super ressource pour débuter en data science avec Python !', TRUE, NOW());

-- Créer des évaluations
INSERT INTO ratings (cer_id, user_id, rating, review, created_at) 
VALUES 
(1, 1, 5, 'Parfait pour réviser les concepts de base de données !', NOW()),
(1, 2, 4, 'Très bon contenu, quelques points pourraient être approfondis.', NOW()),
(2, 1, 5, 'Excellente explication des design patterns.', NOW()),
(3, 2, 5, 'Indispensable pour la data science !', NOW()),
(4, 1, 4, 'Bon aperçu des réseaux TCP/IP.', NOW()),
(5, 2, 5, 'Très complet sur la sécurité web.', NOW()),
(6, 1, 5, 'Le meilleur tutoriel React que j\'ai trouvé !', NOW());

-- Créer quelques favoris
INSERT INTO favorites (user_id, cer_id, notes, created_at) 
VALUES 
(1, 1, 'À relire avant l\'examen', NOW()),
(1, 3, 'Excellent pour le projet de data science', NOW()),
(2, 6, 'Référence pour React', NOW());

-- Créer des notifications de test
INSERT INTO notifications (user_id, type, title, message, link, is_read, created_at) 
VALUES 
(1, 'comment', 'Nouveau commentaire', 'Quelqu\'un a commenté votre CER "Prosit 2.1"', '/cers/4', FALSE, NOW()),
(1, 'rating', 'Nouvelle évaluation', 'Votre CER a reçu une note de 5 étoiles !', '/cers/4', FALSE, NOW()),
(2, 'system', 'Bienvenue !', 'Bienvenue sur Archiva ! Explorez les CERs disponibles.', '/acceuil', TRUE, NOW());

-- Mettre à jour les moyennes des ratings dans la table cers
UPDATE cers c
SET average_rating = (
    SELECT AVG(rating) 
    FROM ratings r 
    WHERE r.cer_id = c.cer_id
),
rating_count = (
    SELECT COUNT(*) 
    FROM ratings r 
    WHERE r.cer_id = c.cer_id
);

-- Mettre à jour le compteur de favoris
UPDATE cers c
SET favorite_count = (
    SELECT COUNT(*) 
    FROM favorites f 
    WHERE f.cer_id = c.cer_id
);
