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
$status = $data['status'];

$sql = "UPDATE projects
SET status = '$status'
WHERE project_id = '$project_id'";

$pdo->exec($sql);

echo json_encode([
    "message" => "承認更新完了"
]);