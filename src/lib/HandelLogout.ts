/* eslint-disable @typescript-eslint/no-explicit-any */
import { clearUserToken } from "@/redux/api/features/authSlice";
export const HandelLogout = (navigate:(path:string) => void,dispatch:any) =>{
    dispatch(clearUserToken())
    localStorage.removeItem("features");
    localStorage.removeItem("designation");
    navigate('/login')
}