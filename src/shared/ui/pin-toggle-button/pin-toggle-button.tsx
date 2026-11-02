import { PushpinFilled, PushpinOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import { useTranslation } from "react-i18next";

interface PinToggleButtonProps {
  isPinned: boolean;
  onClick: () => void;
}

export function PinToggleButton({ isPinned, onClick }: PinToggleButtonProps) {
  const { t } = useTranslation();
  const label = t(isPinned ? "parcel-drawer.unpin-button" : "parcel-drawer.pin-button");

  return (
    <Tooltip title={label}>
      <Button
        type="text"
        size="small"
        icon={isPinned ? <PushpinFilled /> : <PushpinOutlined />}
        aria-label={label}
        aria-pressed={isPinned}
        onClick={onClick}
      />
    </Tooltip>
  );
}
