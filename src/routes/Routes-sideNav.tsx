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

export const sideNavMenu = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: GroupIcon,
    isActive: true,
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
