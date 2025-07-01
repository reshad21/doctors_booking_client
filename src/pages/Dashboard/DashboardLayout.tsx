import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./_component/app-sidebar";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { useCurrentToken } from "@/redux/api/features/authSlice";
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
export default function DashboardLayout() {
  const token = useAppSelector(useCurrentToken);
  console.log(token);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex justify-between h-20 shrink-0 items-center gap-2 px-4 bg-gradient-to-r from-[#042F16] via-[#6F9975] to-[#14400D]">
          <SidebarTrigger className="-ml-1" />

          <div className="flex items-center text-white">
            <Button variant="ghost">
              <Home className="w-4 h-4" />
              <span className="">Home</span>
            </Button>

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

        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
