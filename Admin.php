<?php
// Simple admin panel to manage ads
// Note: For production, add proper authentication

$ads_file = 'ads.json';

// Load existing ads
if (file_exists($ads_file)) {
    $ads = json_decode(file_get_contents($ads_file), true);
} else {
    $ads = [];
}

// Handle form submission
if ($_POST['action'] == 'add_ad') {
    $new_ad = [
        'id' => time(),
        'title' => $_POST['title'],
        'content' => $_POST['content'],
        'earnings' => floatval($_POST['earnings']),
        'duration' => intval($_POST['duration'])
    ];
    
    $ads[] = $new_ad;
    file_put_contents($ads_file, json_encode($ads));
    header('Location: admin.php');
    exit;
}

// Handle ad deletion
if (isset($_GET['delete'])) {
    $ad_id = intval($_GET['delete']);
    $ads = array_filter($ads, function($ad) use ($ad_id) {
        return $ad['id'] != $ad_id;
    });
    file_put_contents($ads_file, json_encode(array_values($ads)));
    header('Location: admin.php');
    exit;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Admin Panel - Ad Management</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        form { margin-bottom: 20px; padding: 20px; border: 1px solid #ddd; }
        input, textarea { width: 100%; margin-bottom: 10px; padding: 8px; }
        button { padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer; }
        .ad-item { border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; }
        .delete-btn { background: #dc3545; color: white; border: none; padding: 5px 10px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Ad Management Admin Panel</h1>
        
        <form method="POST">
            <h3>Add New Ad</h3>
            <input type="text" name="title" placeholder="Ad Title" required>
            <textarea name="content" placeholder="Ad Content" rows="4" required></textarea>
            <input type="number" name="earnings" step="0.01" placeholder="Earnings per view" required>
            <input type="number" name="duration" placeholder="Duration in seconds" required>
            <input type="hidden" name="action" value="add_ad">
            <button type="submit">Add Ad</button>
        </form>
        
        <h3>Current Ads</h3>
        <?php foreach ($ads as $ad): ?>
            <div class="ad-item">
                <h4><?php echo htmlspecialchars($ad['title']); ?></h4>
                <p><?php echo htmlspecialchars($ad['content']); ?></p>
                <p><strong>Earnings:</strong> $<?php echo number_format($ad['earnings'], 2); ?></p>
                <p><strong>Duration:</strong> <?php echo $ad['duration']; ?> seconds</p>
                <a href="?delete=<?php echo $ad['id']; ?>" class="delete-btn" onclick="return confirm('Delete this ad?')">Delete</a>
            </div>
        <?php endforeach; ?>
    </div>
</body>
</html>