import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  // SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOutIcon } from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import { HandelLogout } from "@/lib/HandelLogout";
// import onecare4u from "@/assets/onecare4u.png"
import type { sideNavMenu as SideNavMenuType } from "@/context/Routes-sideNav";

type SideNavMenuItem = (typeof SideNavMenuType)[number];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  sideNavMenu: SideNavMenuItem[];
}

export function AppSidebar({ sideNavMenu, ...props }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  return (
    <Sidebar {...props}>
      <SidebarContent className="bg-[#25102E] text-white pt-8">
        <SidebarMenu className="space-y-1 px-2 flex-1">
          {sideNavMenu.map((item) => {
            const isActive =
              item.url === "/dashboard"
                ? location.pathname === item.url
                : location.pathname.startsWith(item.url);

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-[#043619] via-[#19924B] to-[#032E15]  !text-white"
                      : ""
                  }`}
                >
                  <Link to={item.url}>
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
        <div
          className="px-5 py-4 text-sm flex justify-start items-center gap-2 cursor-pointer mt-auto"
          onClick={() => HandelLogout(navigate, dispatch)}
        >
          <LogOutIcon className="size-4 " />
          Log-out
        </div>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
