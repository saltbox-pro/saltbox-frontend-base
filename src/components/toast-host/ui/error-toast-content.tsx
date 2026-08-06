import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { CopyToClipboardButton } from "@saltbox/saltbox-frontend-common";
import { Button, Flex, Typography } from "antd";
import { useTranslation } from "react-i18next";

import styles from "./error-toast-content.module.css";

const { Text } = Typography;

type ErrorToastContentProps = {
  /** «500 · Ошибка сервера» — уже собранная строка кода с расшифровкой */
  codeLine?: string;
  description?: string;
  debugText?: string;
  expanded: boolean;
  /** Разворачивает детали: тост при этом закрепляется, чтобы не исчез во время чтения */
  onExpand: () => void;
  onCollapse: () => void;
};

export const ErrorToastContent = ({
  codeLine,
  description,
  debugText,
  expanded,
  onExpand,
  onCollapse,
}: ErrorToastContentProps) => {
  const { t } = useTranslation("common");

  return (
    <div className={styles.root}>
      {codeLine ? (
        <Text type="secondary" className={styles.codeLine}>
          {codeLine}
        </Text>
      ) : null}

      {description ? <div className={styles.description}>{description}</div> : null}

      {debugText ? (
        <>
          <Flex gap={4} wrap>
            <Button
              type="link"
              size="small"
              className={styles.action}
              icon={expanded ? <UpOutlined /> : <DownOutlined />}
              onClick={expanded ? onCollapse : onExpand}
            >
              {expanded ? t("errors.hide-details") : t("errors.show-details")}
            </Button>
            {/* общий компонент проекта: он же показывает сообщение об успехе копирования */}
            <CopyToClipboardButton
              text={debugText}
              type="link"
              variant="link"
              color="primary"
              size="small"
              className={styles.action}
            >
              {t("errors.copy-debug")}
            </CopyToClipboardButton>
          </Flex>

          {expanded ? <pre className={styles.pre}>{debugText}</pre> : null}
        </>
      ) : null}
    </div>
  );
};
