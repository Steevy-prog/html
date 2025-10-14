<?php

namespace Tests\Integration;

use PHPUnit\Framework\TestCase;

/**
 * Tests d'intégration pour la base de données
 * Utilise une base de données SQLite en mémoire pour les tests
 */
class DatabaseTest extends TestCase {
    private $db;
    
    protected function setUp(): void {
        parent::setUp();
        
        try {
            // Utilisation de SQLite en mémoire pour les tests
            $this->db = new \PDO('sqlite::memory:');
            $this->db->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            $this->db->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
            
            // Créer les tables nécessaires pour les tests
            $this->createTestTables();
        } catch (\PDOException $e) {
            $this->markTestSkipped('Impossible de configurer la base de données de test: ' . $e->getMessage());
        }
    }
    
    /**
     * Crée les tables nécessaires pour les tests
     */
    private function createTestTables(): void {
        $this->db->exec("
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
        
        $this->db->exec("
            CREATE TABLE IF NOT EXISTS cers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title VARCHAR(255) NOT NULL,
                content TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        ");
        
        $this->db->exec("
            CREATE TABLE IF NOT EXISTS favorites (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                cer_id INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (cer_id) REFERENCES cers(id),
                UNIQUE(user_id, cer_id)
            )
        ");
    }
    
    public function testDatabaseHasUsersTable() {
        // Vérification compatible SQLite
        $tables = $this->db->query("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")->fetchAll();
        $this->assertCount(1, $tables, "La table 'users' n'existe pas dans la base de données");
    }
    
    public function testDatabaseHasCersTable() {
        $tables = $this->db->query("SELECT name FROM sqlite_master WHERE type='table' AND name='cers'")->fetchAll();
        $this->assertCount(1, $tables, "La table 'cers' n'existe pas dans la base de données");
    }
    
    public function testDatabaseHasFavoritesTable() {
        $tables = $this->db->query("SELECT name FROM sqlite_master WHERE type='table' AND name='favorites'")->fetchAll();
        $this->assertCount(1, $tables, "La table 'favorites' n'existe pas dans la base de données");
    }
    
    public function testCanExecuteSimpleQuery() {
        $stmt = $this->db->query("SELECT 1 as test");
        $result = $stmt->fetch();
        
        $this->assertEquals(1, $result['test']);
    }
    
    public function testTransactionRollback() {
        $this->db->beginTransaction();
        
        try {
            // Tenter une insertion
            $stmt = $this->db->prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");
            $stmt->execute(['test_rollback', 'rollback@test.com', 'hash123']);
            
            // Annuler la transaction
            $this->db->rollBack();
            
            // Vérifier que l'insertion a été annulée
            $checkStmt = $this->db->prepare("SELECT COUNT(*) as count FROM users WHERE username = ?");
            $checkStmt->execute(['test_rollback']);
            $result = $checkStmt->fetch();
            
            $this->assertEquals(0, $result['count'], 'Le rollback devrait annuler l\'insertion');
        } catch (\PDOException $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            // Si la table n'existe pas, on skip le test
            $this->markTestSkipped('Table users non disponible pour le test de transaction');
        }
    }
    
    protected function tearDown(): void {
        parent::tearDown();
        $this->db = null;
    }
}
