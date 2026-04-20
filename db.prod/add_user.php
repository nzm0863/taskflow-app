<?php

header('Content-Type: application/json');

$host = "mysql3107.db.sakura.ne.jp";
$dbname = "nnzzm_p_management";
$username = "nnzzm_p_management";
$password = "nnzzm0863";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8",
        $username,
        $password
    );

    $user_name = $_POST['user_name'];
    $email = $_POST['email'];
    $password_hash = $_POST['password_hash'];
    $role = $_POST['role'];
    $department_id = $_POST['department_id'];

    $sql = "INSERT INTO users 
    (user_name, email, password_hash, role, department_id)
    VALUES 
    ('$user_name', '$email', '$password_hash', '$role', '$department_id')";

    $pdo->exec($sql);

    echo json_encode([
        "message" => "ユーザー追加成功"
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "error" => $e->getMessage()
    ]);
}