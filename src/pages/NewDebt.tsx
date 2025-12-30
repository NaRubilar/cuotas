import { useEffect, useMemo, useState } from "react";
import type { Debt, IconKey } from "../models/Debt";
import TopBar from "../components/TopBar";
import IconPicker from "../components/IconPicker";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

import { Home, Shirt, Phone, ShoppingCart, Heart, Car } from "lucide-react";

function uid() {
  return crypto.randomUUID?.() ?? String(Date.now());
}

type Draft = {
  icon: IconKey;
  title: string;
  description: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD (opcional)
  quantity: string;
  price: string;
};

const emptyDraft: Draft = {
  icon: "home",
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  quantity: "",
  price: "",
};

function debtToDraft(debt: Debt): Draft {
  return {
    icon: debt.icon,
    title: debt.title ?? "",
    description: debt.description ?? "",
    startDate: debt.startDate ?? "",
    endDate: debt.endDate ?? "",
    quantity: String(debt.quantity ?? ""),
    price: String(debt.price ?? ""),
  };
}

function sameDraft(a: Draft, b: Draft) {
  return (
    a.icon === b.icon &&
    a.title === b.title &&
    a.description === b.description &&
    a.startDate === b.startDate &&
    a.endDate === b.endDate &&
    a.quantity === b.quantity &&
    a.price === b.price
  );
}

function formatISO(d: Dayjs | null) {
  return d ? d.format("YYYY-MM-DD") : "";
}

function parseISO(s: string): Dayjs | null {
  if (!s) return null;
  const d = dayjs(s);
  return d.isValid() ? d : null;
}

function PreviewIcon({ icon }: { icon: IconKey }) {
  const common = { size: 22, strokeWidth: 2 };
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

export default function NewDebt({
  onBack,
  onCreate,
  onUpdate,
  editingDebt,
}: {
  onBack: () => void;
  onCreate: (debt: Debt) => void;
  onUpdate: (debt: Debt) => void;
  editingDebt?: Debt | null;
}) {
  const isEdit = !!editingDebt;

  const initialDraft = useMemo(
    () => (editingDebt ? debtToDraft(editingDebt) : emptyDraft),
    [editingDebt]
  );

  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [confirmBackOpen, setConfirmBackOpen] = useState(false);

  useEffect(() => {
    setDraft(initialDraft);
    setTouched({});
  }, [initialDraft]);

  // Dirty check: si escribió o cambió algo
  const isDirty = useMemo(() => !sameDraft(draft, initialDraft), [draft, initialDraft]);

  // Validaciones
  const errors = useMemo(() => {
    const title = draft.title.trim();
    const desc = draft.description.trim();
    const qty = Number(draft.quantity);
    const price = Number(draft.price);

    return {
      title: title.length === 0 ? "Nombre es obligatorio" : "",
      description: desc.length === 0 ? "Descripción es obligatoria" : "",
      startDate: draft.startDate ? "" : "Fecha inicio es obligatoria",
      quantity:
        !draft.quantity
          ? "Cantidad es obligatoria"
          : !Number.isFinite(qty) || qty <= 0
          ? "Cantidad debe ser mayor a 0"
          : "",
      price:
        !draft.price
          ? "Precio es obligatorio"
          : !Number.isFinite(price) || price <= 0
          ? "Precio debe ser mayor a 0"
          : "",
      // endDate: opcional
    };
  }, [draft]);

  const canSave = useMemo(() => {
    return (
      !errors.title &&
      !errors.description &&
      !errors.startDate &&
      !errors.quantity &&
      !errors.price
    );
  }, [errors]);

  function handleBackClick() {
    if (!isDirty) {
      onBack();
      return;
    }
    setConfirmBackOpen(true);
  }

  function discardAndBack() {
    // “Sí, eliminar lo escrito”
    setDraft(initialDraft);
    setTouched({});
    setConfirmBackOpen(false);
    onBack();
  }

  function stayHere() {
    // “No”
    setConfirmBackOpen(false);
  }

  function save() {
    setTouched({
      title: true,
      description: true,
      startDate: true,
      quantity: true,
      price: true,
      endDate: true,
    });

    if (!canSave) return;

    const base: Debt = {
      id: editingDebt?.id ?? uid(),
      icon: draft.icon,
      title: draft.title.trim(),
      description: draft.description.trim(),
      startDate: draft.startDate,
      endDate: draft.endDate || "",
      quantity: Number(draft.quantity || 0),
      price: Number(draft.price || 0),
      paid: editingDebt?.paid ?? 0,
    };

    if (isEdit) onUpdate(base);
    else onCreate(base);

    onBack();
  }

  return (
    <>
      <TopBar
        title={isEdit ? "Editar Deuda" : "Ingresar Nueva Deuda"}
        leftIcon="back"
        onLeftClick={handleBackClick}
      />

      <main className="content">
        <div className="formTop">
          <div className="iconBadge big">
            <PreviewIcon icon={draft.icon} />
          </div>

          <TextField
            variant="standard"
            label="Nombre"
            value={draft.title}
            onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
            onBlur={() => setTouched((p) => ({ ...p, title: true }))}
            fullWidth
            required
            error={!!errors.title && !!touched.title}
            helperText={touched.title ? errors.title : " "}
            InputLabelProps={{ shrink: true }}
          />
        </div>

        <div className="sectionLabel">Iconos</div>
        <IconPicker
          value={draft.icon}
          onChange={(v) => setDraft((p) => ({ ...p, icon: v }))}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              variant="standard"
              label="Descripción"
              value={draft.description}
              onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))}
              onBlur={() => setTouched((p) => ({ ...p, description: true }))}
              fullWidth
              required
              error={!!errors.description && !!touched.description}
              helperText={touched.description ? errors.description : " "}
              InputLabelProps={{ shrink: true }}
            />

            <DatePicker
              label="Fecha Inicio"
              value={parseISO(draft.startDate)}
              onChange={(v) => setDraft((p) => ({ ...p, startDate: formatISO(v) }))}
              slotProps={{
                textField: {
                  variant: "standard",
                  fullWidth: true,
                  required: true,
                  onBlur: () => setTouched((p) => ({ ...p, startDate: true })),
                  error: !!errors.startDate && !!touched.startDate,
                  helperText: touched.startDate ? errors.startDate : " ",
                  InputLabelProps: { shrink: true },
                },
              }}
            />

            <DatePicker
              label="Fecha Término (opcional)"
              value={parseISO(draft.endDate)}
              onChange={(v) => setDraft((p) => ({ ...p, endDate: formatISO(v) }))}
              slotProps={{
                textField: {
                  variant: "standard",
                  fullWidth: true,
                  InputLabelProps: { shrink: true },
                  helperText: " ",
                },
              }}
            />

            <TextField
              variant="standard"
              label="Cantidad"
              value={draft.quantity}
              onChange={(e) => setDraft((p) => ({ ...p, quantity: e.target.value }))}
              onBlur={() => setTouched((p) => ({ ...p, quantity: true }))}
              fullWidth
              required
              inputMode="numeric"
              error={!!errors.quantity && !!touched.quantity}
              helperText={touched.quantity ? errors.quantity : " "}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              variant="standard"
              label="Precio"
              value={draft.price}
              onChange={(e) => setDraft((p) => ({ ...p, price: e.target.value }))}
              onBlur={() => setTouched((p) => ({ ...p, price: true }))}
              fullWidth
              required
              inputMode="numeric"
              error={!!errors.price && !!touched.price}
              helperText={touched.price ? errors.price : " "}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </LocalizationProvider>

        <Button
          onClick={save}
          variant="contained"
          disabled={!canSave}
          sx={{
            mt: 3,
            mx: "auto",
            display: "block",
            borderRadius: 999,
            bgcolor: "#36A3B0",
            "&:hover": { bgcolor: "#2f95a2" },
            textTransform: "none",
            fontWeight: 600,
            px: 3,
          }}
        >
          {isEdit ? "Guardar Cambios" : "Guardar"}
        </Button>
      </main>

      {/* Confirmación al volver con cambios */}
      <Dialog open={confirmBackOpen} onClose={stayHere}>
        <DialogTitle>Salir del formulario</DialogTitle>
        <DialogContent>
          <Typography>¿Desea eliminar lo escrito?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={stayHere}>No</Button>
          <Button onClick={discardAndBack} color="error" variant="contained">
            Sí
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
