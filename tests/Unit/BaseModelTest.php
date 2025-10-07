<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../backend/models/BaseModel.php';

/**
 * Tests unitaires pour BaseModel
 */
class BaseModelTest extends TestCase {
    private $model;
    private $mockDb;
    
    protected function setUp(): void {
        parent::setUp();
        
        // Créer un mock de la connexion PDO
        $this->mockDb = $this->createMock(\PDO::class);
        
        // Créer une instance concrète de BaseModel pour les tests
        $this->model = new class extends \BaseModel {
            protected $table = 'test_table';
            
            public function getPrimaryKey() {
                return 'id';
            }
            
            public function setDb($db) {
                $this->db = $db;
            }
        };
        
        $this->model->setDb($this->mockDb);
    }
    
    public function testFindMethodPreparesCorrectQuery() {
        $stmt = $this->createMock(\PDOStatement::class);
        $stmt->expects($this->once())
             ->method('bindValue')
             ->with(':id', 1, \PDO::PARAM_INT);
        $stmt->expects($this->once())
             ->method('execute');
        $stmt->expects($this->once())
             ->method('fetch')
             ->willReturn(['id' => 1, 'name' => 'Test']);
        
        $this->mockDb->expects($this->once())
                     ->method('prepare')
                     ->with('SELECT * FROM test_table WHERE id = :id LIMIT 1')
                     ->willReturn($stmt);
        
        $result = $this->model->find(1);
        
        $this->assertIsArray($result);
        $this->assertEquals(1, $result['id']);
        $this->assertEquals('Test', $result['name']);
    }
    
    public function testAllMethodReturnsArray() {
        $stmt = $this->createMock(\PDOStatement::class);
        $stmt->expects($this->once())
             ->method('execute');
        $stmt->expects($this->once())
             ->method('fetchAll')
             ->willReturn([
                 ['id' => 1, 'name' => 'Test 1'],
                 ['id' => 2, 'name' => 'Test 2']
             ]);
        
        $this->mockDb->expects($this->once())
                     ->method('prepare')
                     ->willReturn($stmt);
        
        $result = $this->model->all();
        
        $this->assertIsArray($result);
        $this->assertCount(2, $result);
    }
    
    public function testCreateMethodInsertsData() {
        $stmt = $this->createMock(\PDOStatement::class);
        $stmt->expects($this->exactly(2))
             ->method('bindValue');
        $stmt->expects($this->once())
             ->method('execute');
        
        $this->mockDb->expects($this->once())
                     ->method('prepare')
                     ->willReturn($stmt);
        $this->mockDb->expects($this->once())
                     ->method('lastInsertId')
                     ->willReturn('123');
        
        $data = ['name' => 'Test', 'value' => 'Value'];
        $result = $this->model->create($data);
        
        $this->assertEquals('123', $result);
    }
    
    public function testUpdateMethodModifiesData() {
        $stmt = $this->createMock(\PDOStatement::class);
        $stmt->expects($this->exactly(3))
             ->method('bindValue');
        $stmt->expects($this->once())
             ->method('execute')
             ->willReturn(true);
        
        $this->mockDb->expects($this->once())
                     ->method('prepare')
                     ->willReturn($stmt);
        
        $data = ['name' => 'Updated', 'value' => 'New Value'];
        $result = $this->model->update(1, $data);
        
        $this->assertTrue($result);
    }
    
    public function testDeleteMethodRemovesRecord() {
        $stmt = $this->createMock(\PDOStatement::class);
        $stmt->expects($this->once())
             ->method('bindValue')
             ->with(':id', 1, \PDO::PARAM_INT);
        $stmt->expects($this->once())
             ->method('execute')
             ->willReturn(true);
        
        $this->mockDb->expects($this->once())
                     ->method('prepare')
                     ->with('DELETE FROM test_table WHERE id = :id')
                     ->willReturn($stmt);
        
        $result = $this->model->delete(1);
        
        $this->assertTrue($result);
    }
    
    public function testWhereMethodWithConditions() {
        $stmt = $this->createMock(\PDOStatement::class);
        $stmt->expects($this->exactly(2))
             ->method('bindValue');
        $stmt->expects($this->once())
             ->method('execute');
        $stmt->expects($this->once())
             ->method('fetchAll')
             ->willReturn([['id' => 1, 'status' => 'active']]);
        
        $this->mockDb->expects($this->once())
                     ->method('prepare')
                     ->willReturn($stmt);
        
        $conditions = ['status' => 'active', 'type' => 'user'];
        $result = $this->model->where($conditions);
        
        $this->assertIsArray($result);
    }
    
    protected function tearDown(): void {
        parent::tearDown();
        $this->model = null;
        $this->mockDb = null;
    }
}
