import { Drawer } from "@saltbox/saltbox-frontend-common";
import type { PropsWithChildren } from "react";

interface BaseDrawerProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  afterOpenChange?: (open: boolean) => void;
  destroyOnHidden?: boolean;
}

export function BaseDrawer({
  isOpen,
  onClose,
  afterOpenChange,
  destroyOnHidden,
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
    >
      {children}
    </Drawer>
  );
}
