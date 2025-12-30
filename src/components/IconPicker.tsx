import type { IconKey } from "../models/Debt";
import { Home, Shirt, Phone, ShoppingCart, Heart, Car } from "lucide-react";

const ICONS: { key: IconKey; label: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[] = [
  { key: "home", label: "Casa", Icon: Home },
  { key: "shirt", label: "Ropa", Icon: Shirt },
  { key: "phone", label: "Teléfono", Icon: Phone },
  { key: "cart", label: "Compras", Icon: ShoppingCart },
  { key: "heart", label: "Salud", Icon: Heart },
  { key: "car", label: "Auto", Icon: Car },
];

export default function IconPicker({
  value,
  onChange,
}: {
  value: IconKey;
  onChange: (v: IconKey) => void;
}) {
  return (
    <div className="section">

      <div className="iconPicker">
        {ICONS.map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            className={`iconPickBtn ${value === key ? "active" : ""}`}
            onClick={() => onChange(key)}
            aria-label={label}
            title={label}
          >
            <div className="iconBadge">
              <Icon size={18} strokeWidth={2} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}