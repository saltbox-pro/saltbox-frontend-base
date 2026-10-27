import { Modal, useSortableDrag } from "@saltbox/saltbox-frontend-common";
import { Alert, Button, Typography } from "antd";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

import { type MenuLayoutStore, getMenuSettingsState } from "../../../shared/model/menu";
import { buildMenuLayout, buildMenuSettingsDraft } from "../model/menu-settings-draft";
import { useMenuSettingsDraft } from "../model/use-menu-settings-draft";
import { useSaveMenuLayout } from "../model/use-save-menu-layout";

import { MenuSettingsFooter } from "./menu-settings-footer";
import { MenuSettingsGroup } from "./menu-settings-group";
import styles from "./menu-settings-modal.module.css";
import { MenuSettingsSkeleton } from "./menu-settings-skeleton";

interface MenuSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuStore: MenuLayoutStore;
  locale: string;
}

interface MenuSettingsBodyProps {
  menuStore: MenuLayoutStore;
  locale: string;
  onClose: () => void;
}

function MenuSettingsForm({ menuStore, locale, onClose }: MenuSettingsBodyProps) {
  const { t } = useTranslation();

  const {
    draft,
    defaultDraft,
    canSave,
    canReset,
    reset,
    toggleGroup,
    toggleItem,
    moveGroup,
    moveItemInGroup,
  } = useMenuSettingsDraft({
    createInitialDraft: () =>
      buildMenuSettingsDraft(menuStore.orderedMenuCatalog, menuStore.hiddenItems, locale),
    createDefaultDraft: () =>
      buildMenuSettingsDraft(menuStore.menuCatalog, menuStore.defaultHiddenItems, locale),
  });
  const { getSortableProps } = useSortableDrag(
    draft.map((group) => group.key),
    moveGroup
  );
  const { isSaving, hasError, save } = useSaveMenuLayout(menuStore);

  const handleSave = async () => {
    const isSaved = await save(buildMenuLayout(draft, defaultDraft, menuStore.layout));

    if (isSaved) onClose();
  };

  return (
    <>
      <ul className={styles.groups}>
        {draft.map((group) => (
          <MenuSettingsGroup
            key={group.key}
            group={group}
            sortable={getSortableProps(group.key)}
            onToggleGroup={toggleGroup}
            onToggleItem={toggleItem}
            onMoveItem={moveItemInGroup}
          />
        ))}
      </ul>

      {hasError && (
        <Alert
          className={styles.error}
          type="error"
          showIcon
          message={t("menu-settings.save-error")}
        />
      )}

      <MenuSettingsFooter
        canReset={canReset}
        canSave={canSave}
        isSaving={isSaving}
        onReset={reset}
        onCancel={onClose}
        onSave={handleSave}
      />
    </>
  );
}

const MenuSettingsContent = observer(({ menuStore, locale, onClose }: MenuSettingsBodyProps) => {
  const { t } = useTranslation();
  const state = getMenuSettingsState(menuStore);

  if (state === "ready") {
    return <MenuSettingsForm menuStore={menuStore} locale={locale} onClose={onClose} />;
  }

  return (
    <>
      {state === "failed" ? (
        <Alert
          type="error"
          showIcon
          message={t("menu-settings.load-error")}
          action={
            <Button size="small" onClick={() => menuStore.retryLayoutLoad()}>
              {t("menu-settings.retry-button")}
            </Button>
          }
        />
      ) : (
        <MenuSettingsSkeleton />
      )}
      <MenuSettingsFooter onCancel={onClose} />
    </>
  );
});

export function MenuSettingsModal({ isOpen, onClose, menuStore, locale }: MenuSettingsModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      open={isOpen}
      title={t("menu-settings.title")}
      footer={null}
      destroyOnHidden
      onCancel={onClose}
    >
      <Typography.Paragraph className={styles.description} type="secondary">
        {t("menu-settings.description")}
      </Typography.Paragraph>

      <MenuSettingsContent menuStore={menuStore} locale={locale} onClose={onClose} />
    </Modal>
  );
}
