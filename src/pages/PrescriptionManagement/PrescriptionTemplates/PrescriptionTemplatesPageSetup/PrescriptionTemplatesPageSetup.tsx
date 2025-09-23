import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Stepper, { Step } from "@/components/shared/Stepper";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setCompleted,
  resetTemplate,
} from "@/redux/slices/prescriptionTemplateSlice";
import {
  PageSetup,
  PatientSection,
  BodySection,
  HeaderSection,
  FooterSection,
} from "../steps";

const PrescriptionTemplatesPageSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const prescriptionTemplate = useAppSelector(
    (state) => state.prescriptionTemplate
  );
  const [currentStep, setCurrentStep] = useState(1);

  const stepTitles = useMemo(
    () => [
      "Page Setup",
      "Patient Section",
      "Body Section",
      "Header Section",
      "Footer Section",
    ],
    []
  );

  const stepRoutes = useMemo(
    () => [
      "/dashboard/pre-management/prescription-templates/page-customize/page-setup",
      "/dashboard/pre-management/prescription-templates/page-customize/patient-section",
      "/dashboard/pre-management/prescription-templates/page-customize/body-section",
      "/dashboard/pre-management/prescription-templates/page-customize/header-section",
      "/dashboard/pre-management/prescription-templates/page-customize/footer-section",
    ],
    []
  );

  // Determine current step based on route
  useEffect(() => {
    const currentPath = location.pathname;
    const stepIndex = stepRoutes.findIndex((route) => currentPath === route);
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex + 1);
    } else if (
      currentPath === "/dashboard/pre-management/prescription-templates"
    ) {
      // Default to first step if on main route
      navigate(stepRoutes[0], { replace: true });
    }
  }, [location.pathname, navigate, stepRoutes]);

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    navigate(stepRoutes[step - 1]);
    // Log current template state when switching steps
    console.log("Current template state:", prescriptionTemplate);
  };

  const handleFinalStepCompleted = () => {
    // Mark template as completed in Redux
    dispatch(setCompleted(true));
    console.log("Prescription template setup completed!", prescriptionTemplate);
    // You might want to navigate to a success page or back to the main prescription templates list
  };

  // Check if we're on a sub-route
  const isOnSubRoute = stepRoutes.includes(location.pathname);

  if (
    !isOnSubRoute &&
    location.pathname !== "/dashboard/pre-management/prescription-templates"
  ) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen py-4">
      {/* Debug Panel - Remove in production */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-semibold text-blue-800">
              Debug: Template State
            </h4>
            <p className="text-sm text-blue-600">
              Chamber:{" "}
              {prescriptionTemplate.pageSetup.chamberId || "Not selected"} |
              Page Type: {prescriptionTemplate.pageSetup.pageType} | Completed:{" "}
              {prescriptionTemplate.isCompleted ? "Yes" : "No"}
            </p>
          </div>
          <button
            onClick={() => {
              dispatch(resetTemplate());
              console.log("Template reset");
            }}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            Reset Template
          </button>
        </div>
      </div>

      <Stepper
        initialStep={currentStep}
        onStepChange={handleStepChange}
        onFinalStepCompleted={handleFinalStepCompleted}
        stepTitles={stepTitles}
        stepCircleContainerClassName="border-0"
      >
        <Step>
          <PageSetup />
        </Step>
        <Step>
          <PatientSection />
        </Step>
        <Step>
          <BodySection />
        </Step>
        <Step>
          <HeaderSection />
        </Step>
        <Step>
          <FooterSection />
        </Step>
      </Stepper>
    </div>
  );
};

export default PrescriptionTemplatesPageSetup;
