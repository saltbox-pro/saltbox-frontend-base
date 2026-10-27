import { theme } from "antd";

import { cn } from "../../../shared/lib/cn";
import { MenuSkeletonRow } from "../../../shared/ui/menu-skeleton/menu-skeleton-row";

import styles from "./menu-settings-modal.module.css";

const SKELETON_ROWS = [
  { key: "group-1", isGroup: true },
  { key: "item-1", isGroup: false },
  { key: "item-2", isGroup: false },
  { key: "item-3", isGroup: false },
  { key: "group-2", isGroup: true },
  { key: "item-4", isGroup: false },
];

export function MenuSettingsSkeleton() {
  const { token } = theme.useToken();

  return (
    <ul className={styles.groups} aria-busy="true">
      {SKELETON_ROWS.map(({ key, isGroup }) => (
        <MenuSkeletonRow
          key={key}
          className={cn(styles.skeletonRow, !isGroup && styles.skeletonItem)}
          iconSize={token.controlInteractiveSize}
        />
      ))}
    </ul>
  );
}
