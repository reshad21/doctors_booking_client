import App from "@/App";
import AppointmentManagement from "@/pages/AppointmentManagement/AppointmentManagement";
import Chamber from "@/pages/Chamber/Chamber";
import DashboardLayout from "@/pages/Dashboard/DashboardLayout";
import DoctorDashboard from "@/pages/Dashboard/DoctorDashboard/DoctorDashboard";

import Login from "@/pages/Login/Login";
import Notice from "@/pages/Notice/Notice";
import Patient from "@/pages/Patient/Patient";
import Prescription from "@/pages/Prescription/Prescription";
import PrescriptionManagement from "@/pages/PrescriptionManagement/PrescriptionManagement";
import ServiceManagement from "@/pages/ServiceManagement/ServiceManagement";
import StaffManagement from "@/pages/StaffManagement/StaffManagement";
import UpdatePassword from "@/pages/UpdatePassword/UpdatePassword";
import WatchVideo from "@/pages/Watch Video/WatchVideo";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {path: "/dashboard", element: <DoctorDashboard/> },
      {path: "/dashboard/patient", element: <Patient /> },
      {path: "/dashboard/appointment", element: <AppointmentManagement/>},
      {path: "/dashboard/prescription", element: <Prescription/> },
      {path: "/dashboard/chamber", element: <Chamber/> },
      {path: "/dashboard/notice", element: <Notice/> },
      {path: "/dashboard/staff", element: <StaffManagement/>},
      {path: "/dashboard/service", element:<ServiceManagement/>},
      {path: "/dashboard/pre-management", element: <PrescriptionManagement/> },
      {path: "/dashboard/watch-video", element: <WatchVideo /> },
      {path: "/dashboard/update-password", element: <UpdatePassword /> },
     
      
    ],
  },

  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
