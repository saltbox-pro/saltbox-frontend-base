import {
  UiEvent,
  UnhandledLoadErrorEventDetail,
  subscribe,
  unsubscribe,
  type ShowToast,
} from "@saltbox/saltbox-frontend-common";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * Страховочная сетка: ошибка загрузки, у которой не оказалось ни одной ErrorZone
 * или таблицы (bind-счётчик лоадера равен нулю). Гарантия «ни одна ошибка не молчит».
 * Показывается тем же рендерером, что и обычные тосты: код с расшифровкой, детали,
 * копирование — именно здесь они нужнее всего, место ошибки неизвестно.
 */
export function useUnhandledLoadNotification(showToast: ShowToast): void {
  const { t } = useTranslation();

  useEffect(() => {
    const listener = (event: Event) => {
      const detail = (event as CustomEvent<UnhandledLoadErrorEventDetail>).detail;
      if (!detail) return;
      console.error("[toast-host] Необработанная ошибка загрузки:", detail.raw ?? detail);
      showToast({
        type: "error",
        title: t("errors.unhandled-load"),
        description: detail.serverMessage,
        errorCode: { status: detail.status, kind: detail.kind },
        debugText: detail.debugText,
      });
    };

    subscribe(UiEvent.UnhandledLoadError, listener);
    return () => unsubscribe(UiEvent.UnhandledLoadError, listener);
  }, [showToast, t]);
}
