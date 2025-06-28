<?php

// Include the configuration file
require_once 'config.php';

// Set content type and CORS headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

try {
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Sanitize and validate input using functions from config.php
        $name = sanitizeInput($_POST['name'] ?? '');
        $email = sanitizeInput($_POST['email'] ?? '');
        $subject = sanitizeInput($_POST['subject'] ?? '');
        $message = sanitizeInput($_POST['message'] ?? '');
        
        // Validation
        $errors = [];
        
        if (empty($name)) {
            $errors[] = 'Name is required';
        }
        
        if (empty($email)) {
            $errors[] = 'Email is required';
        } elseif (!isValidEmail($email)) {
            $errors[] = 'Invalid email format';
        }
        
        if (empty($subject)) {
            $subject = 'No Subject';
        }
        
        if (empty($message)) {
            $errors[] = 'Message is required';
        }
        
        if (!empty($errors)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'errors' => $errors]);
            exit;
        }
        
        // FIXED: Use correct column name 'submitted_at' instead of 'created_at'
        $sql = "INSERT INTO contact_submissions (name, email, subject, message, submitted_at, status) 
                VALUES (:name, :email, :subject, :message, NOW(), 'new')";
        
        $stmt = $pdo->prepare($sql);
        $result = $stmt->execute([
            ':name' => $name,
            ':email' => $email,
            ':subject' => $subject,
            ':message' => $message
        ]);
        
        if (!$result) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to save your message. Please try again.']);
            exit;
        }
        
        // Return success response
        echo json_encode(['success' => true, 'message' => 'Your message has been saved. We will contact you soon!']);
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    }
} catch (Exception $e) {
    error_log("Error in contact form: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'An error occurred. Please try again later.']);
}
?>