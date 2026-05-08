<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$pdo = new PDO(
    "mysql:host=localhost;dbname=development_management;charset=utf8",
    "root",
    ""
);

$data = json_decode(file_get_contents("php://input"), true);

$project_name = $data['project_name'];
$description = $data['description'];
$status = $data['status'];
$applicant_id = $data['applicant_id'];

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
(project_id, planned_amount, actual_amount, remains)
VALUES
('$project_id', 100000, 0, 100000)";

$pdo->exec($sql3);

echo json_encode([
    "message" => "案件登録成功"
]);

