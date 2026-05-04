import { useState } from "react";
import type { BudgetInputProps } from "../types";

const BudgetInput = ({ projectId, onUpdate }: BudgetInputProps) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("部品代");
  const [note, setNote] = useState("");

  const handleClick = () => {
    const num = Number(amount);

    if (!amount) {
      alert("金額を入力してください");
      return;
    }

    if (num <= 0) {
      alert("1以上で入力してください");
      return;
    }

    // 🔥 ここが重要（全部渡す）
    onUpdate(projectId, num, category, note);

    // リセット
    setAmount("");
    setNote("");
  };

  return (
    <div className="flex flex-wrap items-center gap-2">

      {/* 用途 */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border rounded px-2 h-9"
      >
        <option value="部品代">部品代</option>
        <option value="外注費">外注費</option>
        <option value="交通費">交通費</option>
        <option value="その他">その他</option>
      </select>

      {/* 詳細 */}
      <input
        placeholder="詳細（任意）"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="border rounded px-2 h-9 w-40"
      />

      {/* 金額 */}
      <input
        type="number"
        placeholder="金額"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border border-gray-300 rounded-md px-3 h-9 w-28
               focus:outline-none focus:ring-2 focus:ring-amber-400"
      />

      <button
        onClick={handleClick}
        className="bg-amber-600 text-white px-3 h-9 rounded-md text-sm
               hover:bg-amber-700 transition"
      >
        追加
      </button>
    </div>
  );
};

export default BudgetInput;