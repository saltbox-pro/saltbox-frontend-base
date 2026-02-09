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
      item.children.forEach((child: any) => {
        if (child.path && isPathActive(pathname, child.path)) {
          selectedKeys.push(child.key);
        }

        if (child.submenu) {
          const activeSubmenuItem = child.submenu.find(
            (sub: any) => sub.path && isPathActive(pathname, sub.path)
          );
          if (activeSubmenuItem) {
            selectedKeys.push(child.key);
            selectedKeys.push(activeSubmenuItem.key);
            openKeys.push(child.key);
          }
        }
      });
    } else if (item.path && isPathActive(pathname, item.path)) {
      selectedKeys.push(item.key);
    }
  });

  return { selectedKeys, openKeys };
}

export function getActiveSubmenuKeys(pathname: string, submenuItems: any[]): string[] {
  return submenuItems
    .filter((item) => item.path && isPathActive(pathname, item.path))
    .map((item) => item.key);
}
