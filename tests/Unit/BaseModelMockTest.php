<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use PDO;
use PDOStatement;

// Create a test double for BaseModel
class TestableBaseModel extends \BaseModel {
    protected $table = 'test_table';
    
    public function __construct($db = null) {
        if ($db) {
            $this->db = $db;
        } else {
            parent::__construct();
        }
    }
    
    public function getPrimaryKey() {
        return 'id';
    }
    
    // Make protected methods accessible for testing
    public function testFormatDataForQuery($data) {
        return $this->formatDataForQuery($data);
    }
    
    public function testGetPlaceholders($data) {
        return $this->getPlaceholders($data);
    }
    
    public function testGetTableName() {
        return $this->table;
    }
}

class BaseModelMockTest extends TestCase {
    private $model;
    private $mockDb;
    private $mockStmt;
    
    protected function setUp(): void {
        parent::setUp();
        
        // Create mock PDO and PDOStatement
        $this->mockDb = $this->createMock(PDO::class);
        $this->mockStmt = $this->createMock(PDOStatement::class);
        
        // Create test instance with our mock DB
        $this->model = new TestableBaseModel($this->mockDb);
    }
    
    public function testGetTableName() {
        $this->assertEquals('test_table', $this->model->testGetTableName());
    }
    
    public function testFormatDataForQuery() {
        $testData = [
            'name' => 'Test',
            'email' => 'test@example.com',
            'age' => 25,
            'is_active' => true,
            'created_at' => '2023-01-01 00:00:00'
        ];
        
        $expected = [
            'name' => 'Test',
            'email' => 'test@example.com',
            'age' => 25,
            'is_active' => 1,
            'created_at' => '2023-01-01 00:00:00'
        ];
        
        $this->assertEquals($expected, $this->model->testFormatDataForQuery($testData));
    }
    
    public function testGetPlaceholders() {
        $testData = [
            'name' => 'Test',
            'email' => 'test@example.com',
            'age' => 25
        ];
        
        $expected = [
            'name' => ':name',
            'email' => ':email',
            'age' => ':age'
        ];
        
        $this->assertEquals($expected, $this->model->testGetPlaceholders($testData));
    }
    
    public function testDelete() {
        $id = 123;
        
        // Set up expectations
        $this->mockDb->expects($this->once())
            ->method('prepare')
            ->with('DELETE FROM test_table WHERE id = :id')
            ->willReturn($this->mockStmt);
            
        $this->mockStmt->expects($this->once())
            ->method('bindValue')
            ->with(':id', $id, PDO::PARAM_INT);
            
        $this->mockStmt->expects($this->once())
            ->method('execute')
            ->willReturn(true);
        
        $result = $this->model->delete($id);
        $this->assertTrue($result);
    }
    
    public function testCount() {
        $expectedCount = 5;
        
        // Set up expectations
        $this->mockDb->expects($this->once())
            ->method('query')
            ->with('SELECT COUNT(*) as count FROM test_table')
            ->willReturn($this->mockStmt);
            
        $this->mockStmt->expects($this->once())
            ->method('fetch')
            ->with(PDO::FETCH_OBJ)
            ->willReturn((object)['count' => $expectedCount]);
        
        $result = $this->model->count();
        $this->assertEquals($expectedCount, $result);
    }
}
