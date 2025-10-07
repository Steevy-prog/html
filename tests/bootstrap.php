<?php
/**
 * PHPUnit Bootstrap File
 * Configuration et initialisation pour les tests
 */

// Autoloader Composer
require_once __DIR__ . '/../vendor/autoload.php';

// Définir l'environnement de test
define('TESTING', true);

// Configuration de la base de données de test
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'Archiva_test');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_CHARSET', 'utf8mb4');

// Note: Cannot override built-in PHP functions like header() and http_response_code()
// For testing, use output buffering or PHPUnit's runInSeparateProcess annotation
// to prevent "headers already sent" errors

// Classe Database de test avec possibilité de mock
class TestDatabase {
    private static $instance = null;
    private $connection;
    private static $mockConnection = null;
    
    public static function setMockConnection($mock) {
        self::$mockConnection = $mock;
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        if (self::$mockConnection !== null) {
            $this->connection = self::$mockConnection;
            return;
        }
        
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            
            $this->connection = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            error_log("Test Database Connection Error: " . $e->getMessage());
            throw $e;
        }
    }
    
    public function getConnection() {
        return $this->connection;
    }
    
    public static function reset() {
        self::$instance = null;
        self::$mockConnection = null;
    }
}

// Test-specific database function to avoid conflicts with main application
if (!function_exists('getTestDB')) {
    function getTestDB() {
        return TestDatabase::getInstance()->getConnection();
    }
}
