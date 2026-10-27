import { moveItem } from "@saltbox/saltbox-frontend-common";

import { resolveMenuLabel } from "../../../shared/lib/resolve-menu-label";
import type { MenuEntry, MenuLayout } from "../../../shared/model/menu";
import type { MenuIcon } from "../../../shared/ui/menu-item-icon/menu-item-icon";

export type MenuSettingsItem = {
  key: string;
  label: string;
  icon?: MenuIcon;
  visible: boolean;
};

export type MenuSettingsGroup = {
  key: string;
  label: string;
  icon?: MenuIcon;
  isLeaf: boolean;
  items: MenuSettingsItem[];
};

export type GroupVisibility = "all" | "some" | "none";

export function buildMenuSettingsDraft(
  menu: MenuEntry[],
  hiddenItems: string[],
  locale: string
): MenuSettingsGroup[] {
  const hidden = new Set(hiddenItems);
  const toItem = (entry: MenuEntry): MenuSettingsItem => ({
    key: entry.key,
    label: resolveMenuLabel(entry.label, locale),
    icon: entry.icon,
    visible: !hidden.has(entry.key),
  });

  return menu.map((group) => ({
    key: group.key,
    label: resolveMenuLabel(group.label, locale),
    icon: group.icon,
    isLeaf: !group.children,
    items: group.children ? group.children.map(toItem) : [toItem(group)],
  }));
}

const getKeys = (entries: { key: string }[]): string[] => entries.map(({ key }) => key);

const isSameOrder = (order: string[], defaultOrder: string[] | undefined): boolean =>
  order.length === defaultOrder?.length && order.every((key, index) => key === defaultOrder[index]);

const insertAbsentKeys = (
  order: string[],
  previousOrder: string[],
  isAbsent: (key: string) => boolean
): string[] =>
  previousOrder.reduce(
    (merged, key, index) =>
      isAbsent(key) ? [...merged.slice(0, index), key, ...merged.slice(index)] : merged,
    order
  );

export function buildMenuLayout(
  draft: MenuSettingsGroup[],
  defaultDraft: MenuSettingsGroup[],
  currentLayout: MenuLayout | null = null
): MenuLayout {
  const items = draft.flatMap((group) => group.items);
  const knownKeys = new Set([...getKeys(draft), ...getKeys(items)]);
  const isAbsent = (key: string) => !knownKeys.has(key);
  const defaultHidden = new Set(
    defaultDraft.flatMap((group) =>
      group.items.filter((item) => !item.visible).map(({ key }) => key)
    )
  );
  const defaultItemOrders = new Map(defaultDraft.map((group) => [group.key, getKeys(group.items)]));
  const groupOrder = getKeys(draft);
  const previousGroupOrder = currentLayout?.groupOrder ?? [];
  const hasCustomGroupOrder =
    !isSameOrder(groupOrder, getKeys(defaultDraft)) || previousGroupOrder.some(isAbsent);

  return {
    groupOrder: hasCustomGroupOrder
      ? insertAbsentKeys(groupOrder, previousGroupOrder, isAbsent)
      : [],
    itemOrder: Object.fromEntries([
      ...Object.entries(currentLayout?.itemOrder ?? {}).filter(([groupKey]) => isAbsent(groupKey)),
      ...draft
        .filter((group) => !group.isLeaf)
        .map((group) => [group.key, getKeys(group.items)] as const)
        .filter(([groupKey, order]) => !isSameOrder(order, defaultItemOrders.get(groupKey))),
    ]),
    hiddenItems: [
      ...getKeys(items.filter(({ key, visible }) => !visible && !defaultHidden.has(key))),
      ...(currentLayout?.hiddenItems.filter(isAbsent) ?? []),
    ],
    shownItems: [
      ...getKeys(items.filter(({ key, visible }) => visible && defaultHidden.has(key))),
      ...(currentLayout?.shownItems.filter(isAbsent) ?? []),
    ],
  };
}

export function isEmptyMenuLayout(layout: MenuLayout): boolean {
  return (
    layout.groupOrder.length === 0 &&
    Object.keys(layout.itemOrder).length === 0 &&
    layout.hiddenItems.length === 0 &&
    layout.shownItems.length === 0
  );
}

const isSameGroup = (group: MenuSettingsGroup, other: MenuSettingsGroup | undefined): boolean =>
  group.key === other?.key &&
  group.items.length === other.items.length &&
  group.items.every(
    (item, index) =>
      item.key === other.items[index].key && item.visible === other.items[index].visible
  );

export function isSameDraft(draft: MenuSettingsGroup[], other: MenuSettingsGroup[]): boolean {
  return (
    draft.length === other.length && draft.every((group, index) => isSameGroup(group, other[index]))
  );
}

export function getGroupVisibility(group: MenuSettingsGroup): GroupVisibility {
  const visibleCount = group.items.filter((item) => item.visible).length;
  if (visibleCount === 0) return "none";

  return visibleCount === group.items.length ? "all" : "some";
}

export function hasVisibleMenuItems(draft: MenuSettingsGroup[]): boolean {
  return draft.some((group) => group.items.some((item) => item.visible));
}

function updateGroup(
  draft: MenuSettingsGroup[],
  groupKey: string,
  update: (group: MenuSettingsGroup) => MenuSettingsGroup
): MenuSettingsGroup[] {
  return draft.map((group) => (group.key === groupKey ? update(group) : group));
}

export function toggleGroupVisibility(
  draft: MenuSettingsGroup[],
  groupKey: string
): MenuSettingsGroup[] {
  return updateGroup(draft, groupKey, (group) => {
    const visible = getGroupVisibility(group) !== "all";

    return { ...group, items: group.items.map((item) => ({ ...item, visible })) };
  });
}

export function toggleItemVisibility(
  draft: MenuSettingsGroup[],
  groupKey: string,
  itemKey: string
): MenuSettingsGroup[] {
  return updateGroup(draft, groupKey, (group) => ({
    ...group,
    items: group.items.map((item) =>
      item.key === itemKey ? { ...item, visible: !item.visible } : item
    ),
  }));
}

export function moveGroupItem(
  draft: MenuSettingsGroup[],
  groupKey: string,
  fromIndex: number,
  toIndex: number
): MenuSettingsGroup[] {
  return updateGroup(draft, groupKey, (group) => ({
    ...group,
    items: moveItem(group.items, fromIndex, toIndex),
  }));
}
