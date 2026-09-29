<?php
// receive-blog.php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Secret');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if ($data && (isset($data['champion']) || isset($data['title']))) {
    $champion = isset($data['champion']) ? $data['champion'] : $data;
    
    $cacheFile = __DIR__ . '/public/champion_cache.json';
    $payload = [
        'success' => true,
        'champion' => $champion,
        'updated_at' => date('c')
    ];

    file_put_contents($cacheFile, json_encode($payload, JSON_PRETTY_PRINT));
    echo json_encode(["success" => true, "message" => "Champion blog synced to portfolio successfully!"]);
} else {
    http_response_code(400);
    echo json_encode(["error" => "Invalid champion payload"]);
}
?>
