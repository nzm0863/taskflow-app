<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$env = parse_ini_file('/home/nnzzm/.env');

$pdo = new PDO(
  "mysql:host={$env['DB_HOST']};dbname={$env['DB_NAME']};charset={$env['DB_CHARSET']}",
  $env['DB_USER'],
  $env['DB_PASS']
);

$data = json_decode(file_get_contents("php://input"), true);

$history_id = (int)$data['id'];

$sql = "DELETE FROM budget_history WHERE id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$history_id]);

echo json_encode(["message" => "削除完了"]);