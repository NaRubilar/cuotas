import { useMemo, useState } from "react";
import type { Debt } from "../models/Debt";
import TopBar from "../components/TopBar";
import DebtItem from "../components/DebtItem";

import { Card } from "@mui/material";
import Fab from "@mui/material/Fab";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { Plus } from "lucide-react";

type Props = {
  debts: Debt[];
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleInstallment: (id: string, index: number) => void;
};

export default function DebtsList({ debts, onAdd, onEdit, onDelete, onToggleInstallment }: Props) {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const { active, done } = useMemo(() => {
    const isDone = (d: Debt) => (d.quantity ?? 0) > 0 && (d.paid ?? 0) >= (d.quantity ?? 0);
    return {
      active: debts.filter((d) => !isDone(d)),
      done: debts.filter(isDone),
    };
  }, [debts]);

  const askDelete = (id: string) => setConfirmId(id);
  const close = () => setConfirmId(null);
  const confirm = () => {
    if (!confirmId) return;
    onDelete(confirmId);
    setConfirmId(null);
  };

  return (
    <>
      <TopBar title="Deudas Actuales" leftIcon="menu" />

      <main className="content">
        {debts.length === 0 && (
          <Typography sx={{ textAlign: "center", mt: 4, color: "#666" }}>
            Ingresa alguna deuda que tengas
          </Typography>
        )}

        {active.length > 0 && (
          <Card variant="outlined" className="card">
            {active.map((d) => (
              <DebtItem
                key={d.id}
                debt={d}
                onEdit={onEdit}
                onDelete={askDelete}
                onToggleInstallment={onToggleInstallment}
              />
            ))}
          </Card>
        )}

        {done.length > 0 && (
          <>
            <Typography sx={{ mt: 3, mb: 1, fontWeight: 700, color: "#444" }}>
              Finalizado
            </Typography>

            <Card variant="outlined" className="card cardDone">
              {done.map((d) => (
                <DebtItem
                  key={d.id}
                  debt={d}
                  onEdit={onEdit}
                  onDelete={askDelete}
                  onToggleInstallment={onToggleInstallment}
                />
              ))}
            </Card>
          </>
        )}
      </main>

      <Fab
        onClick={onAdd}
        aria-label="Agregar"
        sx={{
          position: "fixed",
          right: 18,
          bottom: `calc(18px + env(safe-area-inset-bottom))`,
          bgcolor: "#36A3B0",
          color: "#fff",
          "&:hover": { bgcolor: "#2f95a2" },
          boxShadow: "0 12px 22px rgba(0,0,0,.22)",
          zIndex: 50,
        }}
      >
        <Plus size={22} />
      </Fab>

      <Dialog open={!!confirmId} onClose={close}>
        <DialogTitle>Eliminar deuda</DialogTitle>
        <DialogContent>
          <Typography>¿Seguro que quieres borrar esta deuda?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>No</Button>
          <Button onClick={confirm} color="error" variant="contained">
            Sí, borrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
