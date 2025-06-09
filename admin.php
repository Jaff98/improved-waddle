<?php
session_start();
require_once 'config.php';

// $pdo is already available from config.php

// Simple authentication
if (!isset($_SESSION['admin_logged_in'])) {
    if ($_POST['username'] ?? '' === ADMIN_USERNAME && $_POST['password'] ?? '' === ADMIN_PASSWORD) {
        $_SESSION['admin_logged_in'] = true;
    } else {
        // Show login form
        ?>
        <!DOCTYPE html>
        <html>
        <head>
            <title>Solaris Admin Login</title>
            <style>
                body { font-family: Arial, sans-serif; background: #f5f5f5; }
                .login-container { max-width: 400px; margin: 100px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .form-group { margin-bottom: 20px; }
                label { display: block; margin-bottom: 5px; font-weight: bold; }
                input[type="text"], input[type="password"] { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
                button { width: 100%; padding: 12px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
                button:hover { background: #0056b3; }
                h2 { text-align: center; color: #333; }
            </style>
        </head>
        <body>
            <div class="login-container">
                <h2>Solaris Admin Panel</h2>
                <form method="post">
                    <div class="form-group">
                        <label>Username:</label>
                        <input type="text" name="username" required>
                    </div>
                    <div class="form-group">
                        <label>Password:</label>
                        <input type="password" name="password" required>
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </body>
        </html>
        <?php
        exit;
    }
}

// Handle actions
if ($_GET['action'] ?? '' === 'logout') {
    session_destroy();
    header('Location: admin.php');
    exit;
}

if ($_GET['action'] ?? '' === 'mark_read' && isset($_GET['id'])) {
    $stmt = $pdo->prepare("UPDATE contact_submissions SET status = 'read' WHERE id = ?");
    $stmt->execute([$_GET['id']]);
}

if ($_GET['action'] ?? '' === 'delete' && isset($_GET['id'])) {
    $stmt = $pdo->prepare("DELETE FROM contact_submissions WHERE id = ?");
    $stmt->execute([$_GET['id']]);
}

// Get contact submissions
$stmt = $pdo->query("SELECT * FROM contact_submissions ORDER BY submitted_at DESC");
$submissions = $stmt->fetchAll();

// Get statistics
$stats = $pdo->query("SELECT 
    COUNT(*) as total,
    COUNT(CASE WHEN status = 'new' THEN 1 END) as new_count,
    COUNT(CASE WHEN status = 'read' THEN 1 END) as read_count,
    COUNT(CASE WHEN DATE(submitted_at) = CURDATE() THEN 1 END) as today_count
    FROM contact_submissions")->fetch();
?>

<!DOCTYPE html>
<html>
<head>
    <title>Solaris Admin Panel</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; background: #f5f5f5; }
        .header { background: #007bff; color: white; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; }
        .container { max-width: 1200px; margin: 20px auto; padding: 0 20px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
        .stat-number { font-size: 2em; font-weight: bold; color: #007bff; }
        .table-container { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
        th { background: #f8f9fa; font-weight: bold; }
        .status-new { color: #dc3545; font-weight: bold; }
        .status-read { color: #28a745; }
        .actions { display: flex; gap: 10px; }
        .btn { padding: 6px 12px; text-decoration: none; border-radius: 4px; font-size: 12px; }
        .btn-primary { background: #007bff; color: white; }
        .btn-success { background: #28a745; color: white; }
        .btn-danger { background: #dc3545; color: white; }
        .btn:hover { opacity: 0.8; }
        .logout-btn { background: #dc3545; color: white; padding: 8px 16px; border-radius: 4px; text-decoration: none; }
        .message { max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .message:hover { white-space: normal; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Solaris Admin Panel</h1>
        <a href="?action=logout" class="logout-btn">Logout</a>
    </div>
    
    <div class="container">
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number"><?= $stats['total'] ?></div>
                <div>Total Submissions</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?= $stats['new_count'] ?></div>
                <div>New Messages</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?= $stats['read_count'] ?></div>
                <div>Read Messages</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?= $stats['today_count'] ?></div>
                <div>Today's Messages</div>
            </div>
        </div>
        
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Subject</th>
                        <th>Message</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($submissions as $submission): ?>
                    <tr>
                        <td><?= $submission['id'] ?></td>
                        <td><?= htmlspecialchars($submission['name']) ?></td>
                        <td><a href="mailto:<?= htmlspecialchars($submission['email']) ?>"><?= htmlspecialchars($submission['email']) ?></a></td>
                        <td><?= htmlspecialchars($submission['subject'] ?: 'No Subject') ?></td>
                        <td class="message" title="<?= htmlspecialchars($submission['message']) ?>">
                            <?= htmlspecialchars(substr($submission['message'], 0, 50) . (strlen($submission['message']) > 50 ? '...' : '')) ?>
                        </td>
                        <td class="status-<?= $submission['status'] ?>">
                            <?= ucfirst($submission['status']) ?>
                        </td>
                        <td><?= date('M j, Y H:i', strtotime($submission['submitted_at'])) ?></td>
                        <td class="actions">
                            <?php if ($submission['status'] === 'new'): ?>
                                <a href="?action=mark_read&id=<?= $submission['id'] ?>" class="btn btn-success">Mark Read</a>
                            <?php endif; ?>
                            <a href="?action=delete&id=<?= $submission['id'] ?>" class="btn btn-danger" onclick="return confirm('Are you sure you want to delete this message?')">Delete</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>