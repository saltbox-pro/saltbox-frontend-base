import { type SortableItemProps, useSortableDrag } from "@saltbox/saltbox-frontend-common";
import { Checkbox } from "antd";

import { cn } from "../../../shared/lib/cn";
import { MenuItemLabel } from "../../../shared/ui/menu-item-label/menu-item-label";
import {
  type MenuSettingsGroup as MenuSettingsGroupModel,
  getGroupVisibility,
} from "../model/menu-settings-draft";

import styles from "./menu-settings-modal.module.css";
import { getSortableClassName } from "./sortable-class-name";
import { SortableHandle } from "./sortable-handle";

interface MenuSettingsGroupProps {
  group: MenuSettingsGroupModel;
  sortable: SortableItemProps;
  onToggleGroup: (groupKey: string) => void;
  onToggleItem: (groupKey: string, itemKey: string) => void;
  onMoveItem: (groupKey: string, fromIndex: number, toIndex: number) => void;
}

export function MenuSettingsGroup({
  group,
  sortable,
  onToggleGroup,
  onToggleItem,
  onMoveItem,
}: MenuSettingsGroupProps) {
  const { getSortableProps } = useSortableDrag(
    group.items.map((item) => item.key),
    (fromIndex, toIndex) => onMoveItem(group.key, fromIndex, toIndex)
  );
  const visibility = getGroupVisibility(group);

  return (
    <li className={cn(styles.group, getSortableClassName(sortable))} {...sortable.dropProps}>
      <div className={styles.row}>
        <Checkbox
          checked={visibility === "all"}
          indeterminate={visibility === "some"}
          onChange={() => onToggleGroup(group.key)}
        >
          <span className={styles.groupLabel}>
            {group.isLeaf ? <MenuItemLabel icon={group.icon} label={group.label} /> : group.label}
          </span>
        </Checkbox>
        <SortableHandle label={group.label} sortable={sortable} />
      </div>

      {!group.isLeaf && (
        <ul className={styles.items}>
          {group.items.map((item) => {
            const itemSortable = getSortableProps(item.key);

            return (
              <li
                key={item.key}
                className={cn(styles.row, getSortableClassName(itemSortable))}
                {...itemSortable.dropProps}
              >
                <Checkbox checked={item.visible} onChange={() => onToggleItem(group.key, item.key)}>
                  <MenuItemLabel icon={item.icon} label={item.label} />
                </Checkbox>
                <SortableHandle label={item.label} sortable={itemSortable} />
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}
