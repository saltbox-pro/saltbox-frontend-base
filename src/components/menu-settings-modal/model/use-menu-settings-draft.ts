import { moveItem } from "@saltbox/saltbox-frontend-common";
import { useState } from "react";

import {
  type MenuSettingsGroup,
  hasVisibleMenuItems,
  isSameDraft,
  moveGroupItem,
  toggleGroupVisibility,
  toggleItemVisibility,
} from "./menu-settings-draft";

interface UseMenuSettingsDraftParams {
  createInitialDraft: () => MenuSettingsGroup[];
  createDefaultDraft: () => MenuSettingsGroup[];
}

export function useMenuSettingsDraft({
  createInitialDraft,
  createDefaultDraft,
}: UseMenuSettingsDraftParams) {
  const [initialDraft] = useState(createInitialDraft);
  const [defaultDraft] = useState(createDefaultDraft);
  const [draft, setDraft] = useState(initialDraft);

  const reset = () => {
    setDraft(defaultDraft);
  };

  const toggleGroup = (groupKey: string) => {
    setDraft((prev) => toggleGroupVisibility(prev, groupKey));
  };

  const toggleItem = (groupKey: string, itemKey: string) => {
    setDraft((prev) => toggleItemVisibility(prev, groupKey, itemKey));
  };

  const moveGroup = (fromIndex: number, toIndex: number) => {
    setDraft((prev) => moveItem(prev, fromIndex, toIndex));
  };

  const moveItemInGroup = (groupKey: string, fromIndex: number, toIndex: number) => {
    setDraft((prev) => moveGroupItem(prev, groupKey, fromIndex, toIndex));
  };

  return {
    draft,
    defaultDraft,
    canSave: !isSameDraft(draft, initialDraft) && hasVisibleMenuItems(draft),
    canReset: !isSameDraft(draft, defaultDraft),
    reset,
    toggleGroup,
    toggleItem,
    moveGroup,
    moveItemInGroup,
  };
}
