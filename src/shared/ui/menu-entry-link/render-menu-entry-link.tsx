import type { ReactNode } from "react";
import { Link } from "react-router";

import type { MenuEntry } from "../../model/menu";

export const renderMenuEntryLink = (
  entry: MenuEntry,
  content: ReactNode,
  onNavigate?: () => void
): ReactNode => {
  if (entry.href) {
    return (
      <a href={entry.href} target="_blank" rel="noopener noreferrer" onClick={onNavigate}>
        {content}
      </a>
    );
  }

  if (entry.path && !entry.drawer) {
    return (
      <Link to={entry.path} onClick={onNavigate}>
        {content}
      </Link>
    );
  }

  return content;
};
