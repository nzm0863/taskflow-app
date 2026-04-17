<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$pdo = new PDO(
    "mysql:host=localhost;dbname=development_management;charset=utf8",
    "root",
    ""
);

$sql = "
SELECT 
    projects.*,
    project_progress.progress_rate,
    budget.planned_amount,
    budget.actual_amount,
    budget.remains
FROM projects
LEFT JOIN project_progress
ON projects.project_id = project_progress.project_id
LEFT JOIN budget
ON projects.project_id = budget.project_id
";



$stmt = $pdo->query($sql);

$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($data);

if (!$data) {
    echo json_encode([
        "error" => "データ受信失敗"
    ]);
    exit;
}