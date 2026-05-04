import { useEffect, useState, useCallback } from "react";

import type { BudgetHistory } from "../types";

type Props = {
  projectId: number;
  onRefresh: () => void;
};

const BudgetHistoryList = ({ projectId, onRefresh }: Props) => {
  const API_BASE = "https://www.nnzzm.com/project_management/backend";
  const [history, setHistory] = useState<BudgetHistory[]>([]);
  const [open, setOpen] = useState(false);

  const fetchHistory = useCallback(async () => {
    const res = await fetch(`${API_BASE}/get_budget_history.php?project_id=${projectId}`);
    const data = await res.json();
    setHistory(data);
  }, [projectId]);

  useEffect(() => {
    if (open) fetchHistory();
  }, [open, fetchHistory]);

  const deleteHistory = async (historyId: number) => {
    if (!confirm("削除しますか？")) return;
    await fetch(`${API_BASE}/delete_budget_history.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({id: historyId})
    });
    console.log(history);

    fetchHistory(); // ← 再取得
    onRefresh();
  };

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen(!open)}
        className="text-xs text-blue-500"
      >
        {open ? "履歴を閉じる" : "履歴を見る"}
      </button>

      {open && (
        <div className="mt-2 text-xs bg-gray-50 p-2 rounded">
          {history.length === 0 ? (
            <p>履歴なし</p>
          ) : (
            history.map((h) => (
              <div key={h.id} className="flex justify-between items-center border-b py-1">

                <span>{h.category}</span>
                <span>{h.amount}円</span>
                <span>{h.note}</span>
                <span>{new Date(h.created_at).toLocaleString()}</span>

                <button
                  onClick={() => deleteHistory(h.id)}
                  className="text-red-500 hover:text-red-700 ml-2"
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