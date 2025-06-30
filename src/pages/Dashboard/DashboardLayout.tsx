import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./_component/app-sidebar";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
export default function DashboardLayout() {
  const adminData = useAppSelector((state) => state.admin);
  console.log(adminData, "Admin Data in Dashboard Layout");
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 bg-gradient-to-r from-[#042F16] via-[#6F9975] to-[#14400D]">
          <SidebarTrigger className="-ml-1" />
        </header>

        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
