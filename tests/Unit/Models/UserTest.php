<?php

namespace Tests\Unit\Models;

use Tests\Support\TestCase;

class UserTest extends TestCase
{
    public function testUserCanBeCreated()
    {
        $user = new \App\Models\User();
        $user->setName('Test User');
        $user->setEmail('test@example.com');
        
        $this->assertEquals('Test User', $user->getName());
        $this->assertEquals('test@example.com', $user->getEmail());
    }

    public function testUserValidation()
    {
        $this->expectException(\InvalidArgumentException::class);
        $user = new \App\Models\User();
        $user->setEmail('invalid-email');
    }
}
