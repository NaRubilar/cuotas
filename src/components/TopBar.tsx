import { ArrowLeft, Menu } from "lucide-react";

type LeftIcon = "menu" | "back";

export default function TopBar({
  title,
  leftIcon,
  onLeftClick,
}: {
  title: string;
  leftIcon: LeftIcon;
  onLeftClick?: () => void;
}) {
  return (
    <header className="topBar">
      <div className="topRow">
        <button className="iconBtn iconBtnSolid" type="button" onClick={onLeftClick} aria-label="left">
          {leftIcon === "menu" ? <Menu size={22} /> : <ArrowLeft size={22} />}
        </button>

        <div className="topTitle">{title}</div>

        <div className="topRightSpacer" />
      </div>
    </header>
  );
}
