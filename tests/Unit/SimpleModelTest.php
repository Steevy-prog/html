<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use PDO;
use PDOStatement;


class SimpleModelTest extends TestCase
{
    private $mockDb;
    private $mockStmt;
    
    protected function setUp(): void
    {
        parent::setUp();
        
        // Create mock PDO and PDOStatement
        $this->mockDb = $this->createMock(PDO::class);
        $this->mockStmt = $this->createMock(PDOStatement::class);
    }
    
    public function testMockDatabaseConnection()
    {
        // Test that our mock PDO works
        $this->assertInstanceOf(PDO::class, $this->mockDb);
        $this->assertInstanceOf(PDOStatement::class, $this->mockStmt);
    }
    
    public function testMockQueryExecution()
    {
        // Set up expectations for a simple query
        $this->mockDb->expects($this->once())
            ->method('prepare')
            ->with('SELECT 1')
            ->willReturn($this->mockStmt);
            
        $this->mockStmt->expects($this->once())
            ->method('execute')
            ->willReturn(true);
            
        $this->mockStmt->expects($this->once())
            ->method('fetch')
            ->willReturn(['result' => 1]);
            
        // Execute the query
        $stmt = $this->mockDb->prepare('SELECT 1');
        $stmt->execute();
        $result = $stmt->fetch();
        
        // Verify the result
        $this->assertEquals(['result' => 1], $result);
    }
    
    public function testMockInsert()
    {
        $testData = [
            'name' => 'Test',
            'email' => 'test@example.com'
        ];
        
        // Set up expectations for an insert
        $this->mockDb->expects($this->once())
            ->method('prepare')
            ->with('INSERT INTO test_table (name, email) VALUES (:name, :email)')
            ->willReturn($this->mockStmt);
            
        $this->mockStmt->expects($this->exactly(3))
            ->method('bindValue')
            ->withConsecutive(
                [':name', 'Test', PDO::PARAM_STR],
                [':email', 'test@example.com', PDO::PARAM_STR]
            );
            
        $this->mockStmt->expects($this->once())
            ->method('execute')
            ->willReturn(true);
            
        // Execute the insert
        $stmt = $this->mockDb->prepare('INSERT INTO test_table (name, email) VALUES (:name, :email)');
        foreach ($testData as $key => $value) {
            $stmt->bindValue(':' . $key, $value);
        }
        $result = $stmt->execute();
        
        // Verify the result
        $this->assertTrue($result);
    }
}
