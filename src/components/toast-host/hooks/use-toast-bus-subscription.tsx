import {
  ToastAction,
  ToastEventDetail,
  ToastType,
  UiEvent,
  formatErrorCode,
  publish,
  subscribe,
  unsubscribe,
} from "@saltbox/saltbox-frontend-common";
import { Button, Space } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { navigateToUrl } from "single-spa";

import { ErrorToastContent } from "../ui/error-toast-content";

/** Политика длительностей — навязывается всем приложениям, в этом смысл host-а. */
const DURATION_SEC: Record<ToastType, number> = {
  error: 6,
  warning: 6,
  success: 3,
  info: 3,
};

/** Ключ для тостов без своего key: нужен, чтобы разворачивание деталей нашло свой тост. */
let autoKeySeq = 0;

const ToastActionButtons = ({ actions }: { actions: ToastAction[] }) => (
  <Space>
    {actions.map((action) => (
      <Button
        key={action.label}
        size="small"
        onClick={() => (action.href ? navigateToUrl(action.href) : action.onClick?.())}
      >
        {action.label}
      </Button>
    ))}
  </Space>
);

/**
 * Единственный отрисовщик UiEvent.Toast на весь продукт: один стек, один порядок,
 * replace по key. Handshake: window-флаг покрывает приложения, загрузившиеся позже
 * host-а, ready-событие сливает буферы загрузившихся раньше.
 */
export function useToastBusSubscription(
  api: NotificationInstance,
  messageApi: MessageInstance
): void {
  const { t } = useTranslation("common");

  const showToast = useCallback(
    (detail: ToastEventDetail, key: string, expanded: boolean) => {
      // лёгкая поверхность: короткая строка по центру сверху (подтверждения копирования)
      if (detail.surface === "message") {
        messageApi.open({
          type: detail.type,
          key,
          content: detail.title,
          duration: detail.durationSec ?? DURATION_SEC[detail.type],
        });
        return;
      }

      const codeLine = detail.errorCode
        ? formatErrorCode(detail.errorCode.status, detail.errorCode.kind, t)
        : undefined;
      const hasRichContent = Boolean(codeLine || detail.debugText);

      api.open({
        type: detail.type,
        key,
        message: detail.title,
        description: hasRichContent ? (
          <ErrorToastContent
            codeLine={codeLine}
            description={detail.description}
            debugText={detail.debugText}
            expanded={expanded}
            // разворачивая детали, закрепляем тост — иначе он исчезнет во время чтения
            onExpand={() => showToast(detail, key, true)}
            onCollapse={() => showToast(detail, key, false)}
          />
        ) : (
          detail.description
        ),
        duration: expanded ? 0 : (detail.durationSec ?? DURATION_SEC[detail.type]),
        btn: detail.actions?.length ? <ToastActionButtons actions={detail.actions} /> : undefined,
      });
    },
    [api, messageApi, t]
  );

  useEffect(() => {
    const listener = (event: Event) => {
      const detail = (event as CustomEvent<ToastEventDetail>).detail;
      if (!detail) return;
      showToast(detail, detail.key ?? `toast-${++autoKeySeq}`, false);
    };

    subscribe(UiEvent.Toast, listener);
    window.__saltboxToastHostReady = true;
    publish(UiEvent.ToastHostReady, undefined);

    return () => {
      window.__saltboxToastHostReady = false;
      unsubscribe(UiEvent.Toast, listener);
    };
  }, [showToast]);
}
