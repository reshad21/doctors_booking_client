import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { sideNavMenu } from "@/routes/Routes-sideNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  return (
    <Sidebar {...props}>
      <SidebarHeader className="bg-[#25102E] text-white">
        {/* Profile Section */}
        <div className="p-4 border-b border-purple-700">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src="/public/images/doctorprofile.png?height=48&width=48"
                alt="Dr. Stven N Carter"
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm">Dr. Stven N Carter</h3>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-green-400">Subscription</span>
                <span className="text-xs bg-green-500 px-2 py-0.5 rounded text-white">
                  Single
                </span>
              </div>
            </div>
          </div>
        </div>
        <h1 className="text-xs font-semibold text-white uppercase tracking-wider">
          Main Menu
        </h1>
      </SidebarHeader>
      <SidebarContent className="bg-[#25102E] text-white">
        <SidebarMenu className="space-y-1 px-2">
          {/* {sideNavMenu.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={item.isActive}>
                <Link to={item.url}>
                  
                  <item.icon /> <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))} */}
          {sideNavMenu.map((item) => {
            // const isActive = location.pathname.startsWith(item.url);
            const isActive =
              item.url === "/dashboard"
                ? location.pathname === item.url
                : location.pathname.startsWith(item.url);

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${isActive
                    ? "bg-gradient-to-r from-[#043619] via-[#19924B] to-[#032E15]  !text-white"
                    : ""
                    }`}
                >
                  <Link to={item.url} >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
