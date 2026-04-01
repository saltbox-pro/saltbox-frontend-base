import { Button, Result } from "antd";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

export const ModuleAccessError = () => {
  const { t } = useTranslation();

  return (
    <Result
      status="404"
      title="404"
      subTitle={t("base.not-found")}
      extra={
        <Link to="/core/minions">
          <Button type="primary">{t("base.back-home")}</Button>
        </Link>
      }
    />
  );
};
