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
$actual_amount = $data['actual_amount'];
$sql = "
UPDATE budget
SET 
  actual_amount = ?,
  remains = planned_amount - ?,
  updated_at = NOW()
WHERE project_id = ?
";

$stmt = $pdo->prepare($sql);
$stmt->execute([$actual_amount, $actual_amount, $project_id]);

echo json_encode([
    "message" => "予算更新完了"
]);