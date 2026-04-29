import type { ProjectCardProps } from "./types";
import ProgressInput from "./ProjectCard/ProgressInput";
import BudgetInput from "./ProjectCard/BudgetInput";
import { useState } from "react"



const ProjectCard = ({
  project,
  currentUserRole,
  currentDepartmentId,
  currentUserId,
  approveProject,
  updateProgress,
  updateBudget,



}: ProjectCardProps) => {
  const [open, setOpen] = useState(false);
  const isOwner =
    currentUserId === project.applicant_id;

  const canEdit =
    project.status === "最終承認済み" &&
    currentUserRole === "user" &&
    isOwner;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "一次承認待ち":
        return "bg-yellow-100 text-yellow-700";

      case "最終承認待ち":
        return "bg-blue-100 text-blue-700";

      case "最終承認済み":
        return "bg-green-100 text-green-700";

      case "却下":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };
  const isCompleted =
    project.progress_rate === 100 &&
    project.status === "最終承認済み";

  const progressColor = isCompleted
    ? "bg-green-500"
    : "bg-indigo-500";

  const handleClick = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) return;

    setOpen(!open);
  };
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 mt-3 border border-gray-200 hover:shadow-md transition">

      {/* タイトル */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">
          {project.project_name}
        </h2>

        <span className={`text-xs px-2 py-1 rounded ${getStatusStyle(project.status)}`}>
          {project.status}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 左 */}
        <div className="space-y-0">

          {/* 左：説明 */}
          <div
            onClick={handleClick}
            className={`text-sm text-gray-600 whitespace-pre-line hover:opacity-80 ${open ? "line-clamp-none" : "line-clamp-1"
              }`}
          >
            <span className="cursor-pointer">
              {project.description}
            </span>
          </div>


          <div className="flex justify-between items-start">
            {/* 金額 */}
            <div className="flex gap-8 text-base mt-2">

              <div>
                <p className="text-gray-400 text-sm">申請額</p>
                <p className="text-blue-600 font-medium">
                  {Number(project.requested_amount ?? 0).toLocaleString()}円
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">使用額</p>
                <p className="text-red-500 font-medium">
                  {Number(project.actual_amount ?? 0).toLocaleString()}円
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">残額</p>
                <p className="text-green-600 font-medium">
                  {Number(project.remains ?? 0).toLocaleString()}円
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              {canEdit ? (
                <div className="flex flex-col sm:flex-row gap-2">

                  <BudgetInput
                    projectId={project.project_id}
                    onUpdate={updateBudget}
                  />
                </div>
              ) : (
                <p className="text-xs text-gray-400">
                  {project.status !== "最終承認済み"
                    ? "最終承認後に予算管理が可能になります"
                    : "申請者本人のみ更新できます"}
                </p>
              )}
            </div>
          </div>
        </div>


        {/* 右 */}
        <div className="space-y-1 w-full">
          {/* 進捗 */}
          <div className="relative">
            <div className="flex justify-between text-sm">
              <span>進捗</span>
              <span>{project.progress_rate ?? 0}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`${progressColor} h-3 rounded-full transition-all`}
                style={{ width: `${project.progress_rate ?? 0}%` }}
              />
            </div>

            {project.progress_rate === 100 &&
              project.status === "最終承認済み" && (
                <p className="text-green-600 text-sm mt-1 w-full text-right absolute top-8">✅ 完了</p>
              )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {canEdit ? (
              <div className="flex flex-col sm:flex-row gap-2">
                <ProgressInput
                  projectId={project.project_id}
                  onUpdate={updateProgress}
                />
              </div>
            ) : (
              <p className="text-xs text-gray-400">
                {project.status !== "最終承認済み"
                  ? "最終承認後に進捗更新が可能になります"
                  : "申請者本人のみ更新できます"}
              </p>
            )}
          </div>
          {/* ボタン */}
          <div className="flex gap-2 flex-wrap justify-end -mt-6">
            {/* 一次承認 */}
            {project.status === "一次承認待ち" &&
              currentUserRole === "manager" &&
              currentDepartmentId === project.department_id && (
                <>
                  <button
                    className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
                    onClick={() => {
                      if (confirm("本当に承認しますか？")) {
                        approveProject(project.project_id, "最終承認待ち");
                      }
                    }}
                  >
                    一次承認
                  </button>

                  <button
                    className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700"
                    onClick={() => {
                      if (confirm("本当に却下しますか？")) {
                        const reason = prompt("却下理由を入力してください");
                        if (!reason?.trim()) return;
                        approveProject(project.project_id, "却下", reason);
                      }
                    }}
                  >
                    却下
                  </button>
                </>
              )}

            {/* 最終承認 */}
            {project.status === "最終承認待ち" &&
              currentUserRole === "admin" && (
                <>
                  <button
                    className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
                    onClick={() => {
                      if (confirm("本当に承認しますか？")) {
                        approveProject(project.project_id, "最終承認済み");
                      }
                    }}
                  >
                    最終承認
                  </button>

                  <button
                    className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700"
                    onClick={() => {
                      if (confirm("本当に却下しますか？")) {
                        const reason = prompt("却下理由を入力してください");
                        if (!reason?.trim()) return;
                        approveProject(project.project_id, "却下", reason);
                      }
                    }}
                  >
                    却下
                  </button>
                </>
              )}
          </div>
        </div>
      </div>
    </div >
  );
};

export default ProjectCard;

