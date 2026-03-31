import { Button, Result } from "antd";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

type ModuleState = "active" | "disabled" | "unavailable" | "disconnected" | null;

interface ModuleAccessErrorProps {
  moduleState: ModuleState;
}

export const ModuleAccessError = ({ moduleState }: ModuleAccessErrorProps) => {
  const { t } = useTranslation();

  if (moduleState === "unavailable") {
    return (
      <Result
        status="error"
        title="503"
        subTitle={t("errors.service-unavailable-message")}
        extra={
          <Link to="/gateway">
            <Button type="primary">{t("errors.service-unavailable-button")}</Button>
          </Link>
        }
      />
    );
  }

  return (
    <Result
      status="404"
      title="404"
      subTitle={t("errors.not-found-message")}
      extra={
        <Link to="/core/minions">
          <Button type="primary">{t("errors.back-home-button")}</Button>
        </Link>
      }
    />
  );
};
