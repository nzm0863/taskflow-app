<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$pdo = new PDO(
    "mysql:host=mysql3107.db.sakura.ne.jp;dbname=nnzzm_p_management;charset=utf8mb4",
    "nnzzm_p_management",
    "nnzzm0863"
);

$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

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
        "department_id" => $user["department_id"]
    ]);
} else {
    echo json_encode([
        "message" => "ログイン失敗"
    ]);
}