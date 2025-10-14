<?php
/**
 * Configuration de la connexion à la base de données Archiva
 */

// Configuration de la base de données
define('DB_HOST', 'localhost');
define('DB_NAME', 'rchiva');
define('DB_USER', 'root'); // Par défaut sur XAMPP
define('DB_PASS', ''); // Mot de passe personnalisé
define('DB_CHARSET', 'utf8mb4');

// Only send headers if not in CLI mode and headers not already sent
if (php_sapi_name() !== 'cli' && !headers_sent()) {
    // Configuration CORS pour React
    header('Access-Control-Allow-Origin: *'); // Port par défaut de Vite
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');
    header('Content-Type: application/json; charset=utf-8');

    // Gérer les requêtes OPTIONS (preflight)
    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

class Database {
    private static $instance = null;
    private $connection;
    
    private function __construct() {
        try {
            // Force using MariaDB driver and add debug info
            error_log('DB Connection attempt - Host: ' . DB_HOST . ', DB: ' . DB_NAME . ', User: ' . DB_USER);
            $dsn = "mysql:host=127.0.0.1;port=3306;dbname=" . DB_NAME . ";charset=" . DB_CHARSET . ";";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
                PDO::ATTR_TIMEOUT => 5, // Add timeout
                PDO::ATTR_PERSISTENT => false // Don't use persistent connections
            ];
            
            error_log('DSN: ' . $dsn);
            
            $this->connection = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            error_log("Erreur de connexion à la base de données: " . $e->getMessage());
            http_response_code(500);
            die(json_encode([
                'success' => false,
                'message' => 'Erreur de connexion à la base de données',
                'error' => $e->getMessage()
            ]));
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
    
    // Empêcher le clonage de l'instance
    private function __clone() {}
    
    // Empêcher la désérialisation
    public function __wakeup() {
        throw new Exception("Cannot unserialize singleton");
    }
}

// Fonction utilitaire pour obtenir la connexion

// Fonction pour gérer les erreurs JSON
function jsonError($message, $code = 400, $data = null) {
    http_response_code($code);
    echo json_encode([
        'success' => false,
        'message' => $message,
        'data' => $data
    ]);
    exit();
}

// Fonction pour gérer les succès JSON
function jsonSuccess($message, $data = null, $code = 200) {
    http_response_code($code);
    echo json_encode([
        'success' => true,
        'message' => $message,
        'data' => $data
    ]);
    exit();
}