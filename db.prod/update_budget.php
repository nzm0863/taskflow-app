<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");
ini_set('display_errors', 1);
error_reporting(E_ALL);


$env = parse_ini_file('/home/nnzzm/.env');

$host = $env['DB_HOST'];
$dbname = $env['DB_NAME'];
$user = $env['DB_USER'];
$pass = $env['DB_PASS'];
$charset = $env['DB_CHARSET'];

$pdo = new PDO(
    "mysql:host={$host};dbname={$dbname};charset={$charset}",
    $user,
    $pass
);

$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$raw = file_get_contents("php://input");
$data = json_decode(file_get_contents("php://input"), true);

// 🔥 デバッグ（ここに置く）
if (!$data) {
    echo json_encode([
        "error" => "JSON受け取れてない",
        "raw" => $raw
    ]);
    exit;
}

$project_id = (int)$data['projectId'];
$amount = (float)$data['amount'];
$category = $data['category'];
$note = $data['note'] ?? '';

$sql = "
INSERT INTO budget_history (project_id, amount, category, note)
VALUES (?, ?, ?, ?)
";

$stmt = $pdo->prepare($sql);
$stmt->execute([$project_id, $amount, $category, $note]);

echo json_encode(["message" => "追加完了"]);