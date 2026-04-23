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
$approver_id = $_POST['approver_id'];
$approval_level = $_POST['approval_level'];
$status = $_POST['status'];

$sql = "INSERT INTO approvals
(project_id, approver_id, approval_level, status)
VALUES
('$project_id', '$approver_id', '$approval_level', '$status')";

$pdo->exec($sql);

if ($status === "承認") {
    $updateSql = "UPDATE projects 
    SET status = '承認済み'
    WHERE project_id = '$project_id'";

    $pdo->exec($updateSql);
}
echo json_encode([
    "message" => "承認登録成功"
]);