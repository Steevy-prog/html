<?php

namespace App\Models;

class User
{
    private $id;
    private $name;
    private $email;

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setEmail(string $email): void
    {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException('Invalid email address');
        }
        $this->email = $email;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }
}
