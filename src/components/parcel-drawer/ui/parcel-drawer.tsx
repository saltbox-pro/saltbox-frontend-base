import { type RefObject, useCallback, useEffect, useMemo, useRef } from "react";
import Parcel, { type ParcelCompProps } from "single-spa-react/parcel";

import {
  PARCEL_DRAWER_MIN_WIDTH,
  PINNED_PARCEL_DRAWER_MIN_WIDTH,
} from "../../../shared/config/parcel-drawer";
import { useLastOpenValue } from "../../../shared/lib/use-last-open-value";
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

  const parcel = useMemo(
    () =>
      request && (
        <Parcel
          key={request.key}
          config={request.config as ParcelCompProps["config"]}
          wrapWith="div"
          wrapClassName={styles.wrapper}
          onClose={handleParcelClose}
        />
      ),
    [request, handleParcelClose]
  );

  const displayedPinnedWidth = useLastOpenValue(pinnedWidth, isOpen);
  const isDisplayedPinned = displayedPinnedWidth !== null;

  return (
    <BaseDrawer
      isOpen={isOpen}
      isPinned={isDisplayedPinned}
      title={request?.title}
      onClose={onClose}
      afterOpenChange={afterOpenChange}
      destroyOnHidden
      minWidth={isDisplayedPinned ? PINNED_PARCEL_DRAWER_MIN_WIDTH : PARCEL_DRAWER_MIN_WIDTH}
      width={displayedPinnedWidth ?? undefined}
      panelRef={panelRef}
      rootClassName={isDisplayedPinned ? styles.pinned : undefined}
      extra={<PinToggleButton isPinned={isDisplayedPinned} onClick={onTogglePin} />}
    >
      {parcel}
    </BaseDrawer>
  );
}
