<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  exit(0);
}

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

$data = json_decode(file_get_contents("php://input"), true);

$project_id = $data['project_id'];
$progress_rate = $data['progress_rate'];
$sql = "UPDATE project_progress
SET 
  progress_rate = ?,
  updated_at = NOW()
WHERE project_id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$progress_rate, $project_id]);

echo json_encode([
  "message" => "進捗更新完了"
]);