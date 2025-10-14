<?php

namespace Tests\Support;

use PHPUnit\Framework\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        // Any setup code needed for all tests
    }

    protected function tearDown(): void
    {
        // Clean up after each test
        parent::tearDown();
    }
}
