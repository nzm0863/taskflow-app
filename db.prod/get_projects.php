<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$env = parse_ini_file('/home/nnzzm/.env');

$host = $env['DB_HOST'];
$dbname = $env['DB_NAME'];
$user = $env['DB_USER'];
$pass = $env['DB_PASS'];
$charset = $env['DB_CHARSET'];

$pdo = new PDO(
  "mysql:host={$host};dbname={$dbname};charset={$charset}",
  $user,
  $pass
);

$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$sql = "
SELECT 
    projects.*,
    users.user_name,
    users.department_id,
    departments.department_name,

    project_progress.progress_rate,
    project_progress.updated_at AS progress_updated_at,

    budget.requested_amount,
    budget.planned_amount,
    budget.remains,
    budget.updated_at AS budget_updated_at,

    COALESCE(bh.actual_amount, 0) AS actual_amount

FROM projects

LEFT JOIN users
ON projects.applicant_id = users.user_id

LEFT JOIN departments
ON users.department_id = departments.department_id

LEFT JOIN project_progress
ON projects.project_id = project_progress.project_id

LEFT JOIN (
    SELECT project_id, SUM(amount) AS actual_amount
    FROM budget_history
    GROUP BY project_id
) AS bh
ON projects.project_id = bh.project_id

LEFT JOIN (
    SELECT *
    FROM budget b1
    WHERE updated_at = (
        SELECT MAX(updated_at)
        FROM budget b2
        WHERE b1.project_id = b2.project_id
    )
) AS budget
ON projects.project_id = budget.project_id
";
$stmt = $pdo->query($sql);
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($data);