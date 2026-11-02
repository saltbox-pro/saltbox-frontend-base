import { type RefObject, useCallback, useEffect, useRef } from "react";
import Parcel, { type ParcelCompProps } from "single-spa-react/parcel";

import type { ParcelDrawerRequest } from "../../../shared/model/menu";
import { BaseDrawer } from "../../../shared/ui/base-drawer/base-drawer";
import { PinToggleButton } from "../../../shared/ui/pin-toggle-button/pin-toggle-button";

import styles from "./parcel-drawer.module.css";

interface ParcelDrawerProps {
  isOpen: boolean;
  request: ParcelDrawerRequest | null;
  pinnedWidth: number | null;
  panelRef: RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onTogglePin: () => void;
  afterOpenChange?: (open: boolean) => void;
}

export function ParcelDrawer({
  isOpen,
  request,
  pinnedWidth,
  panelRef,
  onClose,
  onTogglePin,
  afterOpenChange,
}: ParcelDrawerProps) {
  const isPinned = pinnedWidth !== null;
  const latestCloseStateRef = useRef({ isPinned, onClose });

  useEffect(() => {
    latestCloseStateRef.current = { isPinned, onClose };
  }, [isPinned, onClose]);

  const handleParcelClose = useCallback(() => {
    const { isPinned: isPinnedNow, onClose: closeNow } = latestCloseStateRef.current;
    if (!isPinnedNow) closeNow();
  }, []);

  return (
    <BaseDrawer
      isOpen={isOpen}
      isPinned={isPinned}
      title={request?.title}
      onClose={onClose}
      afterOpenChange={afterOpenChange}
      destroyOnHidden
      minWidth={420}
      width={pinnedWidth ?? undefined}
      panelRef={panelRef}
      extra={<PinToggleButton isPinned={isPinned} onClick={onTogglePin} />}
    >
      {request && (
        <Parcel
          key={request.key}
          config={request.config as ParcelCompProps["config"]}
          wrapWith="div"
          wrapClassName={styles.wrapper}
          onClose={handleParcelClose}
        />
      )}
    </BaseDrawer>
  );
}
