<?php

class TestDatabase {
    private static $instance = null;
    private $connection;
    
    private function __construct() {
        try {
            // Use SQLite in-memory database for testing with the correct database name
            $this->connection = new PDO('sqlite::memory:');
            // Set the database name in a way that matches your application's expectations
            $this->connection->exec("ATTACH DATABASE ':memory:' AS archiva");
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            
            // Create test tables
            $this->setupTestTables();
        } catch (PDOException $e) {
            throw new Exception("Test database connection failed: " . $e->getMessage());
        }
    }
    
    private function setupTestTables() {
        // Create users table
        $this->connection->exec("
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
        
        // Create other test tables as needed...
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
    
    public static function resetInstance() {
        self::$instance = null;
    }
}
