import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Popover } from "@saltbox/saltbox-frontend-common";
import { Button, Descriptions, Flex } from "antd";
import { useTranslation } from "react-i18next";

import styles from "./menu-footer.module.css";

interface MenuFooterProps {
  authStore: any;
  closeAllDrawers: () => void;
}

export function MenuFooter({ authStore, closeAllDrawers }: MenuFooterProps) {
  const { t } = useTranslation();

  const handleLogout = () => {
    if (authStore) {
      authStore.signOut(window.location.href);
    }
  };

  const userDisplayName =
    authStore?.user?.profile?.name || authStore?.user?.profile?.preferred_username || "User";

  return (
    <Flex className={styles.menuFooter} vertical gap={4}>
      <Popover
        placement="rightBottom"
        trigger="click"
        content={
          <div className={styles.popoverContent}>
            <Descriptions
              column={1}
              items={[
                {
                  label: t("mainmenu.popover-user-info-username"),
                  children: authStore.user?.profile.preferred_username,
                },
                {
                  label: t("mainmenu.popover-user-info-email"),
                  children: authStore.user?.profile.email,
                },
                {
                  label: t("mainmenu.popover-user-info-first-name"),
                  children: authStore.user?.profile.given_name,
                },
                {
                  label: t("mainmenu.popover-user-info-last-name"),
                  children: authStore.user?.profile.family_name,
                },
              ]}
            />
            <Flex justify="flex-end" gap="small">
              <Button
                color="primary"
                variant="text"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              >
                {t("mainmenu.popover-user-logout-button")}
              </Button>
            </Flex>
          </div>
        }
      >
        <Button
          type="text"
          icon={<UserOutlined />}
          size="large"
          className={styles.fullWidthButton}
          onClick={closeAllDrawers}
        >
          {userDisplayName}
        </Button>
      </Popover>
    </Flex>
  );
}
