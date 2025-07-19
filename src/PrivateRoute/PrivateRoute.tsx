import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  clearUserToken,
  useCurrentToken,
} from "@/redux/api/features/authSlice";
import type { AppDispatch } from "@/redux/store";

const PrivateRout = ({ children }: { children: ReactNode }) => {
  const token = useAppSelector(useCurrentToken);
  const routeAccess = useAppSelector((state) => state.routes.permissions);
  const dispatch = useAppDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const decoded: { exp: number } = jwtDecode(token);
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp <= currentTimestamp) {
        setIsExpired(true);
        dispatch(clearUserToken());
        navigate("/login", { replace: true });
        return;
      }

      // Route-level access check
      const currentPath = location.pathname;
      const normalizedPath = currentPath.startsWith("/")
        ? currentPath
        : `/${currentPath}`;


      const isAllowed = routeAccess.some((r) => {
        const cleanRoute = r.path.startsWith("/") ? r.path : `/${r.path}`;
        const allowed = r.allowed && normalizedPath.startsWith(cleanRoute);

        return allowed;
      });

      if (!isAllowed && normalizedPath !== "/dashboard") {
        navigate("/unauthorized", { replace: true });
      }
    } catch (error) {
      console.error("Invalid token:", error);
      dispatch(clearUserToken());
      navigate("/login", { replace: true });
    }
  }, [token, dispatch, navigate, location.pathname, routeAccess]);

  if (!token || isExpired) {
    return null;
  }

  return <>{children}</>;
};

export default PrivateRout;
