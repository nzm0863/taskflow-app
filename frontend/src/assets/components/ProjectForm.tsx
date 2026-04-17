import { useState } from "react";

type Props = {
  onSubmit: (name: string, description: string) => void;
};

const ProjectForm = ({ onSubmit }: Props) => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");

  const handleClick = () => {
    if (!projectName.trim() || !description.trim()) {
      alert("案件名と説明を入力してください");
      return;
    }

    onSubmit(projectName, description);

    setProjectName("");
    setDescription("");
  };

  return (
    <div className="bg-white border border-gray-300 p-4 rounded-md shadow-sm mb-8">
      <input
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        placeholder="案件名"
        className="border p-2 mr-2 rounded-md"
      />

      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="説明"
        className="border p-2 rounded-md"
      />

      <button onClick={handleClick} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 ml-5 cursor-pointer transition-colors duration-200 ease-in-out">
        追加
      </button>
    </div>
  );
};

export default ProjectForm;