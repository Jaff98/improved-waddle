<?php
require_once 'config.php';
try {
    $stmt = $pdo->query('SELECT 1');
    echo 'DB works!';
} catch (Exception $e) {
    echo 'DB error: ' . $e->getMessage();
}
?>