<?php

header('Content-Type: application/json');

$host = "mysql3107.db.sakura.ne.jp;";
$dbname = "nnzzm_p_management";
$username = "nnzzm_p_management";
$password = "nnzzm0863";

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