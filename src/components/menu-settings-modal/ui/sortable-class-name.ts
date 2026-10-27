import type { SortableItemProps } from "@saltbox/saltbox-frontend-common";

import { cn } from "../../../shared/lib/cn";

import styles from "./menu-settings-modal.module.css";

export const getSortableClassName = ({ isDragging, dropSide }: SortableItemProps): string =>
  cn(
    isDragging && styles.dragging,
    dropSide === "before" && styles.dropBefore,
    dropSide === "after" && styles.dropAfter
  );
