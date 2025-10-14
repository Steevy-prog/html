<?php
// Activation du rapport d'erreurs
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Configuration des en-têtes CORS
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-TOKEN");
header("Access-Control-Allow-Credentials: true");

// Configuration sécurisée des sessions
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 0); // Mettez à 1 en production avec HTTPS
ini_set('session.cookie_samesite', 'Lax');
session_set_cookie_params([
    'lifetime' => 3600,
    'path' => '/',
    'domain' => $_SERVER['HTTP_HOST'],
    'secure' => false, // Mettez à true en production avec HTTPS
    'httponly' => true,
    'samesite' => 'Lax'
]);
session_start();

// Gestion des requêtes OPTIONS pour CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Inclure les dépendances
require_once __DIR__ . '/../config/db_connect.php';
require_once __DIR__ . '/../utils/Security.php';

// Classe pour gérer les tokens CSRF
class CSRFToken {
    private static $tokenName = 'csrf_token';

    public static function generate() {
        if (empty($_SESSION[self::$tokenName])) {
            $_SESSION[self::$tokenName] = bin2hex(random_bytes(32));
        }
        return $_SESSION[self::$tokenName];
    }

    public static function verify($token) {
        if (empty($_SESSION[self::$tokenName]) || empty($token)) {
            return false;
        }
        return hash_equals($_SESSION[self::$tokenName], $token);
    }

    public static function getTokenName() {
        return self::$tokenName;
    }
}

// Vérification du token CSRF pour les méthodes non-GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    $headers = getallheaders();
    $token = $headers['X-CSRF-TOKEN'] ?? null;
    
    if (!CSRFToken::verify($token)) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Token CSRF invalide']);
        exit;
    }
}

// Routeur simple
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/backend/routes/api.php', '', $path);

try {
    // Gestion des routes
    switch ($path) {
        case '/auth/register':
            if ($method === 'POST') {
                $data = json_decode(file_get_contents('php://input'), true);
                $data = Security::cleanInput($data);
                
                // Validation des données
                if (empty($data['email']) || !Security::validateEmail($data['email'])) {
                    throw new Exception('Adresse email invalide');
                }
                if (empty($data['password']) || strlen($data['password']) < 8) {
                    throw new Exception('Le mot de passe doit contenir au moins 8 caractères');
                }
                
                // Ici, vous devriez ajouter la logique pour enregistrer l'utilisateur
                // Exemple avec PDO :
                $db = (new Database())->getConnection();
                $stmt = $db->prepare("INSERT INTO utilisateurs (email, password) VALUES (:email, :password)");
                $stmt->execute([
                    ':email' => $data['email'],
                    ':password' => password_hash($data['password'], PASSWORD_BCRYPT)
                ]);
                
                echo json_encode(['success' => true, 'message' => 'Utilisateur enregistré avec succès']);
            }
            break;
            
        case '/auth/login':
            if ($method === 'POST') {
                $data = json_decode(file_get_contents('php://input'), true);
                $data = Security::cleanInput($data);
                
                // Ici, vous devriez vérifier les identifiants
                $db = (new Database())->getConnection();
                $stmt = $db->prepare("SELECT * FROM utilisateurs WHERE email = :email LIMIT 1");
                $stmt->execute([':email' => $data['email']]);
                $user = $stmt->fetch();
                
                if ($user && password_verify($data['password'], $user['password'])) {
                    // Créer un token JWT (simplifié)
                    $token = bin2hex(random_bytes(32));
                    $_SESSION['user_id'] = $user['id'];
                    
                    echo json_encode([
                        'success' => true,
                        'token' => $token,
                        'user' => [
                            'id' => $user['id'],
                            'email' => $user['email']
                        ]
                    ]);
                } else {
                    throw new Exception('Identifiants invalides');
                }
            }
            break;
            
        case '/user/profile':
            if ($method === 'GET') {
                // Vérifier si l'utilisateur est connecté
                if (empty($_SESSION['user_id'])) {
                    http_response_code(401);
                    throw new Exception('Non autorisé');
                }
                
                // Récupérer le profil utilisateur
                $db = (new Database())->getConnection();
                $stmt = $db->prepare("SELECT id, email FROM utilisateurs WHERE id = :id");
                $stmt->execute([':id' => $_SESSION['user_id']]);
                $user = $stmt->fetch();
                
                if (!$user) {
                    throw new Exception('Utilisateur non trouvé');
                }
                
                echo json_encode(['success' => true, 'data' => $user]);
            }
            break;
            
        default:
            // Pour les requêtes GET, renvoyer un nouveau token CSRF
            if ($method === 'GET') {
                echo json_encode([
                    'success' => true,
                    'csrf_token' => CSRFToken::generate()
                ]);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Route non trouvée']);
            }
    }
    
} catch (PDOException $e) {
    error_log("Erreur PDO: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur de base de données']);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => Security::escape($e->getMessage())
    ]);
}