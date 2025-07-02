// Utility to filter menu by route access
import type { sideNavMenu as SideNavMenuType } from "../context/Routes-sideNav";

type SideNavMenuItem = (typeof SideNavMenuType)[number];
type RouteAccessItem = { path: string; allowed: boolean };

export function filterSideNavMenuByAccess(
  menu: SideNavMenuItem[],
  routeAccess: RouteAccessItem[]
): SideNavMenuItem[] {
  if (!Array.isArray(routeAccess)) return menu;
  const allowedPaths = routeAccess
    .filter((r) => r.allowed)
    .map((r) => {
      const p = r.path.startsWith("/") ? r.path : `/${r.path}`;
      return p.startsWith("/dashboard") ? p : `/dashboard${p}`;
    });
  return menu.filter(
    (item) => allowedPaths.includes(item.url) || item.url === "#" // Always show logout
  );
}
