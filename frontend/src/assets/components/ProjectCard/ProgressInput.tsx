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
    <>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="進捗%"
        className="border p-2 mt-2 mr-2"
      />

      <button
        onClick={handleClick}
        className="bg-indigo-500 text-white px-4 py-2 rounded"
      >
        進捗更新
      </button>
    </>
  );
};

export default ProgressInput;