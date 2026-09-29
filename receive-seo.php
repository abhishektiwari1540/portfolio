<?php
// receive-seo.php
header('Content-Type: application/json');
$json = file_get_contents('php://input');
$data = json_decode($json, true);
if ($data && isset($data['pages'])) {
    file_put_contents(__DIR__ . '/seo_cache.json', json_encode($data['pages']));
    echo json_encode(["success" => true, "message" => "SEO updated successfully!"]);
} else {
    http_response_code(400);
    echo json_encode(["error" => "Invalid payload"]);
}
?>
