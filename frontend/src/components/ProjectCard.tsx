import type { ProjectCardProps } from "./types";
import ProgressInput from "./ProjectCard/ProgressInput";
import BudgetInput from "./ProjectCard/BudgetInput";

const ProjectCard = ({
  project,
  currentUserRole,
  currentDepartmentId,
  approveProject,
  updateProgress,
  updateBudget,


}: ProjectCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-4">
      <h2
        className={`text-xl font-bold p-2 rounded ${project.status === "却下"
          ? "text-red-500 bg-red-100"
          : project.status === "最終承認済み"
            ? "text-green-600 bg-green-100"
            : project.status === "最終承認待ち"
              ? "text-blue-600 bg-blue-100"
              : project.status === "一次承認待ち"
                ? "text-yellow-700 bg-yellow-100"
                : ""
          }`}
      >
        {project.project_name}
      </h2>

      <p className="whitespace-pre-line">{project.description}</p>
      <p className="font-medium text-gray-700">
        ステータス: {project.status}
      </p>
      <p>進捗: {project.progress_rate ?? 0}%</p>
      {project.progress_rate === 100 && project.status === "最終承認済み" && <p>✅ 完了済み</p>}

      {project.status === "一次承認待ち" &&
        currentUserRole === "manager" &&
        currentDepartmentId === project.department_id && (
          <>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700  cursor-pointer transition-colors duration-200 ease-in-out"
              onClick={() => {
                if (confirm("本当に承認しますか？")) {
                  approveProject(project.project_id, "最終承認待ち")
                }
              }}
            >
              一次承認
            </button>

            <button
              onClick={() => {
                if (confirm("本当に却下しますか？")) {

                  const reason = prompt("却下理由を入力してください");

                  if (!reason?.trim()) return;

                  approveProject(
                    project.project_id,
                    "却下",
                    reason
                  );
                }
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-md ml-2 cursor-pointer hover:bg-red-700"
            >
              却下
            </button>

          </>

        )}

      {project.status === "最終承認待ち" &&
        currentUserRole === "admin" && (
          <div>
            <button
              onClick={() => {
                if (confirm("本当に承認しますか？")) {
                  approveProject(project.project_id, "最終承認済み")
                }
              }
              }
              className="bg-blue-600 text-white px-4 py-2 rounded mt-2 transition-colors duration-200 ease-in-out hover:bg-blue-700 cursor-pointer"

            >
              最終承認
            </button>
            <button
              onClick={() => {
                if (confirm("本当に却下しますか？")) {

                  const reason = prompt("却下理由を入力してください");

                  if (!reason?.trim()) return;

                  approveProject(
                    project.project_id,
                    "却下",
                    reason
                  );
                }
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-md ml-2 cursor-pointer hover:bg-red-700"
            >
              却下
            </button>
          </div>
        )}
      <ProgressInput
        projectId={project.project_id}
        onUpdate={updateProgress}
      />
      <p className="text-blue-700">
        申請予算: {Number(project.requested_amount ?? 0).toLocaleString()}円
      </p>

      <p className="text-red-600">
        使用額: {Number(project.actual_amount ?? 0).toLocaleString()}円
      </p>

      <p className="text-green-700">
        残額: {Number(project.remains ?? 0).toLocaleString()}円
      </p>

      <BudgetInput
        projectId={project.project_id}
        onUpdate={updateBudget}
      />

    </div>
  );
};

export default ProjectCard;

