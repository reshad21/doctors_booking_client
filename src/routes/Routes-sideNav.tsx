import {
  BellIcon,
  Building,
  Calendar,
  FileText,
  HelpCircle,
  KeySquareIcon,
  LayoutDashboard,
  LogOutIcon,
  MonitorPlayIcon,
  RepeatIcon,
  UserCog,
  Users
} from "lucide-react";

export const sideNavMenu = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    // isActive: false,
  },
  {
    title: "Patient",
    url: "/dashboard/patient",
    icon: Users,
  },
  {
    title: "Appointment Mgt",
    url: "/dashboard/appointment",
    icon: Calendar,
  },
  {
    title: "Prescription",
    url: "/dashboard/prescription",
    icon: FileText,
  },
  {
    title: "Chamber",
    url: "/dashboard/chamber",
    icon: Building,
  },
  {
    title: "Notice",
    url: "/dashboard/notice",
    icon: BellIcon,
  },
  {
    title: "Staff Management",
    url: "/dashboard/staff",
    icon: UserCog,
  },
  {
    title: "Service Details",
    url: "/dashboard/service",
    icon: HelpCircle,
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
  // {
  //   title: "Logout",
  //   url: "#",
  //   icon: LogOutIcon,
  //   // isActive: false,
  // },
];
