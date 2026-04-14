<?php

header('Content-Type: application/json');

$host = "localhost";
$dbname = "development_management";
$username = "root";
$password = "NZMtomjerry0863";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8",
        $username,
        $password
    );

    $sql = "SELECT * FROM budget";
    $stmt = $pdo->query($sql);

    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($users);

} catch (PDOException $e) {
    echo json_encode([
        "error" => $e->getMessage()
    ]);
}