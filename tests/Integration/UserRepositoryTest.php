<?php

namespace Tests\Integration;

use Tests\Support\TestCase;
use App\Repositories\UserRepository;
use App\Models\User;

class UserRepositoryTest extends TestCase
{
    private $repository;
    private $db;

    protected function setUp(): void
    {
        parent::setUp();
        $this->db = getDB();
        $this->repository = new UserRepository($this->db);
        $this->createTestTables();
    }

    private function createTestTables(): void
    {
        $this->db->exec("
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ");
    }

    public function testCanSaveAndRetrieveUser()
    {
        $user = new User();
        $user->setName('testuser');
        $user->setEmail('test@example.com');
        
        // Save user
        $savedUser = $this->repository->save($user);
        
        // Retrieve user
        $retrievedUser = $this->repository->find($savedUser->getId());
        
        $this->assertEquals('testuser', $retrievedUser->getName());
        $this->assertEquals('test@example.com', $retrievedUser->getEmail());
    }
}
