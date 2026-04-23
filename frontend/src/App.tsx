import { useEffect, useState } from "react";
import type { Project } from "./assets/components/types";
import ProjectCard from "./assets/components/ProjectCard";
import Dashboard from "./assets/components/Dashboard";
import ProjectForm from "./assets/components/ProjectForm";
function App() {
  const API_BASE = "https://www.nnzzm.com/project_management/backend";
  // const API_BASE = "http://localhost/development_management/quest_1/db.prod/";


  const [projects, setProjects] = useState<Project[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortType, setSortType] = useState("");
  const [currentDepartmentId, setCurrentDepartmentId] = useState<number | null>(null);
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
      `${API_BASE}/get_projects.php`
    );

    const data = await res.json();

    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (name: string, desc: string) => {
    const response = await fetch(`${API_BASE}/add_project.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_name: name,
        description: desc,
        status: "一次承認待ち",
        applicant_id: 1,
      }),
    });

    const result = await response.json();
    alert(result.message);

    fetchProjects();
  };
  const approveProject = async (
    projectId: number,
    newStatus: string
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




  const updateBudget = async (projectId: number, value: number) => {
    const response = await fetch(`${API_BASE}/update_budget.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_id: projectId,
        actual_amount: value,
      }),
    });

    const result = await response.json();
    console.log(result);

    fetchProjects();
  };

  const handleLogin = async () => {
    const response = await fetch(
      `${API_BASE}/login.php`,
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
      setCurrentDepartmentId(result.department_id);

      localStorage.setItem("role", result.role);
      localStorage.setItem("isLoggedIn", "true");
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
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />

          <input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />

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
      <Dashboard projects={projects} />

      <ProjectForm onSubmit={handleSubmit} />

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


      {sortedProjects.map((project) => (
        <ProjectCard
          key={project.project_id}
          project={project}
          currentUserRole={currentUserRole}
          currentDepartmentId={currentDepartmentId}
          approveProject={approveProject}
          updateProgress={updateProgress}
          updateBudget={updateBudget}
        />
      ))}
    </div>
  );
}
export default App;