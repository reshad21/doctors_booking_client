import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./_component/app-sidebar";
import { sideNavMenu } from "@/context/Routes-sideNav";
import { Link, Outlet } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Home, KeyRound, LogOut, User } from "lucide-react";
import { useGetAdminByTokenQuery } from "@/redux/api/admin/admin";
import { filterSideNavMenuByAccess } from "@/utils/filterSideNavMenu";
export default function DashboardLayout() {
  const { data: adminDataFromApi, isLoading } = useGetAdminByTokenQuery({});

  // Wait for user data before rendering dashboard
  if (isLoading) return null;

  const routeAccess = adminDataFromApi?.data?.routeAccess || [];
  const filteredMenu = filterSideNavMenuByAccess(sideNavMenu, routeAccess);

  return (
    <SidebarProvider>
      <AppSidebar sideNavMenu={filteredMenu} />
      <SidebarInset>
        <header className="flex justify-between h-20 shrink-0 items-center gap-2 px-4 bg-gradient-to-r from-[#042F16] via-[#6F9975] to-[#14400D]">
          <SidebarTrigger className="-ml-1" />

          <div className="flex items-center text-white">
            <Link to={"/"}>
              <Button variant="ghost" className="cursor-pointer">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white  ">
                  <div className="flex items-center space-x-1 ">
                    <Avatar className="w-6 h-6">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="Dr. Stven N Carter"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">Dr. Stven N Carter</span>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 border-none">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Update Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <KeyRound className="w-4 h-4 mr-2" />
                  Change Password
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="bg-[#F4F6F9]">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
