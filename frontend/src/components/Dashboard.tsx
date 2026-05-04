import type { DashboardProps } from "./types";

const Dashboard = ({ projects, allProjects }: DashboardProps) => {
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

  const totalBudget = allProjects.reduce(
    (sum, p) => sum + Number(p.planned_amount ?? 0),
    0
  );

  return (
    <div className="bg-white rounded shadow-md p-5 mb-2">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

        <div className="bg-gray-200 rounded p-4 text-center">
          <p className="text-sm text-gray-700">総案件数</p>
          <p className="text-2xl font-bold text-gray-800">
            {totalProjects}
          </p>
        </div>

        <div className="bg-yellow-100 rounded p-4 text-center">
          <p className="text-sm text-yellow-700">一次承認待ち</p>
          <p className="text-2xl font-bold text-yellow-800">
            {firstApprovalCount}
          </p>
        </div>

        <div className="bg-blue-100 rounded p-4 text-center">
          <p className="text-sm text-blue-700">最終承認待ち</p>
          <p className="text-2xl font-bold text-blue-800">
            {finalApprovalCount}
          </p>
        </div>

        <div className="bg-green-100 rounded p-4 text-center">
          <p className="text-sm text-green-700">平均進捗</p>
          <p className="text-2xl font-bold text-green-800">
            {Math.round(averageProgress)}%
          </p>
        </div>

        <div className="bg-purple-100 rounded p-4 text-center">
          <p className="text-sm text-purple-700">総残予算</p>
          <p className="text-xl font-bold text-purple-800">
            {Math.round(totalBudget).toLocaleString()}円
          </p>
        </div>


      </div>
    </div>
  );
};

export default Dashboard;