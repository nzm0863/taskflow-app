<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$env = parse_ini_file(__DIR__ . '/../.env');

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
    actual_amount = '$actual_amount',
    remains = planned_amount - '$actual_amount'
WHERE project_id = '$project_id'
";

$pdo->exec($sql);

echo json_encode([
    "message" => "予算更新完了"
]);