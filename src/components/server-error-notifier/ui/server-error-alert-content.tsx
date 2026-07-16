import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { ServerErrorEventDetail } from "@saltbox/saltbox-frontend-common";
import { theme } from "antd";
import { useState, type CSSProperties } from "react";

import styles from "./server-error-notifier.module.css";

type Labels = {
  showDetails: string;
  hideDetails: string;
  method: string;
  url: string;
  status: string;
  time: string;
  responseBody: string;
};

type ServerErrorAlertContentProps = {
  detail: ServerErrorEventDetail;
  labels: Labels;
};

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  return date.toLocaleString();
};

const MetaRows = ({
  detail,
  labels,
  responseBody,
}: {
  detail: ServerErrorEventDetail;
  labels: Labels;
  responseBody?: string;
}) => (
  <div className={styles.metaBlock}>
    <dl className={styles.metaList}>
      {detail.method ? (
        <>
          <dt>{labels.method}</dt>
          <dd>{detail.method}</dd>
        </>
      ) : null}
      <dt>{labels.url}</dt>
      <dd className={styles.metaUrl}>{detail.url}</dd>
      <dt>{labels.status}</dt>
      <dd>
        {detail.status}
        {detail.statusText ? ` ${detail.statusText}` : ""}
      </dd>
      <dt>{labels.time}</dt>
      <dd>{formatTime(detail.timestamp)}</dd>
    </dl>
    {responseBody ? (
      <div className={styles.bodyBlock}>
        <div className={styles.bodyLabel}>{labels.responseBody}</div>
        <pre className={styles.bodyPre}>{responseBody}</pre>
      </div>
    ) : null}
  </div>
);

export const ServerErrorAlertContent = ({ detail, labels }: ServerErrorAlertContentProps) => {
  const { token } = theme.useToken();
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => setExpanded((prev) => !prev);

  return (
    <div
      className={styles.soft}
      style={
        {
          "--text-secondary": token.colorTextSecondary,
          "--fill": token.colorFillAlter,
          "--border": token.colorBorderSecondary,
        } as CSSProperties
      }
    >
      {detail.message ? <p className={styles.softMessage}>{detail.message}</p> : null}
      <button
        type="button"
        className={styles.detailsToggle}
        onClick={handleToggle}
        aria-expanded={expanded}
      >
        <span>{expanded ? labels.hideDetails : labels.showDetails}</span>
        {expanded ? (
          <UpOutlined className={styles.chevron} />
        ) : (
          <DownOutlined className={styles.chevron} />
        )}
      </button>
      {expanded ? (
        <div className={styles.softDetails}>
          <MetaRows detail={detail} labels={labels} responseBody={detail.responseBody} />
        </div>
      ) : null}
    </div>
  );
};
