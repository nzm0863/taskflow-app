<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");


$pdo = new PDO(
    "mysql:host=mysql3107.db.sakura.ne.jp;dbname=nnzzm_p_management;charset=utf8mb4",
    "nnzzm_p_management",
    "nnzzm0863"
);

$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$sql = "
SELECT 
    projects.*,
    project_progress.progress_rate,
    budget.planned_amount,
    budget.actual_amount,
    budget.remains,
    users.department_id
FROM projects
LEFT JOIN users
ON projects.applicant_id = users.user_id
LEFT JOIN project_progress
ON projects.project_id = project_progress.project_id
LEFT JOIN budget
ON projects.project_id = budget.project_id
";

$stmt = $pdo->query($sql);
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($data);