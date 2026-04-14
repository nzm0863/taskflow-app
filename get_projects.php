<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$pdo = new PDO(
    "mysql:host=localhost;dbname=development_management;charset=utf8",
    "root",
    "NZMtomjerry0863"
);

$sql = "SELECT * FROM projects";

$stmt = $pdo->query($sql);

$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($data);