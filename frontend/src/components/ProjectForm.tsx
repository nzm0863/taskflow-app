import { useState } from "react";

type Props = {
  onSubmit: (
    name: string,
    description: string,
    requestedAmount: number
  ) => void;
};

const ProjectForm = ({ onSubmit }: Props) => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [requestedAmount, setRequestedAmount] = useState("");

  const handleClick = () => {
    if (!projectName.trim() || !description.trim()) {
      alert("案件名と説明を入力してください");
      return;
    }

    if (!requestedAmount || Number(requestedAmount) <= 0) {
      alert("申請予算を入力してください");
      return;
    }

    onSubmit(
      projectName,
      description,
      Number(requestedAmount)
    );

    setProjectName("");
    setDescription("");
    setRequestedAmount("");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-6 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">

        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="案件名"
          className="md:col-span-3 border rounded-md px-3 h-10"
        />

        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="説明"
          className="md:col-span-4 border rounded-md px-3 h-10"
        />

        <input
          type="number"
          value={requestedAmount}
          onChange={(e) => setRequestedAmount(e.target.value)}
          placeholder="申請予算"
          className="md:col-span-2 border rounded-md px-3 h-10"
        />

        <button
          onClick={handleClick}
          className="md:col-span-3 bg-blue-600 text-white h-10 px-4 rounded-md hover:bg-blue-700"
        >
          新規案件の申請
        </button>

      </div>
    </div>
  );
};

export default ProjectForm; 