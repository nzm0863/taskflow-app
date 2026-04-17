import type { ProjectCardProps } from "./types";
import ProgressInput from "./ProjectCard./ProgressInput";
const ProjectCard = ({
  project,
  currentUserRole,
  approveProject,
  updateProgress,
  updateBudget,
}: ProjectCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2
        className={`text-xl font-bold p-2 rounded ${project.status === "却下"
          ? "text-red-500 bg-red-100"
          : project.status === "最終承認済み"
            ? "text-blue-500 bg-blue-100"
            : ""
          }`}
      >
        {project.project_name}
      </h2>

      <p>{project.description}</p>
      <p className="font-medium text-gray-700">
        ステータス: {project.status}
      </p>
      <p>進捗: {project.progress_rate ?? 0}%</p>
      {project.progress_rate === 100 && <p>✅ 完了済み</p>}

      {project.status === "一次承認待ち" &&
        currentUserRole === "manager" && (
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
                  approveProject(project.project_id, "却下")
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
              onClick={() =>
                approveProject(project.project_id, "却下")
              }
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
      <p>予算: {project.planned_amount ?? 0}円</p>
      <p>使用: {project.actual_amount ?? 0}円</p>
      <p>残額: {project.remains ?? 0}円</p>

      <input
        type="number"
        placeholder="使用額"
        className="border p-2 mt-2 mr-2"
        value={budgetInputs[project.project_id] || ""}
        onChange={(e) =>
          setBudgetInputs({
            ...budgetInputs,
            [project.project_id]: e.target.value,
          })
        }
      />

      <button
        onClick={() => updateBudget(project.project_id)}
        className="bg-amber-700 text-white px-4 py-2 rounded cursor-pointer hover:bg-amber-800 transition-colors duration-200 ease-in-out"
      >
        予算更新
      </button>
    </div>
  );
};

export default ProjectCard;

