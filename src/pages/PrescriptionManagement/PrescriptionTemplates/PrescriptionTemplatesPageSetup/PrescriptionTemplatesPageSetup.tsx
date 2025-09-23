import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Stepper, { Step } from "@/components/shared/Stepper";
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
  };

  const handleFinalStepCompleted = () => {
    // Handle completion logic here
    console.log("Prescription template setup completed!");
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
