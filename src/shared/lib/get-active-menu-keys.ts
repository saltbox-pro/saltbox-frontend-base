function isPathActive(pathname: string, itemPath: string): boolean {
  return pathname === itemPath || pathname.startsWith(itemPath + "/");
}

function getMenuItemPaths(item: {
  path?: string;
  href?: string;
  additionalActivePaths?: string[];
}): string[] {
  return [
    ...(item.additionalActivePaths ?? []),
    ...(item.path ? [item.path] : []),
    ...(item.href ? [item.href] : []),
  ];
}

function isMenuItemActive(
  pathname: string,
  item: { path?: string; href?: string; additionalActivePaths?: string[] }
): boolean {
  return getMenuItemPaths(item).some((itemPath) => isPathActive(pathname, itemPath));
}

function getLongestActiveMenuItemPath(
  pathname: string,
  item: { path?: string; href?: string; additionalActivePaths?: string[] }
): string | null {
  const matchingPaths = getMenuItemPaths(item).filter((itemPath) =>
    isPathActive(pathname, itemPath)
  );

  if (matchingPaths.length === 0) {
    return null;
  }

  return matchingPaths.reduce((prev, current) => (current.length > prev.length ? current : prev));
}

export function getActiveMenuKeys(
  pathname: string,
  menuConfig: any[]
): {
  selectedKeys: string[];
  openKeys: string[];
} {
  const selectedKeys: string[] = [];
  const openKeys: string[] = [];

  menuConfig.forEach((item) => {
    if (item.children) {
      const matchingChildren: { key: string; path: string }[] = [];

      item.children.forEach((child: any) => {
        const matchedPath = getLongestActiveMenuItemPath(pathname, child);
        if (matchedPath) {
          matchingChildren.push({ key: child.key, path: matchedPath });
        }

        if (child.submenu) {
          const activeSubmenuItem = child.submenu.find((sub: any) =>
            isMenuItemActive(pathname, sub)
          );
          if (activeSubmenuItem) {
            selectedKeys.push(child.key);
            selectedKeys.push(activeSubmenuItem.key);
            openKeys.push(child.key);
          }
        }
      });

      if (matchingChildren.length > 0) {
        const mostSpecific = matchingChildren.reduce((prev, current) =>
          current.path.length > prev.path.length ? current : prev
        );
        selectedKeys.push(mostSpecific.key);
      }
    } else if (isMenuItemActive(pathname, item)) {
      selectedKeys.push(item.key);
    }
  });

  return { selectedKeys, openKeys };
}

export function getActiveSubmenuKeys(pathname: string, submenuItems: any[]): string[] {
  const matchingItems = submenuItems
    .map((item) => {
      const matchedPath = getLongestActiveMenuItemPath(pathname, item);
      return matchedPath ? { key: item.key, path: matchedPath } : null;
    })
    .filter((item): item is { key: string; path: string } => item !== null);

  if (matchingItems.length === 0) {
    return [];
  }

  if (matchingItems.length === 1) {
    return [matchingItems[0].key];
  }

  const mostSpecific = matchingItems.reduce((prev, current) =>
    current.path.length > prev.path.length ? current : prev
  );
  return [mostSpecific.key];
}
