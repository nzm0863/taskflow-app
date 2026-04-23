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
$planned_amount = $_POST['planned_amount'];
$actual_amount = $_POST['actual_amount'];
$remains = $_POST['remains'];

$sql = "INSERT INTO budget
(project_id, planned_amount, actual_amount, remains)
VALUES
('$project_id', '$planned_amount', '$actual_amount', '$remains')";

$pdo->exec($sql);

echo json_encode([
    "message" => "予算登録成功"
]);