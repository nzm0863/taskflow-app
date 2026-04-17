import type { DashboardProps } from "./types";

const Dashboard = ({ projects }: DashboardProps) => {
  const totalProjects = projects.length;

  const firstApprovalCount = projects.filter(
    (p) => p.status === "一次承認待ち"
  ).length;

  const finalApprovalCount = projects.filter(
    (p) => p.status === "最終承認待ち"
  ).length;

  const averageProgress =
    projects.reduce((sum, p) => sum + (p.progress_rate ?? 0), 0) /
    (projects.length || 1);

  const totalRemainingBudget = projects.reduce(
    (sum, project) => sum + Number(project.remains ?? 0),
    0
  );

  return (
    <div className="bg-gray-100 p-4 rounded mb-4">
      <div>総案件数: {totalProjects}</div>
      <div>一次承認待ち: {firstApprovalCount}</div>
      <div>最終承認待ち: {finalApprovalCount}</div>
      <div>平均進捗: {Math.round(averageProgress)}%</div>
      <div>総残予算: {Math.round(totalRemainingBudget)}円</div>
    </div>
  );
};

export default Dashboard;