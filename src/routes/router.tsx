import App from "@/App";
import AppointmentManagement from "@/pages/AppointmentManagement/AppointmentManagement";
import Chamber from "@/pages/Chamber/Chamber";
import DashboardLayout from "@/pages/Dashboard/DashboardLayout";
import DoctorDashboard from "@/pages/Dashboard/DoctorDashboard/DoctorDashboard";

import Login from "@/pages/Login/Login";
import Notice from "@/pages/Notice/Notice";
import Patient from "@/pages/Patient/Patient";
import CreatePrescription from "@/pages/Prescription/CreatePrescription/CreatePrescription";
import Prescription from "@/pages/Prescription/Prescription";
import ViewPrescription from "@/pages/Prescription/ViewPrescription/ViewPrescription";
import PrescriptionManagement from "@/pages/PrescriptionManagement/PrescriptionManagement";
import ServiceManagement from "@/pages/ServiceManagement/ServiceManagement";
import StaffLogin from "@/pages/StaffLogin/StaffLogin";
import StaffManagement from "@/pages/StaffManagement/StaffManagement";
import UpdatePassword from "@/pages/UpdatePassword/UpdatePassword";
import WatchVideo from "@/pages/Watch Video/WatchVideo";
import PrivateRout from "@/PrivateRoute/PrivateRoute";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRout>
        <DashboardLayout />
      </PrivateRout>
    ),
    children: [
      { path: "", element: <DoctorDashboard /> },
      { path: "/dashboard/patient", element: <Patient /> },
      { path: "/dashboard/appointment", element: <AppointmentManagement /> },
      { path: "/dashboard/prescription", element: <Prescription /> },
      { path: "/dashboard/create-prescription/:patientId", element: <CreatePrescription /> },
      { path: "/dashboard/view-prescription/:patientId", element: <ViewPrescription /> },
      { path: "/dashboard/chamber", element: <Chamber /> },
      { path: "/dashboard/notice", element: <Notice /> },
      { path: "/dashboard/staff", element: <StaffManagement /> },
      { path: "/dashboard/service", element: <ServiceManagement /> },
      {
        path: "/dashboard/pre-management",
        element: <PrescriptionManagement />,
      },
      { path: "/dashboard/watch-video", element: <WatchVideo /> },
      { path: "/dashboard/update-password", element: <UpdatePassword /> },
    ],
  },

  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/staff-login",
    element: <StaffLogin />,
  },
]);

export default router;
