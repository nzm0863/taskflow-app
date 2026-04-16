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
    console.log(result);

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

  const pendingProjects = projects.filter(
    (project) => project.status === "申請中"
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

  const filteredProjects = projects.filter((project) =>
  project.project_name.includes(searchWord)
);

  return (
    <div className="min-h-screen bg-slate-200 p-8">
      <button
        className="mb-4 bg-gray-500 text-white px-4 py-2 rounded-md absolute right-10 top-7 hover:bg-gray-700 cursor-pointer transition-colors duration-200 ease-in-out"
        onClick={() => {
          localStorage.clear();
          setIsLoggedIn(false);
        }}
      >
        ログアウト
      </button>
      <h1 className="text-3xl font-bold mb-6">案件一覧</h1>
      <div className="bg-white border border-gray-300 p-4 rounded-md shadow-sm">

        <div className="bg-gray-100 p-4 rounded shadow mb-2">
          総案件数: {totalProjects}
        </div>

        <div className="bg-gray-100 p-4 rounded shadow mb-2">
          承認待ち: {pendingProjects}
        </div>

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

      <div className="grid gap-4">
        {filteredProjects.map((project) => (
          <div
            key={project.project_id}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold">
              {project.project_name}
            </h2>

            <p>{project.description}</p>
            <p className="font-medium text-gray-700">
              ステータス: {project.status}
            </p>
            <p>進捗: {project.progress_rate ?? 0}%</p>

            {project.status === "一次承認待ち" &&
              currentUserRole === "manager" && (
                <>
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700  cursor-pointer transition-colors duration-200 ease-in-out"
                    onClick={() =>
                      approveProject(project.project_id, "一次承認済み")
                    }
                  >
                    一次承認
                  </button>

                  <button
                    onClick={() =>
                      approveProject(project.project_id, "却下")
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded-md ml-2 cursor-pointer hover:bg-red-700"
                  >
                    却下
                  </button>
                </>
              )}

            {project.status === "一次承認済み" &&
              currentUserRole === "admin" && (
                <div>
                  <button
                    onClick={() =>
                      approveProject(project.project_id, "最終承認済み")
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