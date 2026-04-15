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
    "NZMtomjerry0863"
);

$data = json_decode(file_get_contents("php://input"), true);

$project_id = $data['project_id'];
$progress_rate = $data['progress_rate'];

$sql = "UPDATE project_progress
SET progress_rate = '$progress_rate'
WHERE project_id = '$project_id'";

$pdo->exec($sql);

echo json_encode([
    "message" => "進捗更新完了"
]);