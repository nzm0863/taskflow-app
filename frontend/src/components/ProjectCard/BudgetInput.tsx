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
    <div className="flex items-center gap-1">
      <input
        type="number"
        placeholder="使用額"
        className="border border-gray-300 rounded-md px-3 h-9 w-32
               focus:outline-none focus:ring-2 focus:ring-amber-400"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <button
        onClick={handleClick}
        className="bg-amber-600 text-white px-3 h-9 rounded-md text-sm
               hover:bg-amber-700 transition"
      >
        更新
      </button>
    </div>
  );
};

export default BudgetInput;