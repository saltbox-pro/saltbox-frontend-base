import {
  UiEvent,
  UnhandledLoadErrorEventDetail,
  subscribe,
  unsubscribe,
} from "@saltbox/saltbox-frontend-common";
import type { NotificationInstance } from "antd/es/notification/interface";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * Страховочная сетка: ошибка загрузки, у которой не оказалось ни одной ErrorZone
 * или таблицы (bind-счётчик лоадера равен нулю). Гарантия «ни одна ошибка не молчит».
 */
export function useUnhandledLoadNotification(api: NotificationInstance): void {
  const { t } = useTranslation();

  useEffect(() => {
    const listener = (event: Event) => {
      const detail = (event as CustomEvent<UnhandledLoadErrorEventDetail>).detail;
      if (!detail) return;
      console.error("[toast-host] Необработанная ошибка загрузки:", detail.raw ?? detail);
      api.error({
        message: t("errors.unhandled-load"),
        description:
          detail.serverMessage ?? (detail.status > 0 ? `HTTP ${detail.status}` : detail.kind),
        duration: 6,
      });
    };

    subscribe(UiEvent.UnhandledLoadError, listener);
    return () => unsubscribe(UiEvent.UnhandledLoadError, listener);
  }, [api, t]);
}
