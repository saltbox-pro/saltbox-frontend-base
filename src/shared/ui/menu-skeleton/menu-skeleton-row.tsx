import { Skeleton, theme } from "antd";

import { cn } from "../../lib/cn";

import styles from "./menu-skeleton-row.module.css";

interface MenuSkeletonRowProps {
  className?: string;
  iconSize?: number;
  hasLabel?: boolean;
}

export function MenuSkeletonRow({ className, iconSize, hasLabel = true }: MenuSkeletonRowProps) {
  const { token } = theme.useToken();

  return (
    <li className={cn(styles.row, className)}>
      {iconSize !== undefined && (
        <Skeleton.Avatar
          active
          shape="square"
          size={iconSize}
          style={{ borderRadius: token.borderRadius }}
        />
      )}
      {hasLabel && (
        <Skeleton className={styles.label} active title={{ width: "100%" }} paragraph={false} />
      )}
    </li>
  );
}
