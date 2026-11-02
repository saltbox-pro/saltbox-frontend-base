import { Drawer } from "@saltbox/saltbox-frontend-common";
import { type PropsWithChildren, type ReactNode, type RefObject, useEffect, useRef } from "react";

import { cn } from "../../lib/cn";

import styles from "./base-drawer.module.css";

const DRAWER_ROOT_SELECTOR = ".ant-drawer";
const FOCUS_SENTINEL_SELECTOR = ":scope > [data-sentinel]";

interface BaseDrawerProps extends PropsWithChildren {
  isOpen: boolean;
  isPinned?: boolean;
  title?: ReactNode;
  onClose: () => void;
  afterOpenChange?: (open: boolean) => void;
  destroyOnHidden?: boolean;
  minWidth?: number;
  width?: number;
  extra?: ReactNode;
  panelRef?: RefObject<HTMLDivElement | null>;
}

export function BaseDrawer({
  isOpen,
  isPinned = false,
  title,
  onClose,
  afterOpenChange,
  destroyOnHidden,
  minWidth = 380,
  width,
  extra,
  panelRef,
  children,
}: BaseDrawerProps) {
  const ownPanelRef = useRef<HTMLDivElement>(null);
  const contentRef = panelRef ?? ownPanelRef;

  useEffect(() => {
    const root = contentRef.current?.closest<HTMLElement>(DRAWER_ROOT_SELECTOR);
    if (!root) return;

    root.querySelectorAll<HTMLElement>(FOCUS_SENTINEL_SELECTOR).forEach((sentinel) => {
      sentinel.tabIndex = isPinned ? -1 : 0;
    });
  }, [contentRef, isOpen, isPinned]);

  return (
    <Drawer
      placement="left"
      getContainer={false}
      open={isOpen}
      title={title}
      closable={!isPinned}
      mask={!isPinned}
      keyboard={!isPinned}
      onClose={onClose}
      afterOpenChange={afterOpenChange}
      destroyOnHidden={destroyOnHidden}
      extra={extra}
      panelRef={contentRef}
      rootClassName={cn(styles.drawer, isPinned && styles.pinned)}
      styles={{
        wrapper: {
          minWidth,
          width: width ?? "auto",
          maxWidth: "100%",
        },
      }}
    >
      {children}
    </Drawer>
  );
}
