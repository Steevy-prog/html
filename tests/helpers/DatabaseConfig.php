<?php

// Override database configuration for testing
putenv('DB_CONNECTION=sqlite');
putenv('DB_DATABASE=:memory:');
putenv('DB_HOST=127.0.0.1');
putenv('DB_PORT=3306');
putenv('DB_USERNAME=');
putenv('DB_PASSWORD=');

// Ensure the database name is always 'archiva' in tests
if (!function_exists('getDB')) {
    function getDB() {
        static $db = null;
        
        if ($db === null) {
            try {
                $db = new PDO('sqlite::memory:');
                $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $db->exec("ATTACH DATABASE ':memory:' AS archiva");
                
                // Create test tables
                $db->exec("
                    CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        username VARCHAR(50) UNIQUE NOT NULL,
                        email VARCHAR(100) UNIQUE NOT NULL,
                        password VARCHAR(255) NOT NULL,
                        full_name VARCHAR(100),
                        is_active INTEGER DEFAULT 1,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                ");
                
            } catch (PDOException $e) {
                die("Test database connection failed: " . $e->getMessage());
            }
        }
        
        return $db;
    }
}
