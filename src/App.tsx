import { useEffect, useMemo, useState } from "react";
import type { Debt } from "./models/Debt";
import { loadDebts, saveDebts } from "./storage/debtsStorage";
import DebtsList from "./pages/DebtsList";
import NewDebt from "./pages/NewDebt";
import "./styles/app.css";

type Screen = "list" | "form";

export default function App() {
  const [screen, setScreen] = useState<Screen>("list");
  const [debts, setDebts] = useState<Debt[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setDebts(loadDebts());
  }, []);

  useEffect(() => {
    saveDebts(debts);
  }, [debts]);

  const editingDebt = useMemo(
    () => debts.find((d) => d.id === editingId) ?? null,
    [debts, editingId]
  );

  const openCreate = () => {
    setEditingId(null);
    setScreen("form");
  };

  const openEdit = (id: string) => {
    setEditingId(id);
    setScreen("form");
  };

  const backToList = () => {
    setScreen("list");
  };

  const createDebt = (debt: Debt) => {
    setDebts((prev) => [debt, ...prev]);
  };

  const updateDebt = (updated: Debt) => {
    setDebts((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  };

  const deleteDebt = (id: string) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  };

  const todayISO = () => new Date().toISOString().slice(0, 10);

  const toggleInstallment = (id: string, index: number) => {
    setDebts((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;

        const total = Math.max(0, d.quantity ?? 0);
        if (total === 0) return d;

        const currentPaid = Math.max(0, Math.min(d.paid ?? 0, total));
        const isAlreadyDone = currentPaid >= total;

        // ✅ si ya está finalizado, no permitimos desmarcar (mantiene endDate coherente)
        if (isAlreadyDone) return d;

        // solo permite “marcar hacia adelante”
        const newPaid = Math.max(currentPaid, index + 1);
        const isNowDone = newPaid >= total;

        return {
          ...d,
          paid: newPaid,
          endDate: isNowDone ? todayISO() : d.endDate,
        };
      })
    );
  };

  return (
    <div className="appShell">
      <div className="phone">
        {screen === "list" && (
          <DebtsList
            debts={debts}
            onAdd={openCreate}
            onEdit={openEdit}
            onDelete={deleteDebt}
            onToggleInstallment={toggleInstallment}
          />
        )}

        {screen === "form" && (
          <NewDebt
            onBack={backToList}
            onCreate={createDebt}
            onUpdate={updateDebt}
            editingDebt={editingDebt}
          />
        )}
      </div>
    </div>
  );
}
