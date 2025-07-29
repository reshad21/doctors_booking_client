import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  clearUserToken,
  useCurrentToken,
} from "@/redux/api/features/authSlice";
import type { AppDispatch } from "@/redux/store";
import LoadingSpinner from "@/loading/LoadingSpinner";
const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const token = useAppSelector(useCurrentToken);
  const dispatch = useAppDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpired, setIsExpired] = useState(false);
const [isLoading, setIsLoading] = useState(true);

  // Only read permissions from Redux
  const routeAccess = useAppSelector((state) => state.routes.permissions);
  // const isLoadingPermissions = !routeAccess || routeAccess.length === 0;
  const isLoadingPermissions = false;
  console.log(isLoadingPermissions);
  

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    // Add a small delay to ensure permissions are loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);


    if (isLoadingPermissions) return;

    try {
      const decoded: { exp: number } = jwtDecode(token);
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp <= currentTimestamp) {
        setIsExpired(true);
        dispatch(clearUserToken());
        navigate("/login", { replace: true });
        return;
      }

      const currentPath = location.pathname;
      const normalizedPath = currentPath.startsWith("/")
        ? currentPath
        : `/${currentPath}`;

      const isAllowed = routeAccess.some((r) => {
        const cleanRoute = r.path.startsWith("/") ? r.path : `/${r.path}`;
        return r.allowed && normalizedPath.startsWith(cleanRoute);
      });

      if (!isAllowed && normalizedPath !== "/dashboard") {
        navigate("/unauthorized", { replace: true });
      }

      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Invalid token:", error);
      dispatch(clearUserToken());
      navigate("/login", { replace: true });
    }
  }, [token, dispatch, navigate, location.pathname, routeAccess, isLoadingPermissions]);

  if (!token || isExpired || isLoadingPermissions) {
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>;
  }

    if (isLoading) {
    return  <LoadingSpinner />;
   
  }

  return <>{children}</>;
};

export default PrivateRoute;
