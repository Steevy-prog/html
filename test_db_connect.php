<?php
$host = '127.0.0.1';
$db   = 'Archiva';
$user = 'root';
$pass = ''; // Replace with your actual password if not empty
$port = '3306'; // Replace with your XAMPP MySQL port if not 3306
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;port=$port;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
     echo "SUCCESS: Database connection established!\n";
} catch (\PDOException $e) {
     echo "FAILURE: Connection Error!\n";
     // Output the exact error code and message
     echo "Code: " . $e->getCode() . " | Message: " . $e->getMessage() . "\n";
}
?>