<?php

header('Content-Type: application/json');

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

$project_id = $_POST['project_id'];
$progress_rate = $_POST['progress_rate'];
$comment = $_POST['comment'];

$sql = "INSERT INTO project_progress
(project_id, progress_rate, comment)
VALUES
('$project_id', '$progress_rate', '$comment')";

$pdo->exec($sql);

echo json_encode([
    "message" => "進捗登録成功"
]);