<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use PDO;
use PDOStatement;

// Include the BaseModel first to prevent multiple includes
require_once __DIR__ . '/../../backend/models/BaseModel.php';

// Override the getDB function for testing
function getDB() {
    static $db = null;
    
    if ($db === null) {
        // Create an in-memory SQLite database
        $db = new PDO('sqlite::memory:');
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    
    return $db;
}

// Make sure the function is available in the global namespace
if (!function_exists('getDB')) {
    function getDB() {
        return \getDB();
    }
}

// Remove the separate test class since we're using an anonymous class in setUp

class BaseModelUnitTest extends TestCase {
    private $model;
    private $mockDb;
    private $mockStmt;
    
    protected function setUp(): void {
        parent::setUp();
        
        // Get the test database connection
        $this->mockDb = getDB();
        
        // Create test table if it doesn't exist
        $this->mockDb->exec("
            CREATE TABLE IF NOT EXISTS test_table (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT,
                age INTEGER,
                is_active INTEGER DEFAULT 1,
                created_at TEXT
            )
        ");
        
        // Clear any existing data
        $this->mockDb->exec("DELETE FROM test_table");
        
        // Create test instance
        $this->model = new class extends \BaseModel {
            protected $table = 'test_table';
            
            public function __construct() {
                parent::__construct();
            }
            
            public function getPrimaryKey() {
                return 'id';
            }
            
            // Expose protected methods for testing
            public function testFormatDataForQuery($data) {
                return $this->formatDataForQuery($data);
            }
            
            public function testGetPlaceholders($data) {
                return $this->getPlaceholders($data);
            }
            
            public function getTableName() {
                return $this->table;
            }
        };
    }
    
    public function testGetTableName() {
        $reflection = new \ReflectionClass($this->model);
        $method = $reflection->getMethod('getTableName');
        $method->setAccessible(true);
        $this->assertEquals('test_table', $method->invoke($this->model));
    }
    
    public function testGetPrimaryKeyValue() {
        $reflection = new \ReflectionClass($this->model);
        $method = $reflection->getMethod('getPrimaryKeyValue');
        $method->setAccessible(true);
        
        // Test with existing ID
        $reflection = new \ReflectionClass($this->model);
        $property = $reflection->getProperty('id');
        $property->setAccessible(true);
        $property->setValue($this->model, 123);
        
        $this->assertEquals(123, $method->invoke($this->model));
        
        // Test without ID
        $property->setValue($this->model, null);
        $this->assertNull($method->invoke($this->model));
    }
    
    public function testFormatDataForQuery() {
        $testData = [
            'name' => 'Test',
            'email' => 'test@example.com',
            'age' => 30,
            'is_active' => true,
            'created_at' => '2023-01-01 00:00:00'
        ];
        
        $expected = [
            'name' => 'Test',
            'email' => 'test@example.com',
            'age' => 30,
            'is_active' => 1, // boolean converted to integer
            'created_at' => '2023-01-01 00:00:00'
        ];
        
        $result = $this->model->testFormatDataForQuery($testData);
        $this->assertEquals($expected, $result);
    }
    
    public function testGetPlaceholders() {
        $testData = [
            'name' => 'Test',
            'email' => 'test@example.com',
            'age' => 30
        ];
        
        $expected = [
            'name' => ':name',
            'email' => ':email',
            'age' => ':age'
        ];
        
        $result = $this->model->testGetPlaceholders($testData);
        $this->assertEquals($expected, $result);
    }
    
    public function testDelete() {
        $id = 123;
        
        // Set up expectations for the PDO mock
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
        
        // Call the method under test
        $result = $this->model->delete($id);
        
        // Verify the result
        $this->assertTrue($result);
    }
    
    public function testCount() {
        $expectedCount = 42;
        
        // Set up expectations for the PDO mock
        $this->mockDb->expects($this->once())
            ->method('query')
            ->with('SELECT COUNT(*) as count FROM test_table')
            ->willReturn($this->mockStmt);
            
        $this->mockStmt->expects($this->once())
            ->method('fetch')
            ->with(PDO::FETCH_OBJ)
            ->willReturn((object)['count' => $expectedCount]);
        
        // Call the method under test
        $result = $this->model->count();
        
        // Verify the result
        $this->assertEquals($expectedCount, $result);
    }
}
