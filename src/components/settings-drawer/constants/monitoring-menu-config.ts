export const MONITORING_MENU_CONFIG = {
  key: "monitoring",
  label: "Monitoring",
  children: [
    {
      key: "dashboard",
      path: "/grafana",
      label: { en: "Dashboard", ru: "Дашборд" },
      icon: "dashboard",
    },
    {
      key: "logs",
      path: "/grafana/a/grafana-lokiexplore-app",
      label: { en: "Logs", ru: "Логи" },
      icon: "history",
    },
  ],
} as const;
