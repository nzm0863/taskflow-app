<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

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

try {
    $pdo = new PDO(
        "mysql:host={$host};dbname={$dbname};charset={$charset}",
        $user,
        $pass
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode([
        "message" => "DB接続失敗"
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$input_password = $data['password'] ?? '';

$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && $user['password_hash'] === $input_password) {
    echo json_encode([
        "message" => "ログイン成功",
        "role" => $user['role'],
        "user_id" => $user['user_id'],
        "department_id" => $user['department_id']
    ]);
} else {
    echo json_encode([
        "message" => "ログイン失敗"
    ]);
}