import Parcel from "single-spa-react/parcel";

import { BaseDrawer } from "../../../shared/ui/base-drawer/base-drawer";

import styles from "./parcel-drawer.module.css";

interface ParcelDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  afterOpenChange?: (open: boolean) => void;
  parcelConfig: any;
}

export function ParcelDrawer({
  isOpen,
  onClose,
  afterOpenChange,
  parcelConfig,
}: ParcelDrawerProps) {
  return (
    <BaseDrawer
      isOpen={isOpen}
      onClose={onClose}
      afterOpenChange={afterOpenChange}
      destroyOnHidden
      minWidth={420}
    >
      <Parcel
        config={parcelConfig}
        wrapWith="div"
        wrapClassName={styles.wrapper}
        onClose={onClose}
      />
    </BaseDrawer>
  );
}
