import { useState } from "react";
import type { BudgetInputProps } from "../types";

const BudgetInput = ({ projectId, onUpdate }: BudgetInputProps) => {
  const [value, setValue] = useState("");

  const handleClick = () => {
    const num = Number(value);

    if (!value) {
      alert("使用額を入力してください");
      return;
    }

    if (num < 0) {
      alert("0以上で入力してください");
      return;
    }

    onUpdate(projectId, num);
    setValue("");
  };

  return (
    <>
      <input
        type="number"
        placeholder="使用額"
        className="border p-2 mt-2 mr-2"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <button
        onClick={handleClick}
        className="bg-amber-700 text-white px-4 py-2 rounded cursor-pointer hover:bg-amber-800 transition-colors duration-200 ease-in-out"
      >
        予算更新
      </button>
    </>
  );
};

export default BudgetInput;