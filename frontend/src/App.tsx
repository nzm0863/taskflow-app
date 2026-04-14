import { useEffect, useState } from "react";

type Project = {
  project_id: number;
  project_name: string;
  description: string;
  status: string;
};

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");

  const fetchProjects = async () => {
    const res = await fetch(
      "http://localhost/development_management/backend/get_projects.php"
    );

    const data = await res.json();

    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async () => {
    const response = await fetch(
      "http://localhost/development_management/backend/add_project.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_name: projectName,
          description: description,
          status: "申請中",
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

  const approveProject = async (projectId: number) => {
  const response = await fetch(
    "http://localhost/development_management/backend/approve_project.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_id: projectId,
      }),
    }
  );

  const result = await response.json();

  console.log(result);

  fetchProjects();
};

  return (
    <div className="min-h-screen bg-gray-100 p-8">
    <h1 className="text-3xl font-bold mb-6">案件一覧</h1>

    <div className="bg-white p-4 rounded shadow mb-8">
      <input
        className="border p-2 mr-2"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        placeholder="案件名"
      />

      <input
        className="border p-2 mr-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="説明"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        追加
      </button>
    </div>

    <div className="grid gap-4">
      {projects.map((project) => (
        <div
          key={project.project_id}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-bold">
            {project.project_name}
          </h2>

          <p>{project.description}</p>
          <p>{project.status}</p>

          {project.status !== "承認済み" && (
        <button
          onClick={() => approveProject(project.project_id)}
          className="bg-green-500 text-white px-4 py-2 rounded mt-2"
        >
          承認
        </button>
      )}
        </div>
      ))}
      
    </div>
  </div>
  );
}
export default App;