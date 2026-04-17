<?php

header('Content-Type: application/json');

$pdo = new PDO(
    "mysql:host=localhost;dbname=development_management;charset=utf8",
    "root",
    ""
);

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