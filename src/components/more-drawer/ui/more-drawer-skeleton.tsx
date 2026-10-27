import { theme } from "antd";

import { cn } from "../../../shared/lib/cn";
import { MenuSkeletonRow } from "../../../shared/ui/menu-skeleton/menu-skeleton-row";

import styles from "./more-drawer.module.css";

const SKELETON_ROWS = [
  { key: "group-1", isGroup: true },
  { key: "item-1", isGroup: false },
  { key: "item-2", isGroup: false },
  { key: "item-3", isGroup: false },
  { key: "group-2", isGroup: true },
  { key: "item-4", isGroup: false },
  { key: "item-5", isGroup: false },
];

export function MoreDrawerSkeleton() {
  const { token } = theme.useToken();

  return (
    <ul className={styles.skeleton} aria-busy="true">
      {SKELETON_ROWS.map(({ key, isGroup }) => (
        <MenuSkeletonRow
          key={key}
          className={cn(styles.skeletonRow, isGroup && styles.skeletonGroup)}
          iconSize={isGroup ? undefined : token.fontSizeXL}
        />
      ))}
    </ul>
  );
}
