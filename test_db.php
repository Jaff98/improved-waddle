<?php
require_once 'config.php';
try {
    $pdo = getDBConnection();
    echo "Database connection successful!";
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>