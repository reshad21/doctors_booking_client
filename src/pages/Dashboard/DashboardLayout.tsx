import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./_component/app-sidebar";
import { sideNavMenu } from "@/context/Routes-sideNav";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, Home, KeyRound, LogOut, User } from "lucide-react";
import { useGetAdminByTokenQuery } from "@/redux/api/admin/admin";
import { filterSideNavMenuByAccess } from "@/utils/filterSideNavMenu";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setPermissions } from "@/redux/api/features/permissionSlice";
import { useEffect, useMemo } from "react";
import type { PermissionItem } from "@/redux/api/features/permissionSlice";
// import onecare4u from "@/assets/onecare4u.png"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HandelLogout } from "@/lib/HandelLogout";
import { useGetStaffsDoctorQuery } from "@/redux/api/staff/staff";
import { decodeToken } from "@/hooks/decodedToken";

export default function DashboardLayout() {
  const { data: staffsDoctor } = useGetStaffsDoctorQuery({});
  const { data: adminDataFromApi, isLoading } = useGetAdminByTokenQuery({});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const doctor = useAppSelector((state) => state.admin);
  const token = useAppSelector((state) => state.auth)?.token;
  const decoded = decodeToken(token);
  console.log(decoded);

  const routeAccess: PermissionItem[] = useMemo(
    () =>
      Array.isArray(adminDataFromApi?.data?.routeAccess)
        ? adminDataFromApi.data.routeAccess
        : [],
    [adminDataFromApi]
  );

  const filteredMenu = useMemo(
    () => filterSideNavMenuByAccess(sideNavMenu, routeAccess),
    [routeAccess]
  );

  useEffect(() => {
    if (routeAccess.length > 0) {
      dispatch(setPermissions(routeAccess));
    }
  }, [dispatch, routeAccess]);

  if (isLoading) return null;
  const date = new Date();
  const year = date.getFullYear();

  return (
    <SidebarProvider className="max-h-[100vh] bg-[#f4f6f9]">
      <AppSidebar sideNavMenu={filteredMenu} />
      <SidebarInset>
        <header className="sticky top-0 z-50 flex justify-between h-20 shrink-0 items-center gap-2 px-4 bg-gradient-to-r from-[#042F16] via-[#6F9975] to-[#14400D]">
          <div className="flex justify-start items-center gap-5">
            <SidebarTrigger className="" />
            <div className="text-white font-semibold">{staffsDoctor?.data?.name}</div>
          </div>
          {/* <div className="text-white font-semibold bg-[#91c69d] bg-linear-to-r from-[#B0C6B5] to-[#91c69d] rounded-md h-[4.7rem]">
                <img src={onecare4u} alt=""  className="w-64 h-[4.7rem]"/>
              </div> */}
          <div className="flex items-center text-[#E8E8E8] ">
            <Link to="/" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" className="cursor-pointer">
                <Home className="w-4 h-4" />
                <span>Display Serial</span>
              </Button>
            </Link>
            <DropdownMenu>
              {staffsDoctor?.data?.name && (
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white cursor-pointer">
                    <div className="flex items-center space-x-1 ">
                      <Avatar className="w-6 h-6">
                        {decoded?.profilePhoto != "N/A" && (
                          <AvatarImage
                            src={decoded?.profilePhoto}
                            alt={decoded?.name}
                            className="object-cover"
                          />
                        )}
                        {decoded?.profilePhoto == "N/A" && (
                          <AvatarImage
                            src="/images/doctorprofile.png?height=48&width=48"
                            alt={decoded?.profilePhoto}
                          />
                        )}
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{decoded.name}</span>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
              )}
              {!staffsDoctor?.data?.name && (
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white cursor-pointer">
                    <div className="flex items-center space-x-1 ">
                      <Avatar className="w-6 h-6">
                        {doctor?.profilePhoto != "N/A" && (
                          <AvatarImage
                            src={doctor?.profilePhoto}
                            alt={doctor?.name}
                            className="object-cover"
                          />
                        )}
                        {doctor?.profilePhoto == "N/A" && (
                          <AvatarImage
                            src="/images/doctorprofile.png?height=48&width=48"
                            alt={doctor?.name}
                          />
                        )}
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{doctor?.name}</span>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
              )}

              <DropdownMenuContent
                align="end"
                className="w-48 border-none cursor-pointer"
              >
                <DropdownMenuItem className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Update Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <KeyRound className="w-4 h-4 mr-2" />
                  Change Password
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 cursor-pointer"
                  onClick={() => HandelLogout(navigate, dispatch)}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="">
          <Outlet />
          <div className=" flex justify-center items-center py-2 font-semibold text-xs bg-[#F4F6F9]">
            Technology Partner{" "}
            <a href="https://mntechdigital.com/" className="px-1">
              <u>MNTECH DIGITAL</u>
            </a>{" "}
            | @{year} OneCare4u{" "}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
