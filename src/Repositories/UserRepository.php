<?php

namespace App\Repositories;

use App\Models\User;
use PDO;

class UserRepository
{
    private $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function save(User $user): User
    {
        $stmt = $this->db->prepare("
            INSERT INTO users (username, email, password) 
            VALUES (:username, :email, :password)
        ");

        $stmt->execute([
            'username' => $user->getName(),
            'email' => $user->getEmail(),
            'password' => password_hash('password', PASSWORD_DEFAULT)
        ]);

        $user->setId($this->db->lastInsertId());
        return $user;
    }

    public function find(int $id): ?User
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$data) {
            return null;
        }

        $user = new User();
        $user->setId($data['id']);
        $user->setName($data['username']);
        $user->setEmail($data['email']);

        return $user;
    }
}
