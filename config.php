<?php
// Database Configuration
define('DB_HOST', 'localhost'); 
define('DB_NAME', 'solaris_website');
define('DB_USER', 'root');
define('DB_PASS', '');

// Email Configuration


// Security Settings
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD', '12345'); // Change this before production!

// Database Connection
$pdo = new PDO(
    "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
    DB_USER,
    DB_PASS,
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]
);

// Email Function
function sendEmail($to, $subject, $message, $from = FROM_EMAIL) {
    // Email sending disabled for local development
    return true;
}

// Sanitize Input Function
function sanitizeInput($data) {
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

// Validate Email Function
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}
?>