import { useState } from "react";
import type { ProgressInputProps } from "../types";

const ProgressInput = ({ projectId, onUpdate }: ProgressInputProps) => {
  const [value, setValue] = useState("");

  const handleClick = () => {
    const num = Number(value);

    if (!value) {
      alert("進捗を入力してください");
      return;
    }

    if (num < 0 || num > 100) {
      alert("0〜100で入力してください");
      return;
    }

    onUpdate(projectId, num);
    setValue("");
  };

  return (
    <div className="flex items-center gap-1  mr-4">
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="進捗%"
        className="border border-gray-300 rounded-md px-3 h-9 w-32
               focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      <button
        onClick={handleClick}
        className="bg-indigo-500 text-white px-3 h-9 rounded-md text-sm
               hover:bg-indigo-600 transition"
      >
        更新
      </button>
    </div>
  );
};

export default ProgressInput;