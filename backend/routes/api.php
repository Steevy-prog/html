<?php
require_once __DIR__ . '/../config/db_connect.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Cer.php';

// Démarrer la session
session_start();

// Récupérer la méthode HTTP et le chemin
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/backend/routes/api.php', '', $path);

// Router simple
try {
    // Routes d'authentification
    if ($path === '/auth/login' && $method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (empty($data['email']) || empty($data['password'])) {
            jsonError('Email et mot de passe requis', 400);
        }
        
        $userModel = new User();
        $result = $userModel->login($data['email'], $data['password']);
        
        if ($result['success']) {
            $_SESSION['user_id'] = $result['user']['user_id'];
            $_SESSION['user'] = $result['user'];
            jsonSuccess('Connexion réussie', $result['user']);
        } else {
            jsonError($result['message'], 401);
        }
    }
    
    elseif ($path === '/auth/register' && $method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validation des champs requis
        $required = ['username', 'email', 'password', 'first_name', 'last_name'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                jsonError("Le champ {$field} est requis", 400);
            }
        }
        
        $userModel = new User();
        try {
            $userId = $userModel->register($data);
            $user = $userModel->find($userId);
            unset($user['password_hash']);
            
            jsonSuccess('Inscription réussie', $user, 201);
        } catch (Exception $e) {
            jsonError($e->getMessage(), 400);
        }
    }
    
    elseif ($path === '/auth/logout' && $method === 'POST') {
        session_destroy();
        jsonSuccess('Déconnexion réussie');
    }
    
    elseif ($path === '/auth/me' && $method === 'GET') {
        if (!isset($_SESSION['user_id'])) {
            jsonError('Non authentifié', 401);
        }
        
        $userModel = new User();
        $user = $userModel->find($_SESSION['user_id']);
        unset($user['password_hash']);
        
        jsonSuccess('Utilisateur connecté', $user);
    }
    
    // Routes CERs
    elseif ($path === '/cers' && $method === 'GET') {
        $cerModel = new Cer();
        
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
        
        $filters = [
            'status' => $_GET['status'] ?? 'published',
            'category_id' => $_GET['category_id'] ?? null,
            'search' => $_GET['search'] ?? null
        ];
        
        $cers = $cerModel->getAllComplete($limit, $offset, $filters);
        jsonSuccess('Liste des CERs', $cers);
    }
    
    elseif (preg_match('/^\/cers\/(\d+)$/', $path, $matches) && $method === 'GET') {
        $cerId = $matches[1];
        $cerModel = new Cer();
        
        $cer = $cerModel->getComplete($cerId);
        
        if (!$cer) {
            jsonError('CER non trouvé', 404);
        }
        
        // Incrémenter les vues
        $cerModel->incrementViews($cerId);
        
        jsonSuccess('Détails du CER', $cer);
    }
    
    elseif ($path === '/cers' && $method === 'POST') {
        if (!isset($_SESSION['user_id'])) {
            jsonError('Non authentifié', 401);
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        $data['author_id'] = $_SESSION['user_id'];
        
        $cerModel = new Cer();
        try {
            $cerId = $cerModel->create($data);
            
            // Ajouter les tags si fournis
            if (!empty($data['tags'])) {
                $cerModel->addTags($cerId, $data['tags']);
            }
            
            $cer = $cerModel->getComplete($cerId);
            jsonSuccess('CER créé avec succès', $cer, 201);
        } catch (Exception $e) {
            jsonError('Erreur lors de la création', 400, $e->getMessage());
        }
    }
    
    elseif (preg_match('/^\/cers\/(\d+)$/', $path, $matches) && $method === 'PUT') {
        if (!isset($_SESSION['user_id'])) {
            jsonError('Non authentifié', 401);
        }
        
        $cerId = $matches[1];
        $data = json_decode(file_get_contents('php://input'), true);
        
        $cerModel = new Cer();
        $cer = $cerModel->find($cerId);
        
        if (!$cer) {
            jsonError('CER non trouvé', 404);
        }
        
        // Vérifier que l'utilisateur est l'auteur ou admin
        if ($cer['author_id'] != $_SESSION['user_id'] && $_SESSION['user']['role'] != 'admin') {
            jsonError('Non autorisé', 403);
        }
        
        try {
            $cerModel->update($cerId, $data);
            $updatedCer = $cerModel->getComplete($cerId);
            jsonSuccess('CER mis à jour', $updatedCer);
        } catch (Exception $e) {
            jsonError('Erreur lors de la mise à jour', 400);
        }
    }
    
    elseif (preg_match('/^\/cers\/(\d+)$/', $path, $matches) && $method === 'DELETE') {
        if (!isset($_SESSION['user_id'])) {
            jsonError('Non authentifié', 401);
        }
        
        $cerId = $matches[1];
        $cerModel = new Cer();
        $cer = $cerModel->find($cerId);
        
        if (!$cer) {
            jsonError('CER non trouvé', 404);
        }
        
        if ($cer['author_id'] != $_SESSION['user_id'] && $_SESSION['user']['role'] != 'admin') {
            jsonError('Non autorisé', 403);
        }
        
        try {
            $cerModel->delete($cerId);
            jsonSuccess('CER supprimé');
        } catch (Exception $e) {
            jsonError('Erreur lors de la suppression', 400);
        }
    }
    
    // Route de recherche
    elseif ($path === '/cers/search' && $method === 'GET') {
        $query = $_GET['q'] ?? '';
        
        if (empty($query)) {
            jsonError('Paramètre de recherche requis', 400);
        }
        
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
        
        $cerModel = new Cer();
        $results = $cerModel->search($query, $limit, $offset);
        
        jsonSuccess('Résultats de recherche', $results);
    }
    
    // Routes Favoris
    elseif ($path === '/favorites' && $method === 'GET') {
        if (!isset($_SESSION['user_id'])) {
            jsonError('Non authentifié', 401);
        }
        
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
        
        $userModel = new User();
        $favorites = $userModel->getFavorites($_SESSION['user_id'], $limit, $offset);
        
        jsonSuccess('Liste des favoris', $favorites);
    }
    
    elseif ($path === '/favorites' && $method === 'POST') {
        if (!isset($_SESSION['user_id'])) {
            jsonError('Non authentifié', 401);
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (empty($data['cer_id'])) {
            jsonError('ID du CER requis', 400);
        }
        
        $userModel = new User();
        $success = $userModel->addFavorite(
            $_SESSION['user_id'], 
            $data['cer_id'], 
            $data['notes'] ?? null
        );
        
        if ($success) {
            jsonSuccess('Ajouté aux favoris');
        } else {
            jsonError('Erreur lors de l\'ajout', 400);
        }
    }
    
    elseif (preg_match('/^\/favorites\/(\d+)$/', $path, $matches) && $method === 'DELETE') {
        if (!isset($_SESSION['user_id'])) {
            jsonError('Non authentifié', 401);
        }
        
        $cerId = $matches[1];
        $userModel = new User();
        
        $success = $userModel->removeFavorite($_SESSION['user_id'], $cerId);
        
        if ($success) {
            jsonSuccess('Retiré des favoris');
        } else {
            jsonError('Erreur lors de la suppression', 400);
        }
    }
    
    elseif (preg_match('/^\/favorites\/check\/(\d+)$/', $path, $matches) && $method === 'GET') {
        if (!isset($_SESSION['user_id'])) {
            jsonError('Non authentifié', 401);
        }
        
        $cerId = $matches[1];
        $userModel = new User();
        
        $isFavorite = $userModel->isFavorite($_SESSION['user_id'], $cerId);
        
        jsonSuccess('Statut favori', ['is_favorite' => $isFavorite]);
    }
    
    // Routes Utilisateur
    elseif ($path === '/users/me/cers' && $method === 'GET') {
        if (!isset($_SESSION['user_id'])) {
            jsonError('Non authentifié', 401);
        }
        
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
        
        $cerModel = new Cer();
        $cers = $cerModel->getByUser($_SESSION['user_id'], $limit, $offset);
        
        jsonSuccess('Mes CERs', $cers);
    }
    
    elseif ($path === '/users/me/preferences' && $method === 'GET') {
        if (!isset($_SESSION['user_id'])) {
            jsonError('Non authentifié', 401);
        }
        
        $userModel = new User();
        $preferences = $userModel->getPreferences($_SESSION['user_id']);
        
        jsonSuccess('Préférences utilisateur', $preferences);
    }
    
    elseif ($path === '/users/me/preferences' && $method === 'PUT') {
        if (!isset($_SESSION['user_id'])) {
            jsonError('Non authentifié', 401);
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        $userModel = new User();
        
        $success = $userModel->updatePreferences($_SESSION['user_id'], $data);
        
        if ($success) {
            jsonSuccess('Préférences mises à jour');
        } else {
            jsonError('Erreur lors de la mise à jour', 400);
        }
    }
    
    // Routes des catégories
    elseif ($path === '/categories' && $method === 'GET') {
        $db = getDB();
        $stmt = $db->query("SELECT * FROM categories ORDER BY name");
        $categories = $stmt->fetchAll();
        
        jsonSuccess('Liste des catégories', $categories);
    }
    
    // Routes des tags
    elseif ($path === '/tags' && $method === 'GET') {
        $db = getDB();
        $stmt = $db->query("SELECT * FROM tags ORDER BY usage_count DESC, name");
        $tags = $stmt->fetchAll();
        
        jsonSuccess('Liste des tags', $tags);
    }
    
    // Routes des universités
    elseif ($path === '/universities' && $method === 'GET') {
        $db = getDB();
        $stmt = $db->query("SELECT * FROM universities WHERE is_active = TRUE ORDER BY name");
        $universities = $stmt->fetchAll();
        
        jsonSuccess('Liste des universités', $universities);
    }
    
    // Routes des notifications
    elseif ($path === '/notifications' && $method === 'GET') {
        if (!isset($_SESSION['user_id'])) {
            jsonError('Non authentifié', 401);
        }
        
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
        $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
        $unreadOnly = isset($_GET['unread_only']) && $_GET['unread_only'] === 'true';
        
        $db = getDB();
        $query = "SELECT * FROM notifications WHERE user_id = :user_id";
        
        if ($unreadOnly) {
            $query .= " AND is_read = FALSE";
        }
        
        $query .= " ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        
        $stmt = $db->prepare($query);
        $stmt->bindValue(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        
        $notifications = $stmt->fetchAll();
        
        // Compter le nombre de notifications non lues
        $countStmt = $db->prepare("SELECT COUNT(*) as count FROM notifications WHERE user_id = :user_id AND is_read = FALSE");
        $countStmt->execute([':user_id' => $_SESSION['user_id']]);
        $unreadCount = $countStmt->fetch()['count'];
        
        jsonSuccess('Notifications', [
            'notifications' => $notifications,
            'unread_count' => $unreadCount
        ]);
    }
    
    elseif (preg_match('/^\/notifications\/(\d+)\/read$/', $path, $matches) && $method === 'PUT') {
        if (!isset($_SESSION['user_id'])) {
            jsonError('Non authentifié', 401);
        }
        
        $notificationId = $matches[1];
        $db = getDB();
        
        // Vérifier que la notification appartient à l'utilisateur
        $stmt = $db->prepare("SELECT * FROM notifications WHERE notification_id = :id AND user_id = :user_id");
        $stmt->execute([
            ':id' => $notificationId,
            ':user_id' => $_SESSION['user_id']
        ]);
        
        $notification = $stmt->fetch();
        
        if (!$notification) {
            jsonError('Notification non trouvée', 404);
        }
        
        // Marquer comme lue
        $updateStmt = $db->prepare("UPDATE notifications SET is_read = TRUE WHERE notification_id = :id");
        $updateStmt->execute([':id' => $notificationId]);
        
        jsonSuccess('Notification marquée comme lue');
    }
    
    elseif ($path === '/notifications/read-all' && $method === 'PUT') {
        if (!isset($_SESSION['user_id'])) {
            jsonError('Non authentifié', 401);
        }
        
        $db = getDB();
        $stmt = $db->prepare("UPDATE notifications SET is_read = TRUE WHERE user_id = :user_id AND is_read = FALSE");
        $stmt->execute([':user_id' => $_SESSION['user_id']]);
        
        jsonSuccess('Toutes les notifications marquées comme lues');
    }
    
    elseif (preg_match('/^\/notifications\/(\d+)$/', $path, $matches) && $method === 'DELETE') {
        if (!isset($_SESSION['user_id'])) {
            jsonError('Non authentifié', 401);
        }
        
        $notificationId = $matches[1];
        $db = getDB();
        
        // Vérifier que la notification appartient à l'utilisateur
        $stmt = $db->prepare("SELECT * FROM notifications WHERE notification_id = :id AND user_id = :user_id");
        $stmt->execute([
            ':id' => $notificationId,
            ':user_id' => $_SESSION['user_id']
        ]);
        
        $notification = $stmt->fetch();
        
        if (!$notification) {
            jsonError('Notification non trouvée', 404);
        }
        
        // Supprimer la notification
        $deleteStmt = $db->prepare("DELETE FROM notifications WHERE notification_id = :id");
        $deleteStmt->execute([':id' => $notificationId]);
        
        jsonSuccess('Notification supprimée');
    }
    
    // Routes des commentaires
    elseif (preg_match('/^\/cers\/(\d+)\/comments$/', $path, $matches) && $method === 'GET') {
        $cerId = $matches[1];
        $db = getDB();
        
        $query = "SELECT c.*, u.username, u.first_name, u.last_name, u.profile_picture
                  FROM comments c
                  JOIN users u ON c.user_id = u.user_id
                  WHERE c.cer_id = :cer_id AND c.is_approved = TRUE
                  ORDER BY c.created_at DESC";
        
        $stmt = $db->prepare($query);
        $stmt->execute([':cer_id' => $cerId]);
        $comments = $stmt->fetchAll();
        
        jsonSuccess('Commentaires', $comments);
    }
    
    elseif (preg_match('/^\/cers\/(\d+)\/comments$/', $path, $matches) && $method === 'POST') {
        if (!isset($_SESSION['user_id'])) {
            jsonError('Non authentifié', 401);
        }
        
        $cerId = $matches[1];
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (empty($data['content'])) {
            jsonError('Le contenu du commentaire est requis', 400);
        }
        
        $db = getDB();
        
        $stmt = $db->prepare("INSERT INTO comments (cer_id, user_id, content, is_approved, created_at) 
                             VALUES (:cer_id, :user_id, :content, TRUE, NOW())");
        $stmt->execute([
            ':cer_id' => $cerId,
            ':user_id' => $_SESSION['user_id'],
            ':content' => $data['content']
        ]);
        
        $commentId = $db->lastInsertId();
        
        // Récupérer le commentaire créé avec les infos utilisateur
        $getStmt = $db->prepare("SELECT c.*, u.username, u.first_name, u.last_name 
                                 FROM comments c 
                                 JOIN users u ON c.user_id = u.user_id 
                                 WHERE c.comment_id = :id");
        $getStmt->execute([':id' => $commentId]);
        $comment = $getStmt->fetch();
        
        jsonSuccess('Commentaire ajouté', $comment, 201);
    }
    
    elseif (preg_match('/^\/comments\/(\d+)$/', $path, $matches) && $method === 'DELETE') {
        if (!isset($_SESSION['user_id'])) {
            jsonError('Non authentifié', 401);
        }
        
        $commentId = $matches[1];
        $db = getDB();
        
        $stmt = $db->prepare("SELECT * FROM comments WHERE comment_id = :id");
        $stmt->execute([':id' => $commentId]);
        $comment = $stmt->fetch();
        
        if (!$comment) {
            jsonError('Commentaire non trouvé', 404);
        }
        
        if ($comment['user_id'] != $_SESSION['user_id'] && $_SESSION['user']['role'] != 'admin') {
            jsonError('Non autorisé', 403);
        }
        
        $deleteStmt = $db->prepare("DELETE FROM comments WHERE comment_id = :id");
        $deleteStmt->execute([':id' => $commentId]);
        
        jsonSuccess('Commentaire supprimé');
    }
    
    // Routes des évaluations
    elseif (preg_match('/^\/cers\/(\d+)\/ratings$/', $path, $matches) && $method === 'GET') {
        $cerId = $matches[1];
        $db = getDB();
        
        $query = "SELECT r.*, u.username, u.first_name, u.last_name
                  FROM ratings r
                  JOIN users u ON r.user_id = u.user_id
                  WHERE r.cer_id = :cer_id
                  ORDER BY r.created_at DESC";
        
        $stmt = $db->prepare($query);
        $stmt->execute([':cer_id' => $cerId]);
        $ratings = $stmt->fetchAll();
        
        // Calculer la moyenne
        $avgStmt = $db->prepare("SELECT AVG(rating) as average, COUNT(*) as count FROM ratings WHERE cer_id = :cer_id");
        $avgStmt->execute([':cer_id' => $cerId]);
        $stats = $avgStmt->fetch();
        
        jsonSuccess('Évaluations', [
            'ratings' => $ratings,
            'average' => $stats['average'] ? round($stats['average'], 2) : 0,
            'count' => $stats['count']
        ]);
    }
    
    elseif (preg_match('/^\/cers\/(\d+)\/ratings$/', $path, $matches) && $method === 'POST') {
        if (!isset($_SESSION['user_id'])) {
            jsonError('Non authentifié', 401);
        }
        
        $cerId = $matches[1];
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['rating']) || $data['rating'] < 1 || $data['rating'] > 5) {
            jsonError('Note invalide (doit être entre 1 et 5)', 400);
        }
        
        $db = getDB();
        
        // Vérifier si l'utilisateur a déjà noté ce CER
        $checkStmt = $db->prepare("SELECT * FROM ratings WHERE cer_id = :cer_id AND user_id = :user_id");
        $checkStmt->execute([
            ':cer_id' => $cerId,
            ':user_id' => $_SESSION['user_id']
        ]);
        
        if ($checkStmt->fetch()) {
            // Mettre à jour l'évaluation existante
            $updateStmt = $db->prepare("UPDATE ratings SET rating = :rating, review = :review, updated_at = NOW() 
                                       WHERE cer_id = :cer_id AND user_id = :user_id");
            $updateStmt->execute([
                ':rating' => $data['rating'],
                ':review' => $data['review'] ?? null,
                ':cer_id' => $cerId,
                ':user_id' => $_SESSION['user_id']
            ]);
            
            jsonSuccess('Évaluation mise à jour');
        } else {
            // Créer une nouvelle évaluation
            $insertStmt = $db->prepare("INSERT INTO ratings (cer_id, user_id, rating, review, created_at) 
                                       VALUES (:cer_id, :user_id, :rating, :review, NOW())");
            $insertStmt->execute([
                ':cer_id' => $cerId,
                ':user_id' => $_SESSION['user_id'],
                ':rating' => $data['rating'],
                ':review' => $data['review'] ?? null
            ]);
            
            jsonSuccess('Évaluation ajoutée', null, 201);
        }
    }
    
    elseif (preg_match('/^\/ratings\/(\d+)$/', $path, $matches) && $method === 'DELETE') {
        if (!isset($_SESSION['user_id'])) {
            jsonError('Non authentifié', 401);
        }
        
        $ratingId = $matches[1];
        $db = getDB();
        
        $stmt = $db->prepare("SELECT * FROM ratings WHERE rating_id = :id");
        $stmt->execute([':id' => $ratingId]);
        $rating = $stmt->fetch();
        
        if (!$rating) {
            jsonError('Évaluation non trouvée', 404);
        }
        
        if ($rating['user_id'] != $_SESSION['user_id']) {
            jsonError('Non autorisé', 403);
        }
        
        $deleteStmt = $db->prepare("DELETE FROM ratings WHERE rating_id = :id");
        $deleteStmt->execute([':id' => $ratingId]);
        
        jsonSuccess('Évaluation supprimée');
    }
    
    // Route non trouvée
    else {
        jsonError('Route non trouvée', 404);
    }
    
} catch (Exception $e) {
    error_log("API Error: " . $e->getMessage());
    jsonError('Erreur serveur', 500, $e->getMessage());
}