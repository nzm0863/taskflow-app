<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$env = parse_ini_file('/home/nnzzm/.env');

$pdo = new PDO(
  "mysql:host={$env['DB_HOST']};dbname={$env['DB_NAME']};charset={$env['DB_CHARSET']}",
  $env['DB_USER'],
  $env['DB_PASS']
);

$sql = "SELECT department_id, department_name FROM departments";
$stmt = $pdo->query($sql);

$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($data);