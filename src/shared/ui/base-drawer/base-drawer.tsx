import { Drawer } from "@saltbox/saltbox-frontend-common";
import type { PropsWithChildren } from "react";

import styles from "./base-drawer.module.css";

interface BaseDrawerProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  afterOpenChange?: (open: boolean) => void;
  destroyOnHidden?: boolean;
  minWidth?: number;
}

export function BaseDrawer({
  isOpen,
  onClose,
  afterOpenChange,
  destroyOnHidden,
  minWidth = 380,
  children,
}: BaseDrawerProps) {
  return (
    <Drawer
      placement="left"
      getContainer={false}
      open={isOpen}
      onClose={onClose}
      afterOpenChange={afterOpenChange}
      destroyOnHidden={destroyOnHidden}
      rootClassName={styles.drawer}
      styles={{
        wrapper: {
          minWidth,
          width: "auto",
          maxWidth: "calc(100vw - 250px)",
        },
      }}
    >
      {children}
    </Drawer>
  );
}
