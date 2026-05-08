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

$project_id = $data['project_id'];
$actual_amount = $data['actual_amount'];

$sql = "
UPDATE budget
SET 
    actual_amount = '$actual_amount',
    remains = planned_amount - '$actual_amount'
WHERE project_id = '$project_id'
";

$pdo->exec($sql);

echo json_encode([
    "message" => "予算更新完了"
]);