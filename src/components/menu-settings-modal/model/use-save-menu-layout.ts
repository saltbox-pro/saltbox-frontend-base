import { useState } from "react";

import type { MenuLayout, MenuLayoutStore } from "../../../shared/model/menu";

import { isEmptyMenuLayout } from "./menu-settings-draft";

export function useSaveMenuLayout(menuStore: MenuLayoutStore) {
  const [isSaving, setIsSaving] = useState(false);
  const [hasError, setHasError] = useState(false);

  const save = async (layout: MenuLayout): Promise<boolean> => {
    setIsSaving(true);
    setHasError(false);

    try {
      if (isEmptyMenuLayout(layout)) {
        await menuStore.resetLayout();
      } else {
        await menuStore.setLayout(layout);
      }
      return true;
    } catch (error) {
      console.error("Failed to save the menu layout", error);
      setHasError(true);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { isSaving, hasError, save };
}
