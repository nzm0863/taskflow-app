<?php

header('Content-Type: application/json');

$pdo = new PDO(
    "mysql:host=mysql3107.db.sakura.ne.jp;dbname=nnzzm_p_management;charset=utf8mb4",
    "nnzzm_p_management",
    "nnzzm0863"
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