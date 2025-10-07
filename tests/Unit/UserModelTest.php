<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../backend/models/User.php';

/**
 * Tests unitaires pour le modèle User
 */
class UserModelTest extends TestCase {
    private $user;
    private $mockDb;
    
    protected function setUp(): void {
        parent::setUp();
        
        // Créer un mock de la connexion PDO
        $this->mockDb = $this->createMock(\PDO::class);
        
        // Créer une instance de User avec le mock DB
        $this->user = new \User();
        
        // Utiliser la réflexion pour injecter le mock
        $reflection = new \ReflectionClass($this->user);
        $dbProperty = $reflection->getProperty('db');
        $dbProperty->setAccessible(true);
        $dbProperty->setValue($this->user, $this->mockDb);
    }
    
    public function testFindByEmailReturnsUser() {
        $stmt = $this->createMock(\PDOStatement::class);
        $stmt->expects($this->once())
             ->method('bindValue')
             ->with(':email', 'test@example.com');
        $stmt->expects($this->once())
             ->method('execute');
        $stmt->expects($this->once())
             ->method('fetch')
             ->willReturn([
                 'user_id' => 1,
                 'email' => 'test@example.com',
                 'username' => 'testuser'
             ]);
        
        $this->mockDb->expects($this->once())
                     ->method('prepare')
                     ->willReturn($stmt);
        
        $result = $this->user->findByEmail('test@example.com');
        
        $this->assertIsArray($result);
        $this->assertEquals('test@example.com', $result['email']);
    }
    
    public function testFindByEmailReturnsNullWhenNotFound() {
        $stmt = $this->createMock(\PDOStatement::class);
        $stmt->expects($this->once())
             ->method('execute');
        $stmt->expects($this->once())
             ->method('fetch')
             ->willReturn(false);
        
        $this->mockDb->expects($this->once())
                     ->method('prepare')
                     ->willReturn($stmt);
        
        $result = $this->user->findByEmail('nonexistent@example.com');
        
        $this->assertFalse($result);
    }
    
    public function testFindByUsernameReturnsUser() {
        $stmt = $this->createMock(\PDOStatement::class);
        $stmt->expects($this->once())
             ->method('bindValue')
             ->with(':username', 'testuser');
        $stmt->expects($this->once())
             ->method('execute');
        $stmt->expects($this->once())
             ->method('fetch')
             ->willReturn([
                 'user_id' => 1,
                 'username' => 'testuser',
                 'email' => 'test@example.com'
             ]);
        
        $this->mockDb->expects($this->once())
                     ->method('prepare')
                     ->willReturn($stmt);
        
        $result = $this->user->findByUsername('testuser');
        
        $this->assertIsArray($result);
        $this->assertEquals('testuser', $result['username']);
    }
    
    public function testLoginSuccessWithValidCredentials() {
        $hashedPassword = password_hash('password123', PASSWORD_DEFAULT);
        
        $stmt = $this->createMock(\PDOStatement::class);
        $stmt->method('execute');
        $stmt->method('fetch')
             ->willReturn([
                 'user_id' => 1,
                 'email' => 'test@example.com',
                 'password_hash' => $hashedPassword,
                 'is_active' => true
             ]);
        
        $this->mockDb->method('prepare')
                     ->willReturn($stmt);
        
        $result = $this->user->login('test@example.com', 'password123');
        
        $this->assertIsArray($result);
        $this->assertTrue($result['success']);
        $this->assertArrayHasKey('user', $result);
        $this->assertArrayNotHasKey('password_hash', $result['user']);
    }
    
    public function testLoginFailsWithInvalidPassword() {
        $hashedPassword = password_hash('correctpassword', PASSWORD_DEFAULT);
        
        $stmt = $this->createMock(\PDOStatement::class);
        $stmt->method('execute');
        $stmt->method('fetch')
             ->willReturn([
                 'user_id' => 1,
                 'email' => 'test@example.com',
                 'password_hash' => $hashedPassword,
                 'is_active' => true
             ]);
        
        $this->mockDb->method('prepare')
                     ->willReturn($stmt);
        
        $result = $this->user->login('test@example.com', 'wrongpassword');
        
        $this->assertIsArray($result);
        $this->assertFalse($result['success']);
        $this->assertStringContainsString('incorrect', strtolower($result['message']));
    }
    
    public function testLoginFailsWithInactiveAccount() {
        $hashedPassword = password_hash('password123', PASSWORD_DEFAULT);
        
        $stmt = $this->createMock(\PDOStatement::class);
        $stmt->method('execute');
        $stmt->method('fetch')
             ->willReturn([
                 'user_id' => 1,
                 'email' => 'test@example.com',
                 'password_hash' => $hashedPassword,
                 'is_active' => false
             ]);
        
        $this->mockDb->method('prepare')
                     ->willReturn($stmt);
        
        $result = $this->user->login('test@example.com', 'password123');
        
        $this->assertIsArray($result);
        $this->assertFalse($result['success']);
        $this->assertStringContainsString('désactivé', $result['message']);
    }
    
    public function testLoginFailsWithNonExistentEmail() {
        $stmt = $this->createMock(\PDOStatement::class);
        $stmt->method('execute');
        $stmt->method('fetch')
             ->willReturn(false);
        
        $this->mockDb->method('prepare')
                     ->willReturn($stmt);
        
        $result = $this->user->login('nonexistent@example.com', 'password123');
        
        $this->assertIsArray($result);
        $this->assertFalse($result['success']);
    }
    
    public function testGetFavoritesReturnsArray() {
        $stmt = $this->createMock(\PDOStatement::class);
        $stmt->expects($this->exactly(3))
             ->method('bindValue');
        $stmt->expects($this->once())
             ->method('execute');
        $stmt->expects($this->once())
             ->method('fetchAll')
             ->willReturn([
                 ['cer_id' => 1, 'notes' => 'Note 1'],
                 ['cer_id' => 2, 'notes' => 'Note 2']
             ]);
        
        $this->mockDb->expects($this->once())
                     ->method('prepare')
                     ->willReturn($stmt);
        
        $result = $this->user->getFavorites(1);
        
        $this->assertIsArray($result);
        $this->assertCount(2, $result);
    }
    
    public function testAddFavoriteExecutesQuery() {
        $stmt = $this->createMock(\PDOStatement::class);
        $stmt->expects($this->exactly(3))
             ->method('bindValue');
        $stmt->expects($this->once())
             ->method('execute')
             ->willReturn(true);
        
        $this->mockDb->expects($this->once())
                     ->method('prepare')
                     ->willReturn($stmt);
        
        $result = $this->user->addFavorite(1, 5, 'Test note');
        
        $this->assertTrue($result);
    }
    
    public function testRemoveFavoriteExecutesQuery() {
        $stmt = $this->createMock(\PDOStatement::class);
        $stmt->expects($this->exactly(2))
             ->method('bindValue');
        $stmt->expects($this->once())
             ->method('execute')
             ->willReturn(true);
        
        $this->mockDb->expects($this->once())
                     ->method('prepare')
                     ->willReturn($stmt);
        
        $result = $this->user->removeFavorite(1, 5);
        
        $this->assertTrue($result);
    }
    
    public function testIsFavoriteReturnsTrueWhenExists() {
        $stmt = $this->createMock(\PDOStatement::class);
        $stmt->expects($this->exactly(2))
             ->method('bindValue');
        $stmt->expects($this->once())
             ->method('execute');
        $stmt->expects($this->once())
             ->method('fetch')
             ->willReturn(['count' => 1]);
        
        $this->mockDb->expects($this->once())
                     ->method('prepare')
                     ->willReturn($stmt);
        
        $result = $this->user->isFavorite(1, 5);
        
        $this->assertTrue($result);
    }
    
    public function testIsFavoriteReturnsFalseWhenNotExists() {
        $stmt = $this->createMock(\PDOStatement::class);
        $stmt->expects($this->exactly(2))
             ->method('bindValue');
        $stmt->expects($this->once())
             ->method('execute');
        $stmt->expects($this->once())
             ->method('fetch')
             ->willReturn(['count' => 0]);
        
        $this->mockDb->expects($this->once())
                     ->method('prepare')
                     ->willReturn($stmt);
        
        $result = $this->user->isFavorite(1, 5);
        
        $this->assertFalse($result);
    }
    
    protected function tearDown(): void {
        parent::tearDown();
        $this->user = null;
        $this->mockDb = null;
    }
}
