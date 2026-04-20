<?php

header('Content-Type: application/json');

$pdo = new PDO(
    "mysql:host=mysql3107.db.sakura.ne.jp;dbname=nnzzm_p_management;charset=utf8mb4",
    "nnzzm_p_management",
    "nnzzm0863"
);

$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$project_id = $_POST['project_id'];
$progress_rate = $_POST['progress_rate'];
$comment = $_POST['comment'];

$sql = "INSERT INTO project_progress
(project_id, progress_rate, comment)
VALUES
('$project_id', '$progress_rate', '$comment')";

$pdo->exec($sql);

echo json_encode([
    "message" => "進捗登録成功"
]);