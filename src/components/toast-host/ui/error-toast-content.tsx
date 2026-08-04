import { CopyOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import { Button, Flex, message, Typography } from "antd";
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

  const handleCopy = () => {
    if (!debugText) return;
    navigator.clipboard
      .writeText(debugText)
      .then(() => message.success({ content: t("errors.debug-copied"), duration: 2 }))
      .catch(() => message.error({ content: t("errors.debug-copy-failed"), duration: 3 }));
  };

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
            <Button
              type="link"
              size="small"
              className={styles.action}
              icon={<CopyOutlined />}
              onClick={handleCopy}
            >
              {t("errors.copy-debug")}
            </Button>
          </Flex>

          {expanded ? <pre className={styles.pre}>{debugText}</pre> : null}
        </>
      ) : null}
    </div>
  );
};
