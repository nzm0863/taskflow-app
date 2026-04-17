import { useEffect, useState } from "react";

type Project = {
  project_id: number;
  project_name: string;
  description: string;
  status: string;
  progress_rate?: number;
  planned_amount?: number;
  actual_amount?: number;
  remains?: number;
};

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [progressInputs, setProgressInputs] = useState<{ [key: number]: string }>({});
  const [budgetInputs, setBudgetInputs] =
    useState<{ [key: number]: string }>({});

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortType, setSortType] = useState("");
  const [currentUserRole, setCurrentUserRole] =
    useState<string>("");
  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    const savedLogin = localStorage.getItem("isLoggedIn");

    if (savedLogin === "true" && savedRole) {
      setIsLoggedIn(true);
      setCurrentUserRole(savedRole);
    }
  }, []);

  const fetchProjects = async () => {
    const res = await fetch(
      "http://localhost/development_management/quest_1/backend/get_projects.php"
    );

    const data = await res.json();

    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async () => {
    if (!projectName.trim() || !description.trim()) {
      alert("案件名と説明を入力してください");
      return;
    }
    const response = await fetch(
      "http://localhost/development_management/quest_1/backend/add_project.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_name: projectName,
          description: description,
          status: "一次承認待ち",
          applicant_id: 1,
        }),
      }
    );

    const result = await response.json();
    alert(result.message);

    await fetchProjects();

    setProjectName("");
    setDescription("");
  };

  const approveProject = async (
    projectId: number,
    newStatus: string
  ) => {
    const response = await fetch(
      "http://localhost/development_management/quest_1/backend/approve_project.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: projectId,
          status: newStatus,
        }),
      }
    );

    const result = await response.json();

    console.log(result);

    fetchProjects();
  };

  const updateProgress = async (projectId: number) => {

    const progress = Number(progressInputs[projectId]);
    if (!progressInputs[projectId]) {
      alert("進捗を入力してください");
      return;
    }

    if (progress < 0 || progress > 100) {
      alert("進捗は0〜100で入力してください");
      return;
    }
    const response = await fetch(
      "http://localhost/development_management/quest_1/backend/update_progress.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: projectId,
          progress_rate: progressInputs[projectId],
        }),
      }
    );


    const result = await response.json();

    console.log(result);

    fetchProjects();
  };

  const updateBudget = async (projectId: number) => {
    if (!budgetInputs[projectId]) {
      alert("使用額を入力してください");
      return;
    }
    const response = await fetch(
      "http://localhost/development_management/quest_1/backend/update_budget.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: projectId,
          actual_amount: budgetInputs[projectId],
        }),
      }
    );

    const result = await response.json();

    console.log(result);

    fetchProjects();
  };

  const handleLogin = async () => {
    const response = await fetch(
      "http://localhost/development_management/quest_1/backend/login.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const result = await response.json();

    console.log(result);


    if (result.message === "ログイン成功") {
      setIsLoggedIn(true);
      setCurrentUserRole(result.role);

      localStorage.setItem("role", result.role);
      localStorage.setItem("isLoggedIn", "true");
    }
  };

  if (!isLoggedIn) {
    return (
      <div>
        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>
          ログイン
        </button>

      </div>
    );

  }
  const totalProjects = projects.length;

  const firstApprovalCount = projects.filter(
    (project) => project.status === "一次承認待ち"
  ).length;

  const finalApprovalCount = projects.filter(
    (project) => project.status === "最終承認待ち"
  ).length;

  const averageProgress =
    projects.length > 0
      ? Math.round(
        projects.reduce(
          (sum, project) => sum + (project.progress_rate ?? 0),
          0
        ) / projects.length
      )
      : 0;

  const totalRemainingBudget = projects.reduce(
    (sum, project) => sum + Number(project.remains ?? 0),
    0
  );

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.project_name.includes(searchWord);

    const matchesStatus =
      selectedStatus === "" ||
      project.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortType === "progress") {
      return (b.progress_rate ?? 0) - (a.progress_rate ?? 0);
    }

    if (sortType === "budget") {
      return (b.remains ?? 0) - (a.remains ?? 0);
    }

    if (sortType === "newest") {
      return b.project_id - a.project_id;
    }

    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-200 p-8">
      <button
        className="mb-4 bg-gray-500 text-white px-4 py-2 rounded-md absolute right-10 top-7 hover:bg-gray-700 cursor-pointer transition-colors duration-200 ease-in-out"
        onClick={() => {
          if (confirm("本当にログアウトしますか？")) {
            localStorage.clear();
            setIsLoggedIn(false);
          }
        }}
      >
        ログアウト
      </button>
      <h1 className="text-3xl font-bold mb-6">案件一覧</h1>
      <div className="bg-white border border-gray-300 p-4 rounded-md shadow-sm">

        <div className="bg-gray-100 p-4 rounded shadow mb-2">
          総案件数: {totalProjects}
        </div>

        <div className="bg-gray-100 p-4 rounded shadow mb-2">一次承認待ち: {firstApprovalCount}</div>
        <div className="bg-gray-100 p-4 rounded shadow mb-2">最終承認待ち: {finalApprovalCount}</div>

        <div className="bg-gray-100 p-4 rounded shadow mb-2">
          平均進捗: {averageProgress}%
        </div>

        <div className="bg-gray-100 p-4 rounded shadow">
          総残予算: {Math.round(totalRemainingBudget)}円
        </div>

      </div>

      <div className="bg-white border border-gray-300 p-4 rounded-md shadow-sm mb-8">
        <input
          className="bg-white border border-gray-300 rounded-md shadow-sm p-3 w-70"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="案件名"
        />

        <input
          className="bg-white border border-gray-300 rounded-md shadow-sm p-3 w-70"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="説明"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 ml-5 cursor-pointer transition-colors duration-200 ease-in-out"
        >
          追加
        </button>
      </div>

      <input
        type="text"
        placeholder="案件検索"
        className="border p-2 rounded mb-4"
        value={searchWord}
        onChange={(e) => setSearchWord(e.target.value)}
      />

      <select
        className="border p-2 rounded ml-2"
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
      >
        <option value="">全て</option>
        <option value="一次承認待ち">一次承認待ち</option>
        <option value="二次承認待ち">二次承認待ち</option>
        <option value="承認済み">承認済み</option>
        <option value="却下">却下</option>
      </select>
      <select
        className="border p-2 rounded ml-2"
        value={sortType}
        onChange={(e) => setSortType(e.target.value)}
      >
        <option value="">並び替えなし</option>
        <option value="progress">進捗順</option>
        <option value="budget">予算順</option>
        <option value="newest">新着順</option>
      </select>

      <div className="grid gap-4">
        {sortedProjects.map((project) => (
          <div
            key={project.project_id}
            className="bg-white rounded-xl shadow-md p-6"
          >
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
            <input
              type="number"
              min="0"
              max="100"
              placeholder="進捗%"
              className="border p-2 mt-2 mr-2"
              value={progressInputs[project.project_id] || ""}
              onChange={(e) =>
                setProgressInputs({
                  ...progressInputs,
                  [project.project_id]: e.target.value,
                })
              }
            />

            <button
              onClick={() => updateProgress(project.project_id)}
              className="bg-indigo-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-indigo-600 transition-colors duration-200 ease-in-out"
            >
              進捗更新
            </button>
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

        ))}



      </div>

    </div>

  );
}
export default App;