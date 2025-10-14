<?php
// tests/bootstrap.php

// Define test environment constant if not already defined
if (!defined('TEST_MODE')) {
    define('TEST_MODE', true);
}

// Set up autoloading
require_once __DIR__ . '/../vendor/autoload.php';

// Set up error reporting
error_reporting(E_ALL);
ini_set('display_errors', '1');

// Set up CLI environment
if (php_sapi_name() === 'cli') {
    $_SERVER['REQUEST_METHOD'] = 'CLI';
    $_SERVER['HTTP_ACCEPT'] = 'application/json';
    $_SERVER['CONTENT_TYPE'] = 'application/json';
}

// Set up test database connection
if (!function_exists('getDB')) {
    function getDB(): PDO
    {
        static $db = null;
        
        if ($db === null) {
            try {
                $db = new PDO('sqlite::memory:');
                $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $db->exec('PRAGMA foreign_keys = ON;');
                
                // Create test tables
                $db->exec("
                    CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        username VARCHAR(50) UNIQUE NOT NULL,
                        email VARCHAR(100) UNIQUE NOT NULL,
                        password VARCHAR(255) NOT NULL,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                ");
                
            } catch (PDOException $e) {
                throw new Exception("Test database connection failed: " . $e->getMessage());
            }
        }
        
        return $db;
    }
}

// Set up any other test environment configurations
error_reporting(E_ALL);
ini_set('display_errors', '1');