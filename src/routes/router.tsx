import App from "@/App";
import AppointmentManagement from "@/pages/AppointmentManagement/AppointmentManagement";
import Chamber from "@/pages/Chamber/Chamber";
import DashboardLayout from "@/pages/Dashboard/DashboardLayout";
import DoctorDashboard from "@/pages/Dashboard/DoctorDashboard/DoctorDashboard";
import Login from "@/pages/Login/Login";
import NewPrescription from "@/pages/NewPrescription/NewPrescription";
import Notice from "@/pages/Notice/Notice";
import Patient from "@/pages/Patient/Patient";
// import CreatePrescription from "@/pages/Prescription/CreatePrescription/CreatePrescription";
import Prescription from "@/pages/NewPrescription/Prescription";
import UpdatePrescription from "@/pages/Prescription/UpdatePrescription/UpdatePrescription";
import ViewPrescription from "@/pages/Prescription/ViewPrescription/ViewPrescription";
import AdviceInput from "@/pages/PrescriptionManagement/ClinicalNotes/AdviceInput/AdviceInput";
import ChiefComplaintInput from "@/pages/PrescriptionManagement/ClinicalNotes/ChiefComplaintInput/ChiefComplaintInput";
import ClinicalNotes from "@/pages/PrescriptionManagement/ClinicalNotes/ClinicalNotes";
import DiagnosisInput from "@/pages/PrescriptionManagement/ClinicalNotes/DiagnosisInput/DiagnosisInput";
import HistoryInput from "@/pages/PrescriptionManagement/ClinicalNotes/HistoryInput/HistoryInput";
import InvestigationInput from "@/pages/PrescriptionManagement/ClinicalNotes/InvestigationInput/InvestigationInput";
import NextVisitInput from "@/pages/PrescriptionManagement/ClinicalNotes/NextVisitInput/NextVisitInput";
import OnExaminationsInput from "@/pages/PrescriptionManagement/ClinicalNotes/OnExaminationsInput/OnExaminationsInput";
import MedicineManagement from "@/pages/PrescriptionManagement/MedicineManagement/MedicineManagement";
import PreManagement from "@/pages/PrescriptionManagement/PreManagement";
import PrescriptionPageSetup from "@/pages/PrescriptionManagement/PrescriptionPageSetup/PrescriptionPageSetup";
import PrescriptionTemplates from "@/pages/PrescriptionManagement/PrescriptionTemplates/PrescriptionTemplates";
import PrescriptionTemplatesPageSetup from "@/pages/PrescriptionManagement/PrescriptionTemplates/PrescriptionTemplatesPageSetup/PrescriptionTemplatesPageSetup";
import ServiceManagement from "@/pages/ServiceManagement/ServiceManagement";
import StaffLogin from "@/pages/StaffLogin/StaffLogin";
import StaffManagement from "@/pages/StaffManagement/StaffManagement";
import UnauthorizedPage from "@/pages/Unauthorize/Unauthorize";
import UpdatePassword from "@/pages/UpdatePassword/UpdatePassword";
import WatchVideo from "@/pages/Watch Video/WatchVideo";
import PrivateRoute from "@/PrivateRoute/PrivateRoute";
import { createBrowserRouter } from "react-router-dom";
import DemoDoctorForm from "@/pages/DemoDoctor/DemoDoctor";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [],
  },
  {
    path: '/secret/create-demo-doctor',
    element: <DemoDoctorForm />
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "",
        element: <DoctorDashboard />,
      },
      {
        path: "/dashboard/patient",
        element: <Patient />,
      },
      {
        path: "/dashboard/appointment",
        element: <AppointmentManagement />,
      },
      {
        path: "/dashboard/prescription",
        // element: <NewPrescription />,
        element: <Prescription />,
      },
      {
        path: "/dashboard/create-prescription/:patientId",
        element: <NewPrescription />,
        // element: <CreatePrescription />,
      },
      {
        path: "/dashboard/view-prescription/:patientId",
        element: <ViewPrescription key={window.location.pathname} />,
      },
      {
        path: "/dashboard/update-prescription/:prescriptionId",
        element: <UpdatePrescription />,
      },
      {
        path: "/dashboard/chamber",
        element: <Chamber />,
      },
      {
        path: "/dashboard/notice",
        element: <Notice />,
      },
      {
        path: "/dashboard/staff",
        element: <StaffManagement />,
      },
      {
        path: "/dashboard/service",
        element: <ServiceManagement />,
      },
      {
        path: "/dashboard/pre-management",
        element: <PreManagement />,
      },
      {
        path: "/dashboard/pre-management/medicine",
        element: <MedicineManagement />,
      },
      {
        path: "/dashboard/pre-management/prescription-templates",
        element: <PrescriptionTemplates />,
      },
      {
        path: "/dashboard/pre-management/prescription-templates/page-customize",
      },
      {
        path: "/dashboard/pre-management/clinical-notes",
        element: <ClinicalNotes />,
      },
      {
        path: "/dashboard/pre-management/clinical-notes/chief-complaint-input",
        element: <ChiefComplaintInput />,
      },
      {
        path: "/dashboard/pre-management/clinical-notes/on-examinations-input",
        element: <OnExaminationsInput />,
      },
      {
        path: "/dashboard/pre-management/clinical-notes/diagnosis-input",
        element: <DiagnosisInput />,
      },
      {
        path: "/dashboard/pre-management/clinical-notes/investigation-input",
        element: <InvestigationInput />,
      },
      {
        path: "/dashboard/pre-management/clinical-notes/history-input",
        element: <HistoryInput />,
      },
      {
        path: "/dashboard/pre-management/clinical-notes/advice-input",
        element: <AdviceInput />,
      },
      {
        path: "/dashboard/pre-management/clinical-notes/next-visit-input",
        element: <NextVisitInput />,
      },
      {
        path: "/dashboard/pre-management/prescription-page-setup",
        element: <PrescriptionPageSetup />,
      },
      {
        path: "/dashboard/pre-management/create-prescription-page-setup",
        element: <PrescriptionTemplatesPageSetup />,
        children: [
          {
            path: "page-setup",
            element: <></>,
          },
          {
            path: "patient-section",
            element: <></>,
          },
          {
            path: "body-section",
            element: <></>,
          },
          {
            path: "header-section",
            element: <></>,
          },
          {
            path: "footer-section",
            element: <></>,
          },
        ],
      },
      {
        path: "/dashboard/watch-video",
        element: <WatchVideo />,
      },
      {
        path: "/dashboard/update-password",
        element: <UpdatePassword />,
      },
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
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
]);

export default router;
