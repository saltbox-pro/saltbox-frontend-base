function isPathActive(pathname: string, itemPath: string): boolean {
  return pathname === itemPath || pathname.startsWith(itemPath + "/");
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
        const itemPath = child.path ?? child.href;
        if (itemPath && isPathActive(pathname, itemPath)) {
          matchingChildren.push({ key: child.key, path: itemPath });
        }

        if (child.submenu) {
          const activeSubmenuItem = child.submenu.find(
            (sub: any) => (sub.path ?? sub.href) && isPathActive(pathname, sub.path ?? sub.href)
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
    } else if (item.path && isPathActive(pathname, item.path)) {
      selectedKeys.push(item.key);
    }
  });

  return { selectedKeys, openKeys };
}

export function getActiveSubmenuKeys(pathname: string, submenuItems: any[]): string[] {
  const matchingItems = submenuItems
    .filter((item) => item.path && isPathActive(pathname, item.path))
    .map((item) => ({ key: item.key, path: item.path }));

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
