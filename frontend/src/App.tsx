import { useEffect, useState } from "react";
import type { Project } from "./components/types";
import type { Department } from "./components/types";
import ProjectCard from "./components/ProjectCard";
import Dashboard from "./components/Dashboard";
import ProjectForm from "./components/ProjectForm";
function App() {
  const API_BASE = "https://taskflow.nnzzm.com/backend";
  // const API_BASE = "http://localhost/development_management/quest_1/db.prod/";


  const [projects, setProjects] = useState<Project[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortType, setSortType] = useState("newest");
  const [currentDepartmentId, setCurrentDepartmentId] = useState<number | null>(null);
  const [currentUserName, setCurrentUserName] = useState("");
  const [mineFirst, setMineFirst] = useState(true);
  const [hideRejected, setHideRejected] = useState(false);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [viewType, setViewType] = useState<"mine" | "all" | "department">("mine");
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [hideCompleted, setHideCompleted] = useState(false);

  const allProjects = projects;

  const displayProjects =
    viewType === "mine"
      ? projects.filter(p => p.applicant_id === currentUserId)
      : viewType === "department"
        ? projects.filter(p => p.department_id === selectedDepartment)
        : projects;

  const [currentUserRole, setCurrentUserRole] =
    useState<string>("");
  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    const savedLogin = localStorage.getItem("isLoggedIn");
    const savedUserId = localStorage.getItem("user_id");
    const savedUserName = localStorage.getItem("user_name");
    const savedDepartmentId = localStorage.getItem("department_id");




    if (savedLogin === "true") {
      setIsLoggedIn(true);

      if (savedRole) setCurrentUserRole(savedRole);
      if (savedUserId) setCurrentUserId(Number(savedUserId));
      if (savedUserName) setCurrentUserName(savedUserName);
      if (savedDepartmentId)
        setCurrentDepartmentId(Number(savedDepartmentId));
    }

    if (savedRole === "manager") {
      setViewType("department");

    } else if (savedRole === "admin") {
      setViewType("all");

    } else {
      setViewType("mine");
    }
    setSelectedDepartment(
      Number(localStorage.getItem("department_id"))
    );

    fetch(`${API_BASE}/get_departments.php`)
      .then(res => res.json())
      .then(data => setDepartments(data));

    fetchProjects();
  }, []);



  const fetchProjects = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/get_projects.php`
      );
      if (!res.ok) {
        throw new Error("サーバーエラー");
      }

      const data = await res.json();

      setProjects(data);
    }
    catch (error) {
      console.error(error);
      alert("データ取得に失敗しました");
    }
  };



  const handleSubmit = async (
    name: string,
    desc: string,
    requestedAmount: number
  ) => {
    const response = await fetch(`${API_BASE}/add_project.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_name: name,
        description: desc,
        status: "一次承認待ち",
        applicant_id: currentUserId,
        requested_amount: requestedAmount,
      }),
    });

    const result = await response.json();
    alert(result.message);

    fetchProjects();
  };
  const approveProject = async (
    projectId: number,
    newStatus: string,
    reason: string = ""
  ) => {
    const response = await fetch(
      `${API_BASE}/approve_project.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: projectId,
          status: newStatus,
          reason: reason,
        }),
      }
    );
    const result = await response.json();
    console.log(result);
    fetchProjects();

  };
  const updateProgress = async (projectId: number, value: number) => {
    const response = await fetch(`${API_BASE}/update_progress.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_id: projectId,
        progress_rate: value,
      }),
    });

    const result = await response.json();
    console.log(result);

    fetchProjects();
  };




  const updateBudget = async (
    projectId: number,
    amount: number,
    category: string,
    note: string
  ) => {
    const res = await fetch(`${API_BASE}/update_budget.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // 🔥必須
      },
      body: JSON.stringify({
        projectId,
        amount,
        category,
        note,
      }),
    });

    const data = await res.json();
    console.log(data);

    fetchProjects();
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("メールアドレスとパスワードを入力してください");
      return;
    }

    if (!email.includes("@")) {
      setError("正しいメールアドレスを入力してください");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/login.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.message === "ログイン成功") {
        setError("");

        setIsLoggedIn(true);
        setCurrentUserRole(result.role);
        setCurrentDepartmentId(result.department_id);
        setCurrentUserName(result.user_name);
        setCurrentUserId(result.user_id);

        const departmentId = Number(result.department_id);

        setCurrentDepartmentId(departmentId);

        if (result.role === "manager") {
          setViewType("department");
          setSelectedDepartment(departmentId);

        } else if (result.role === "admin") {
          setViewType("all");

        } else {
          setViewType("mine");
        }

        localStorage.setItem("role", result.role);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user_id", String(result.user_id));
        localStorage.setItem("user_name", result.user_name);
        localStorage.setItem("department_id", String(result.department_id));
      } else {
        setError("メールアドレスまたはパスワードが違います");
      }
    } catch (e) {
      console.error(e);
      setError("通信エラーが発生しました");
    }
  };
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-gray-200 shadow-xl p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            ログイン
          </h1>

          <p className="text-sm text-gray-500 text-center mb-6">
            案件管理システムへようこそ
          </p>

          <div className="space-y-4">
            <input
              type="email"
              inputMode="email"
              pattern="[a-zA-Z0-9@._\-]+"
              placeholder="email"
              value={email}
              onChange={(e) => {
                const filtered = e.target.value.replace(/[^a-zA-Z0-9@._-]/g, "");
                setEmail(filtered);
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />

            <input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />

            {error && (
              <p className="text-red-500 text-sm mt-2 text-center">
                {error}
              </p>
            )}

            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer"
            >
              ログイン
            </button>
          </div>
        </div>
      </div>
    );
  }


  const baseFilteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.project_name.includes(searchWord);

    const matchesStatus =
      selectedStatus === "" ||
      project.status === selectedStatus;

    const matchesRejected =
      !hideRejected || project.status !== "却下";

    const matchesCompleted =
      !hideCompleted ||
      project.progress_rate !== 100;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesRejected &&
      matchesCompleted
    );
  });

  const filteredProjects =
    viewType === "mine"
      ? baseFilteredProjects.filter(p => p.applicant_id === currentUserId)
      : viewType === "department"
        ? baseFilteredProjects.filter(p => p.department_id === selectedDepartment)
        : baseFilteredProjects;

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const aDept =
      currentUserRole === "manager" &&
        a.department_id === currentDepartmentId ? 1 : 0;

    const bDept =
      currentUserRole === "manager" &&
        b.department_id === currentDepartmentId ? 1 : 0;

    if (aDept !== bDept) {
      return bDept - aDept;
    }

    if (mineFirst) {
      const aMine = a.applicant_id === currentUserId ? 1 : 0;
      const bMine = b.applicant_id === currentUserId ? 1 : 0;

      if (aMine !== bMine) {
        return bMine - aMine;
      }
    }

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

  const roleLabel =
    currentUserRole === "admin"
      ? "本部管理者"
      : currentUserRole === "manager"
        ? "部門責任者"
        : "申請者";

  console.log(
    projects.map(p => ({
      id: p.project_id,
      applicant_id: p.applicant_id
    }))
  );






  return (
    <div className="min-h-screen bg-slate-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto relative">
        <div className="absolute right-30 text-right">
          <p className="text-xs font-semibold md:text-sm">{currentUserName} さん</p>
          <p className="text-xs text-gray-600">{roleLabel}</p>
        </div>

        <button
          className="mb-4 bg-gray-500 text-white px-4 py-2 rounded-md absolute right-0  hover:bg-gray-700 cursor-pointer transition-colors duration-200 ease-in-out"
          onClick={() => {
            if (confirm("本当にログアウトしますか？")) {
              localStorage.removeItem("role");
              localStorage.removeItem("isLoggedIn");
              localStorage.removeItem("user_id");
              localStorage.removeItem("user_name");
              setIsLoggedIn(false);
            }
          }}
        >
          ログアウト
        </button>
        <h1 className="text-xl font-bold mb-6 md:mb-2 md:text-3xl">案件管理</h1>
        <div className="flex">
          <button
            onClick={() => setViewType("mine")}
            className={viewType === "mine" ? "bg-white text-black px-3 py-1" : "px-3 py-1 cursor-pointer"}
          >
            自分
          </button>

          <button
            onClick={() => setViewType("all")}
            className={viewType === "all" ? "bg-white text-black px-3 py-1" : "px-3 py-1 cursor-pointer"}
          >
            全体
          </button>
          {(currentUserRole === "admin" || currentUserRole === "manager") && (
            <>
              <button
                onClick={() => setViewType("department")}
                className={
                  viewType === "department"
                    ? "bg-white text-black px-3 py-1"
                    : "px-3 py-1 cursor-pointer"
                }
              >
                部署
              </button>

              {viewType === "department" && (
                <select
                  value={selectedDepartment ?? ""}
                  onChange={(e) => setSelectedDepartment(Number(e.target.value))}
                  className={`bg-white text-black px-3 py-1 cursor-pointer ${viewType === "department" ? "px-3 py-1 cursor-pointer" : ""}`}
                >
                  <option value="">部署選択</option>
                  {departments.map((d) => (
                    <option key={d.department_id} value={d.department_id}>
                      {d.department_name}
                    </option>
                  ))}
                </select>
              )}
            </>
          )}
        </div>
        <Dashboard
          projects={displayProjects}
          allProjects={allProjects}
        />


        <ProjectForm onSubmit={handleSubmit} />
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">

            <input
              type="text"
              placeholder="案件検索"
              className="border border-gray-400 rounded-md px-3 h-10 w-full lg:w-40
                 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
            />

            <select
              className="border border-gray-400 rounded-md px-3 h-10 w-full lg:w-34
                 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">全て</option>
              <option value="一次承認待ち">一次承認待ち</option>
              <option value="最終承認待ち">最終承認待ち</option>
              <option value="最終承認済み">承認済み</option>
              <option value="却下">却下</option>
            </select>

            <select
              className="border border-gray-400 rounded-md px-3 h-10 w-full lg:w-34
                 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="newest">新着順</option>
              <option value="progress">進捗順</option>
              <option value="budget">予算順</option>
            </select>

            <div className="flex flex-col sm:flex-row flex-column gap-2 sm:gap-4 lg:ml-4 xl:ml-30">

              <label className="text-sm text-gray-700 flex items-center">
                <input
                  type="checkbox"
                  checked={mineFirst}
                  onChange={(e) => setMineFirst(e.target.checked)}
                  className="mr-2"
                />
                自身の案件を上に表示
              </label>

              <label className="text-sm text-gray-700 flex items-center">
                <input
                  type="checkbox"
                  checked={hideRejected}
                  onChange={(e) => setHideRejected(e.target.checked)}
                  className="mr-2"
                />
                却下案件を非表示
              </label>

              <label className="text-sm text-gray-700 flex items-center">
                <input
                  type="checkbox"
                  checked={hideCompleted}
                  onChange={(e) => setHideCompleted(e.target.checked)}
                  className="mr-2"
                />
                完了済みを非表示
              </label>


            </div>

          </div>
        </div>



        {sortedProjects.map((project) => (
          <ProjectCard
            key={project.project_id}
            project={project}
            currentUserRole={currentUserRole}
            currentDepartmentId={currentDepartmentId}
            approveProject={approveProject}
            updateProgress={updateProgress}
            updateBudget={updateBudget}
            currentUserId={currentUserId}
            onRefresh={fetchProjects}
          />
        ))}
      </div>
    </div>

  );
}
export default App;