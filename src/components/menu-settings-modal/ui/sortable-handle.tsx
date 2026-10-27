import { HolderOutlined } from "@ant-design/icons";
import type { SortableItemProps } from "@saltbox/saltbox-frontend-common";
import { useTranslation } from "react-i18next";

import { cn } from "../../../shared/lib/cn";

import styles from "./menu-settings-modal.module.css";

interface SortableHandleProps {
  label: string;
  sortable: SortableItemProps;
}

export function SortableHandle({ label, sortable }: SortableHandleProps) {
  const { t } = useTranslation();

  return (
    <HolderOutlined
      className={cn(styles.handle, !sortable.isEnabled && styles.handleDisabled)}
      aria-label={t("menu-settings.drag-handle", { label })}
      {...sortable.handleProps}
    />
  );
}
