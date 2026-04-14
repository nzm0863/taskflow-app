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

    $email = $_POST['email'];
    $input_password = $_POST['password'];

    $sql = "SELECT * FROM users WHERE email = '$email'";
    $stmt = $pdo->query($sql);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && $user['password_hash'] === $input_password) {
        echo json_encode([
            "message" => "ログイン成功",
            "user" => $user
        ]);
    } else {
        echo json_encode([
            "message" => "ログイン失敗"
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        "error" => $e->getMessage()
    ]);
}