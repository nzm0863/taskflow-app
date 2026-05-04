<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

$env = parse_ini_file('/home/nnzzm/.env');

$pdo = new PDO(
  "mysql:host={$env['DB_HOST']};dbname={$env['DB_NAME']};charset={$env['DB_CHARSET']}",
  $env['DB_USER'],
  $env['DB_PASS']
);

$project_id = $_GET['project_id'];

$sql = "
SELECT id, amount, category, note, created_at
FROM budget_history
WHERE project_id = ?
ORDER BY created_at DESC
";

$stmt = $pdo->prepare($sql);
$stmt->execute([$project_id]);

$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($data);