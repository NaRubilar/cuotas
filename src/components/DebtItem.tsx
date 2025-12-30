import type { Debt } from "../models/Debt";
import { Home, Shirt, Phone, ShoppingCart, Heart, Car, Check } from "lucide-react";
import IconButton from "@mui/material/IconButton";
import { Pencil, Trash2 } from "lucide-react";

function clp(n: number) {
  return new Intl.NumberFormat("es-CL").format(Math.round(n));
}

function DebtIcon({ icon }: { icon: Debt["icon"] }) {
  const common = { size: 18, strokeWidth: 2 };

  switch (icon) {
    case "home":
      return <Home {...common} />;
    case "shirt":
      return <Shirt {...common} />;
    case "phone":
      return <Phone {...common} />;
    case "cart":
      return <ShoppingCart {...common} />;
    case "heart":
      return <Heart {...common} />;
    case "car":
      return <Car {...common} />;
    default:
      return <Home {...common} />;
  }
}

export default function DebtItem({
  debt,
  onDelete,
  onEdit,
  onToggleInstallment,
}: {
  debt: Debt;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onToggleInstallment: (id: string, index: number) => void; // index 0..quantity-1
}) {
  const total = Math.max(0, debt.quantity ?? 0);
  const paid = Math.max(0, Math.min(debt.paid ?? 0, total));
  const isDone = total > 0 && paid >= total;

  return (
    <div className={`row ${isDone ? "rowDone" : ""}`}>
      <div className={`iconBadge ${isDone ? "iconBadgeDone" : ""}`}>
        <DebtIcon icon={debt.icon} />
      </div>

      <div className="rowMain">
        <div className={`titleLine ${isDone ? "titleDone" : ""}`}>
          {debt.title} - ${clp(debt.price)}
        </div>

        <div className="progress">
          {Array.from({ length: total }).map((_, i) => {
            const checked = i < paid;
            return (
              <button
                key={i}
                type="button"
                className={checked ? "check" : "dot"}
                onClick={() => onToggleInstallment(debt.id, i)}
                aria-label={checked ? `Cuota ${i + 1} pagada` : `Cuota ${i + 1} pendiente`}
                title={checked ? "Pagada" : "Pendiente"}
              >
                {checked ? <Check size={12} strokeWidth={3} /> : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="actions">
        <IconButton size="small" onClick={() => onEdit(debt.id)} aria-label="Editar">
          <Pencil size={18} />
        </IconButton>
        <IconButton size="small" onClick={() => onDelete(debt.id)} aria-label="Eliminar">
          <Trash2 size={18} />
        </IconButton>
      </div>
    </div>
  );
}