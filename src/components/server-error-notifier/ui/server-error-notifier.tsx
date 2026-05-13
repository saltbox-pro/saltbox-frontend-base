import { CloseOutlined, CopyOutlined } from "@ant-design/icons";
import { ServerErrorEventDetail } from "@saltbox/saltbox-frontend-common";
import { Button, Space, Typography, message as staticMessage } from "antd";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { serverErrorStore } from "../../../store/server-error-store";

const { Text } = Typography;

const MESSAGE_KEY = "global-server-error";
const MESSAGE_DURATION_SECONDS = 0;

function buildDebugInfo(detail: ServerErrorEventDetail, fallbackMessage: string): string {
  const lines = [
    `Time: ${detail.timestamp}`,
    `Status: ${detail.status}${detail.statusText ? ` ${detail.statusText}` : ""}`,
    detail.method ? `Method: ${detail.method}` : null,
    `URL: ${detail.url}`,
    `Message: ${detail.message ?? fallbackMessage}`,
    detail.requestBody ? `Request body:\n${detail.requestBody}` : null,
    detail.responseBody ? `Response body:\n${detail.responseBody}` : null,
    `User-Agent: ${navigator.userAgent}`,
  ];
  return lines.filter(Boolean).join("\n");
}

export const ServerErrorNotifier = observer(() => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = staticMessage.useMessage();
  const error = serverErrorStore.currentError;

  useEffect(() => {
    if (!error) return;

    const fallbackMessage = t("errors.connection-error");

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(buildDebugInfo(error, fallbackMessage));
        messageApi.success({
          content: "Debug info copied",
          duration: 2,
          key: "global-server-error-copied",
        });
      } catch {
        messageApi.error({
          content: "Failed to copy to clipboard",
          duration: 3,
          key: "global-server-error-copy-failed",
        });
      }
    };

    const handleClose = () => {
      messageApi.destroy(MESSAGE_KEY);
      serverErrorStore.clearError();
    };

    messageApi.error({
      key: MESSAGE_KEY,
      duration: MESSAGE_DURATION_SECONDS,
      content: (
        <Space size={8} align="center">
          <Text>{t("errors.connection-error")}</Text>
          <Button
            type="link"
            size="small"
            icon={<CopyOutlined />}
            style={{ padding: 0 }}
            onClick={handleCopy}
            title="Copy debug info"
          />
          <Button
            type="text"
            size="small"
            icon={<CloseOutlined />}
            style={{ padding: 0 }}
            onClick={handleClose}
            title="Close"
          />
        </Space>
      ),
      onClose: () => serverErrorStore.clearError(),
    });
  }, [error, messageApi, t]);

  return <>{contextHolder}</>;
});
