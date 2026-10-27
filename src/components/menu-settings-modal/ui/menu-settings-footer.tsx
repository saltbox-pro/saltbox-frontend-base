import { Button, Flex } from "antd";
import { useTranslation } from "react-i18next";

import styles from "./menu-settings-modal.module.css";

interface MenuSettingsFooterProps {
  onCancel: () => void;
  onReset?: () => void;
  onSave?: () => void;
  canReset?: boolean;
  canSave?: boolean;
  isSaving?: boolean;
}

export function MenuSettingsFooter({
  onCancel,
  onReset,
  onSave,
  canReset = false,
  canSave = false,
  isSaving = false,
}: MenuSettingsFooterProps) {
  const { t } = useTranslation();

  return (
    <Flex className={styles.footer} justify="space-between" gap="small">
      <Button disabled={!onReset || !canReset || isSaving} onClick={onReset}>
        {t("menu-settings.reset-button")}
      </Button>
      <Flex gap="small">
        <Button onClick={onCancel}>{t("menu-settings.cancel-button")}</Button>
        <Button type="primary" loading={isSaving} disabled={!onSave || !canSave} onClick={onSave}>
          {t("menu-settings.save-button")}
        </Button>
      </Flex>
    </Flex>
  );
}
