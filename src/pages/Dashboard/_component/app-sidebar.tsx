import * as React from "react";
import {
  BellIcon,
  BriefcaseBusiness,
  ClipboardList,
  GitCompareArrowsIcon,
  GroupIcon,
  KeySquareIcon,
  LogOutIcon,
  MonitorPlayIcon,
  PersonStanding,
  RepeatIcon,
  StethoscopeIcon,
  VenusAndMars,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

// This is sample data.

const sideNavMenu = [
  {
    title: "Dashboard",
    url: "#",
    icon: GroupIcon,
    isActive: false,
  },
  {
    title: "Patient",
    url: "/dashboard/patient",
    icon: VenusAndMars,
  },
  {
    title: "Appointment Mgt",
    url: "/dashboard/appointment",
    icon: StethoscopeIcon,
  },
  {
    title: "Prescription",
    url: "/dashboard/prescription",
    icon: ClipboardList,
  },
  {
    title: "Chamber",
    url: "/dashboard/chamber",
    icon: BriefcaseBusiness,
  },
  {
    title: "Notice",
    url: "/dashboard/notice",
    icon: BellIcon,
  },
  {
    title: "Staff Management",
    url: "/dashboard/staff",
    icon: PersonStanding,
  },
  {
    title: "Service Details",
    url: "/dashboard/service",
    icon: GitCompareArrowsIcon,
  },
  {
    title: "Pre Management",
    url: "/dashboard/pre-management",
    icon: RepeatIcon,
  },
  {
    title: "Watch Video",
    url: "/dashboard/watch-video",
    icon: MonitorPlayIcon,
  },
  {
    title: "Update Password",
    url: "/dashboard/update-password",
    icon: KeySquareIcon,
  },
  {
    title: "Logout",
    url: "#",
    icon: LogOutIcon,
     isActive: false, 
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <h1 className="font-semibold">Main Menu</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {sideNavMenu.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={item.isActive}>
                <Link to={item.url}>
                  
                  <item.icon /> <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
