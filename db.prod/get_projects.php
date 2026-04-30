<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

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
$sql = "
SELECT 
    projects.*,
    users.user_name,
    users.department_id,
    departments.department_name,
    project_progress.progress_rate,
    budget.requested_amount,
    budget.planned_amount,
    budget.actual_amount,
    budget.remains,
    users.department_id
FROM projects
LEFT JOIN users
ON projects.applicant_id = users.user_id
LEFT JOIN departments
ON users.department_id = departments.department_id
LEFT JOIN project_progress
ON projects.project_id = project_progress.project_id
LEFT JOIN budget
ON projects.project_id = budget.project_id
";

$stmt = $pdo->query($sql);
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($data);