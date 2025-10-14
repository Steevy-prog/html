<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Define test hosts to try
$hosts = ['127.0.0.1', 'localhost'];

// Include the database configuration
require_once __DIR__ . '/backend/config/db_connect.php';

// Override the DB_HOST constant for testing
foreach ($hosts as $host) {
    echo "\nTrying to connect to host: $host\n";
    
    try {

        // Override the host for this test
        $dsn = "mysql:host=$host;port=3306;dbname=" . DB_NAME . ";charset=" . DB_CHARSET . ";";
        echo "DSN: $dsn\n";
        
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
        ];
        
        // Try direct PDO connection
        $conn = new PDO($dsn, DB_USER, DB_PASS, $options);
    
    // Test query
    $stmt = $conn->query('SELECT 1 as test');
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
        echo "✅ Successfully connected to $host!\n";
        echo "Test query result: " . $result['test'] . "\n";
        exit(0);
        
    } catch (Exception $e) {
        echo "❌ Connection to $host failed: " . $e->getMessage() . "\n";
        continue;
    }
}

echo "\n❌ All connection attempts failed. Please check your MySQL/MariaDB server.\n";

// If we get here, all connection attempts failed
echo "\nAdditional debug info:\n";
echo "DB_HOST: " . (defined('DB_HOST') ? DB_HOST : 'not defined') . "\n";
echo "DB_NAME: " . (defined('DB_NAME') ? DB_NAME : 'not defined') . "\n";
echo "DB_USER: " . (defined('DB_USER') ? DB_USER : 'not defined') . "\n";
echo "DB_PASS: " . (defined('DB_PASS') ? '***' : 'not defined') . "\n";
echo "DB_PORT: " . (defined('DB_PORT') ? DB_PORT : 'not defined') . "\n";

// Check if MySQL service is running
echo "\nChecking MySQL service status...\n";
system('sc query mysql');

echo "\nChecking network connections...\n";
system('netstat -ano | findstr 3306');

echo "\nAvailable PDO drivers: " . implode(', ', PDO::getAvailableDrivers()) . "\n";

echo "\nTroubleshooting steps:\n";
echo "1. Make sure MySQL/MariaDB service is running\n";
echo "2. Check if MySQL is configured to accept connections on 127.0.0.1 or localhost\n";
echo "3. Verify your MySQL user has the correct host permissions (try 'user'@'%' or 'user'@'localhost')\n";
echo "4. Check your MySQL configuration file (my.ini or my.cnf) for bind-address settings\n";
