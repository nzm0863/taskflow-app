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

$pdo = new PDO(
    "mysql:host={$host};dbname={$dbname};charset={$charset}",
    $user,
    $pass
);

$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$data = json_decode(file_get_contents("php://input"), true);

$project_name = $data['project_name'];
$description = $data['description'];
$status = $data['status'];
$applicant_id = $data['applicant_id'];
$requested_amount = $data['requested_amount'];

$sql = "INSERT INTO projects
(project_name, description, status, applicant_id)
VALUES
('$project_name', '$description', '$status', '$applicant_id')";

$pdo->exec($sql);

$project_id = $pdo->lastInsertId();

$sql2 = "INSERT INTO project_progress
(project_id, progress_rate, comment)
VALUES
('$project_id', 0, '')";

$pdo->exec($sql2);

$sql3 = "INSERT INTO budget
(project_id, requested_amount, planned_amount, actual_amount, remains)
VALUES
('$project_id', '$requested_amount', '$requested_amount', 0, '$requested_amount')";

$pdo->exec($sql3);

echo json_encode([
    "message" => "案件登録成功"
]);

