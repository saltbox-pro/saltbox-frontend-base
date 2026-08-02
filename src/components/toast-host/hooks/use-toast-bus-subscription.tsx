import { CopyOutlined } from "@ant-design/icons";
import {
  ToastAction,
  ToastEventDetail,
  ToastType,
  UiEvent,
  publish,
  subscribe,
  unsubscribe,
} from "@saltbox/saltbox-frontend-common";
import { Button, message, Space } from "antd";
import type { NotificationInstance } from "antd/es/notification/interface";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { navigateToUrl } from "single-spa";

/** Политика длительностей — навязывается всем приложениям, в этом смысл host-а. */
const DURATION_SEC: Record<ToastType, number> = {
  error: 6,
  warning: 6,
  success: 3,
  info: 3,
};

const ToastActionButtons = ({
  actions,
  debugText,
  copyLabel,
}: {
  actions?: ToastAction[];
  debugText?: string;
  copyLabel: string;
}) => (
  <Space>
    {actions?.map((action) => (
      <Button
        key={action.label}
        size="small"
        onClick={() => (action.href ? navigateToUrl(action.href) : action.onClick?.())}
      >
        {action.label}
      </Button>
    ))}
    {debugText ? (
      <Button
        size="small"
        icon={<CopyOutlined />}
        onClick={() =>
          navigator.clipboard.writeText(debugText).catch(() => message.error(copyLabel))
        }
      >
        {copyLabel}
      </Button>
    ) : null}
  </Space>
);

/**
 * Единственный отрисовщик UiEvent.Toast на весь продукт: один стек, один порядок,
 * replace по key. Handshake: window-флаг покрывает приложения, загрузившиеся позже
 * host-а, ready-событие сливает буферы загрузившихся раньше.
 */
export function useToastBusSubscription(api: NotificationInstance): void {
  const { t } = useTranslation();

  useEffect(() => {
    const listener = (event: Event) => {
      const detail = (event as CustomEvent<ToastEventDetail>).detail;
      if (!detail) return;
      const hasButtons = Boolean(detail.actions?.length || detail.debugText);
      api.open({
        type: detail.type,
        key: detail.key,
        message: detail.title,
        description: detail.description,
        duration: detail.durationSec ?? DURATION_SEC[detail.type],
        btn: hasButtons ? (
          <ToastActionButtons
            actions={detail.actions}
            debugText={detail.debugText}
            copyLabel={t("errors.copy-debug-info")}
          />
        ) : undefined,
      });
    };

    subscribe(UiEvent.Toast, listener);
    window.__saltboxToastHostReady = true;
    publish(UiEvent.ToastHostReady, undefined);

    return () => {
      window.__saltboxToastHostReady = false;
      unsubscribe(UiEvent.Toast, listener);
    };
  }, [api, t]);
}
