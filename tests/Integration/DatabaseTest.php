<?php

namespace Tests\Integration;

use PHPUnit\Framework\TestCase;

/**
 * Tests d'intégration pour la base de données
 * Ces tests nécessitent une base de données de test configurée
 */
class DatabaseTest extends TestCase {
    private $db;
    
    protected function setUp(): void {
        parent::setUp();
        
        try {
            // Connexion à la base de données de test
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $this->db = new \PDO($dsn, DB_USER, DB_PASS, [
                \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
                \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
            ]);
        } catch (\PDOException $e) {
            $this->markTestSkipped('Base de données de test non disponible: ' . $e->getMessage());
        }
    }
    
    public function testDatabaseConnection() {
        $this->assertInstanceOf(\PDO::class, $this->db);
        $this->assertNotNull($this->db);
    }
    
    public function testDatabaseHasUsersTable() {
        $stmt = $this->db->query("SHOW TABLES LIKE 'users'");
        $result = $stmt->fetch();
        
        $this->assertNotEmpty($result, 'La table users devrait exister');
    }
    
    public function testDatabaseHasCersTable() {
        $stmt = $this->db->query("SHOW TABLES LIKE 'cers'");
        $result = $stmt->fetch();
        
        $this->assertNotEmpty($result, 'La table cers devrait exister');
    }
    
    public function testDatabaseHasFavoritesTable() {
        $stmt = $this->db->query("SHOW TABLES LIKE 'favorites'");
        $result = $stmt->fetch();
        
        $this->assertNotEmpty($result, 'La table favorites devrait exister');
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
