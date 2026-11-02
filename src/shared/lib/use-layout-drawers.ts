import { useCallback, useRef, useState } from "react";

import type { MenuEntry, ParcelDrawerRequest, ToggleParcelDrawer } from "../model/menu";

interface UseLayoutDrawersParams {
  autoCollapseSider: () => void;
  releaseSiderAutoCollapse: () => void;
}

export const useLayoutDrawers = ({
  autoCollapseSider,
  releaseSiderAutoCollapse,
}: UseLayoutDrawersParams) => {
  const [parcelDrawerRequest, setParcelDrawerRequest] = useState<ParcelDrawerRequest | null>(null);
  const [isParcelDrawerOpen, setIsParcelDrawerOpen] = useState(false);
  const [pinnedParcelDrawerWidth, setPinnedParcelDrawerWidth] = useState<number | null>(null);
  const [submenuDrawerItems, setSubmenuDrawerItems] = useState<MenuEntry[] | null>(null);
  const [activeSubmenuKey, setActiveSubmenuKey] = useState<string | null>(null);
  const [isSubmenuDrawerOpen, setIsSubmenuDrawerOpen] = useState(false);
  const [isMoreDrawerOpen, setIsMoreDrawerOpen] = useState(false);
  const parcelDrawerPanelRef = useRef<HTMLDivElement>(null);

  const isParcelDrawerPinned = pinnedParcelDrawerWidth !== null;
  const activeParcelKey = isParcelDrawerOpen ? (parcelDrawerRequest?.key ?? null) : null;

  const unpinParcelDrawer = useCallback(() => {
    setPinnedParcelDrawerWidth(null);
    releaseSiderAutoCollapse();
  }, [releaseSiderAutoCollapse]);

  const closeParcelDrawer = useCallback(() => {
    setIsParcelDrawerOpen(false);
    unpinParcelDrawer();
  }, [unpinParcelDrawer]);

  const closeUnpinnedParcelDrawer = useCallback(() => {
    if (!isParcelDrawerPinned) closeParcelDrawer();
  }, [isParcelDrawerPinned, closeParcelDrawer]);

  const handleParcelDrawerAfterOpenChange = useCallback((open: boolean) => {
    if (!open) setParcelDrawerRequest(null);
  }, []);

  const toggleParcelDrawerPin = useCallback(() => {
    if (isParcelDrawerPinned) {
      closeParcelDrawer();
      return;
    }

    const panel = parcelDrawerPanelRef.current;
    if (!panel) return;

    setPinnedParcelDrawerWidth(panel.getBoundingClientRect().width);
    autoCollapseSider();
  }, [isParcelDrawerPinned, closeParcelDrawer, autoCollapseSider]);

  const closeSubmenuDrawer = useCallback(() => {
    setIsSubmenuDrawerOpen(false);
  }, []);

  const handleSubmenuDrawerAfterOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setSubmenuDrawerItems(null);
      setActiveSubmenuKey(null);
    }
  }, []);

  const closeMoreDrawer = useCallback(() => {
    setIsMoreDrawerOpen(false);
  }, []);

  const closeAllDrawers = useCallback(() => {
    closeUnpinnedParcelDrawer();
    closeSubmenuDrawer();
    closeMoreDrawer();
  }, [closeUnpinnedParcelDrawer, closeSubmenuDrawer, closeMoreDrawer]);

  const toggleParcelDrawer = useCallback<ToggleParcelDrawer>(
    (request) => {
      closeMoreDrawer();
      closeSubmenuDrawer();

      if (activeParcelKey === request.key) {
        closeUnpinnedParcelDrawer();
        return;
      }

      unpinParcelDrawer();
      setParcelDrawerRequest(request);
      setIsParcelDrawerOpen(true);
    },
    [
      activeParcelKey,
      closeUnpinnedParcelDrawer,
      unpinParcelDrawer,
      closeMoreDrawer,
      closeSubmenuDrawer,
    ]
  );

  const toggleSubmenuDrawer = useCallback(
    (submenu: MenuEntry[], menuKey: string) => {
      if (isSubmenuDrawerOpen && activeSubmenuKey === menuKey) {
        closeSubmenuDrawer();
        return;
      }

      closeMoreDrawer();
      closeUnpinnedParcelDrawer();
      setSubmenuDrawerItems(submenu);
      setActiveSubmenuKey(menuKey);
      setIsSubmenuDrawerOpen(true);
    },
    [
      isSubmenuDrawerOpen,
      activeSubmenuKey,
      closeSubmenuDrawer,
      closeMoreDrawer,
      closeUnpinnedParcelDrawer,
    ]
  );

  const toggleMoreDrawer = useCallback(() => {
    if (isMoreDrawerOpen) {
      closeMoreDrawer();
      return;
    }

    closeUnpinnedParcelDrawer();
    closeSubmenuDrawer();
    setIsMoreDrawerOpen(true);
  }, [isMoreDrawerOpen, closeMoreDrawer, closeUnpinnedParcelDrawer, closeSubmenuDrawer]);

  return {
    activeDrawerKey: activeSubmenuKey || activeParcelKey,
    closeAllDrawers,
    parcelDrawer: {
      request: parcelDrawerRequest,
      isOpen: isParcelDrawerOpen,
      pinnedWidth: pinnedParcelDrawerWidth,
      panelRef: parcelDrawerPanelRef,
      toggle: toggleParcelDrawer,
      togglePin: toggleParcelDrawerPin,
      close: closeParcelDrawer,
      handleAfterOpenChange: handleParcelDrawerAfterOpenChange,
    },
    submenuDrawer: {
      items: submenuDrawerItems,
      isOpen: isSubmenuDrawerOpen,
      toggle: toggleSubmenuDrawer,
      close: closeSubmenuDrawer,
      handleAfterOpenChange: handleSubmenuDrawerAfterOpenChange,
    },
    moreDrawer: {
      isOpen: isMoreDrawerOpen,
      toggle: toggleMoreDrawer,
      close: closeMoreDrawer,
    },
  };
};
