import { useEffect, useState, useCallback } from "react";

import type { BudgetHistory } from "../types";

type Props = {
  projectId: number;
  refreshKey: number;
  onRefresh: () => void;
};

const BudgetHistoryList = ({ projectId, refreshKey, onRefresh }: Props) => {
  const API_BASE = "https://www.nnzzm.com/project_management/backend";
  const [history, setHistory] = useState<BudgetHistory[]>([]);
  const [open, setOpen] = useState(false);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/get_budget_history.php?project_id=${projectId}`);
      
      if (!res.ok) throw new Error();
      const data = await res.json();
      setHistory(data);
    } catch {
      alert("追加に失敗しました");
    }
  }, [projectId]);

  useEffect(() => {
    if (open) fetchHistory();
  }, [open, fetchHistory, refreshKey]);



  const deleteHistory = async (historyId: number) => {
    try {
      if (!confirm("削除しますか？")) return;
      const res = await fetch(`${API_BASE}/delete_budget_history.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: historyId })
      });
      if (!res.ok) throw new Error();

      await res.json();

      fetchHistory();
      onRefresh();
    } catch {
      alert("削除に失敗しました");
    }
  };

  return (
    <div className="mt-0">
      <button
        onClick={() => setOpen(!open)}
        className="text-xs text-blue-500 cursor-pointer"
      >
        {open ? "履歴を閉じる" : "履歴を見る"}
      </button>

      {open && (
        <div className="text-xs bg-gray-50 p-2 rounded">
          {history.length === 0 ? (
            <p>履歴なし</p>
          ) : (
            history.map((h) => (
              <div key={h.id} className="grid grid-cols-[40px_40px_60px_50px_10px] sm:grid-cols-[60px_100px_230px_100px_20px] gap-2 items-center border-b py-1">

                <span className="truncate">{h.category}</span>
                <span className="font-medium text-gray-900">{Number(h.amount).toLocaleString()}円</span>
                <span className="truncate">{h.note}</span>
                <span>{new Date(h.created_at).toLocaleString()}</span>

                <button
                  onClick={() => deleteHistory(h.id)}
                  className="text-red-500 hover:text-red-700 text-lg cursor-pointer"
                >
                  ×
                </button>

              </div>

            ))
          )}
        </div>
      )}
      { }
    </div>
  );
};

export default BudgetHistoryList;