// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useState, useMemo } from "react";
// import { useNavigate, useLocation, Outlet } from "react-router-dom";
// import Stepper, { Step } from "@/components/shared/Stepper";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import {
//   setCompleted,
//   resetTemplate,
//   setPageSetup,
//   setPatientSection,
//   setBodySection,
//   setHeaderSection,
//   setFooterSection,
// } from "@/redux/slices/prescriptionTemplateSlice";
// import {
//   PageSetup,
//   PatientSection,
//   BodySection,
//   HeaderSection,
//   FooterSection,
// } from "../steps";
// import {
//   useCreatePrescriptionPageSetupMutation,
//   useGetPrescriptionPageSetupByIdQuery,
// } from "@/redux/api/PreManagement/PrescriptionPageSetupApi";
// import { useCurrentToken } from "@/redux/api/features/authSlice";
// import { jwtDecode } from "jwt-decode";
// import toast from "react-hot-toast";
// import { store } from "@/redux/store";

// const PrescriptionTemplatesPageSetup = () => {
//   const [createPrescriptionPageSetup] =
//     useCreatePrescriptionPageSetupMutation();
//   const token = useAppSelector(useCurrentToken);
//   const decoded: { id: string } = jwtDecode(token);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useAppDispatch();
//   const prescriptionTemplate = useAppSelector(
//     (state) => state.prescriptionTemplate
//   );
//   const [currentStep, setCurrentStep] = useState(1);

//   const id = location?.state?.id || null;

//   const { data: updatePrescriptionData } =
//     useGetPrescriptionPageSetupByIdQuery(id);

//   useEffect(() => {
//     if (updatePrescriptionData?.data) {
//       const data = updatePrescriptionData.data;

//       // 1️⃣ Page Setup
//       if (data.PrescriptionPageSetup?.[0]) {
//         const page = data.PrescriptionPageSetup[0];
//         console.log(page, "page");
//         dispatch(
//           setPageSetup({
//             status: page.status || "a4",
//             chamberId: data.chamberId || "",
//             totalHeight: Number(page.totalHeight),
//             totalWidth: Number(page.totalWidth),
//             leftMargin: Number(page.leftMargin),
//             rightMargin: Number(page.rightMargin),
//             topMargin: Number(page.topMargin),
//             bottomMargin: Number(page.bottomMargin),
//           })
//         );
//         console.log("Page setup dispatched:", {
//           status: page.status || "a4",
//           chamberId: data.chamberId || "",
//           totalHeight: Number(page.totalHeight),
//           totalWidth: Number(page.totalWidth),
//           leftMargin: Number(page.leftMargin),
//           rightMargin: Number(page.rightMargin),
//           topMargin: Number(page.topMargin),
//           bottomMargin: Number(page.bottomMargin),
//         });
//         console.log(
//           "Redux current state:",
//           store.getState().prescriptionTemplate
//         );
//       }

//       // 2️⃣ Patient Section
//       if (data.PrescriptionPatientSetup?.[0]) {
//         const p = data.PrescriptionPatientSetup[0];
//         dispatch(
//           setPatientSection({
//             showPatientInfo: p.showPatientInfo,
//             showContactInfo: p.showContactInfo,
//             showAge: p.showAge,
//             showGender: p.showGender,
//             showAddress: p.showAddress,
//             formFields:
//               p.prescriptionPatientSetupFormField?.map((f: any) => ({
//                 id: f.id,
//                 label: f.label,
//                 type: f.type,
//                 placeholder: f.placeholder,
//                 required: f.required,
//                 order: Number(f.order),
//                 widthInches: Number(f.widthInches),
//                 row: Number(f.row),
//                 defaultValue: f.defaultValue,
//               })) || [],
//           })
//         );
//       }

//       // 3️⃣ Body Section
//       if (data.PrescriptionBodySetup?.[0]) {
//         const b = data.PrescriptionBodySetup[0];
//         dispatch(
//           setBodySection({
//             showBottomLine: b.showBottomLine,
//             showMiddleLine: b.showMiddleLine,
//             showTopLine: b.showTopLine,
//             showRightLine: b.showRightLine,
//             showLeftLine: b.showLeftLine,
//             bodyRightSideWidth: Number(b.bodyRightSideWidth),
//             bodyLeftSideWidth: Number(b.bodyLeftSideWidth),
//             bodyRightSideTopMargin: Number(b.bodyRightSideTopMargin),
//             bodyLeftSideTopMargin: Number(b.bodyLeftSideTopMargin),
//           })
//         );
//       }

//       // 4️⃣ Header Section
//       if (data.PrescriptionHeader?.[0]) {
//         const h = data.PrescriptionHeader[0];
//         dispatch(
//           setHeaderSection({
//             showLogo: h.showLogo,
//             showPrescriptionInBangla: h.showPrescriptionInBangla,
//             showPrescriptionInEnglish: h.showPrescriptionInEnglish,
//             showPrescriptionHeader: h.showPrescriptionHeader,
//             doctorInfoBangla: h.doctorInfoBangla,
//             doctorInfoEnglish: h.doctorInfoEnglish,
//             logo: h.logo || "",
//             logoFile: null,
//           })
//         );
//       }

//       // 5️⃣ Footer Section
//       if (data.PrescriptionFooter?.[0]) {
//         const f = data.PrescriptionFooter[0];
//         dispatch(
//           setFooterSection({
//             showLogo: f.showLogo,
//             showPrescriptionInBangla: f.showPrescriptionInBangla,
//             showPrescriptionInEnglish: f.showPrescriptionInEnglish,
//             showPrescriptionFooter: f.showPrescriptionFooter,
//             doctorInfoBangla: f.doctorInfoBangla,
//             doctorInfoEnglish: f.doctorInfoEnglish,
//             logo: f.logo || "",
//             logoFile: null,
//           })
//         );
//       }

//       console.log("✅ Redux state updated from fetched data:", data);
//     }
//   }, [updatePrescriptionData, dispatch]);

//   const stepTitles = useMemo(
//     () => [
//       "Page Setup",
//       "Patient Section",
//       "Body Section",
//       "Header Section",
//       "Footer Section",
//     ],
//     []
//   );

//   const stepRoutes = useMemo(
//     () => [
//       "/dashboard/pre-management/create-prescription-page-setup/page-setup",
//       "/dashboard/pre-management/create-prescription-page-setup/patient-section",
//       "/dashboard/pre-management/create-prescription-page-setup/body-section",
//       "/dashboard/pre-management/create-prescription-page-setup/header-section",
//       "/dashboard/pre-management/create-prescription-page-setup/footer-section",
//     ],
//     []
//   );

//   // Determine current step based on route
//   useEffect(() => {
//     const currentPath = location.pathname;
//     const stepIndex = stepRoutes.findIndex((route) => currentPath === route);
//     if (stepIndex !== -1) {
//       setCurrentStep(stepIndex + 1);
//     } else if (
//       currentPath === "/dashboard/pre-management/prescription-templates"
//     ) {
//       // Default to first step if on main route
//       navigate(stepRoutes[0], { replace: true });
//     }
//   }, [location.pathname, navigate, stepRoutes]);

//   const handleStepChange = (step: number) => {
//     setCurrentStep(step);
//     navigate(stepRoutes[step - 1]);
//     // Log current template state when switching steps
//     console.log("Current template state:", prescriptionTemplate);
//   };

//   const handleFinalStepCompleted = async () => {
//     // Mark template as completed in Redux
//     dispatch(setCompleted(true));
//     console.log("Template marked as completed:", prescriptionTemplate);
//     const formdata = new FormData();
//     formdata.append(
//       "pageSetup",
//       JSON.stringify({
//         ...prescriptionTemplate.pageSetup,
//       })
//     );
//     formdata.append(
//       "patientSection",
//       JSON.stringify({
//         ...prescriptionTemplate.patientSection,
//       })
//     );
//     formdata.append(
//       "bodySection",
//       JSON.stringify({
//         ...prescriptionTemplate.bodySection,
//       })
//     );
//     formdata.append(
//       "footerSection",
//       JSON.stringify({
//         doctorInfoBangla: prescriptionTemplate.footerSection.doctorInfoBangla,
//         doctorInfoEnglish: prescriptionTemplate.footerSection.doctorInfoEnglish,
//         showPrescriptionFooter:
//           prescriptionTemplate.footerSection.showPrescriptionFooter,
//         showPrescriptionInBangla:
//           prescriptionTemplate.footerSection.showPrescriptionInBangla,
//         showPrescriptionInEnglish:
//           prescriptionTemplate.footerSection.showPrescriptionInEnglish,
//       })
//     );
//     formdata.append(
//       "headerSection",
//       JSON.stringify({
//         doctorInfoBangla: prescriptionTemplate.headerSection.doctorInfoBangla,
//         doctorInfoEnglish: prescriptionTemplate.headerSection.doctorInfoEnglish,
//         showPrescriptionHeader:
//           prescriptionTemplate.headerSection.showPrescriptionHeader,
//         showPrescriptionInBangla:
//           prescriptionTemplate.headerSection.showPrescriptionInBangla,
//         showPrescriptionInEnglish:
//           prescriptionTemplate.headerSection.showPrescriptionInEnglish,
//       })
//     );

//     formdata.append("doctorId", JSON.stringify(decoded.id));
//     formdata.append(
//       "chamberId",
//       JSON.stringify(prescriptionTemplate.pageSetup.chamberId)
//     );
//     if (prescriptionTemplate.headerSection.logoFile) {
//       // Convert base64 to Blob
//       const base64Data =
//         prescriptionTemplate.headerSection.logoFile.base64.split(",")[1] ||
//         prescriptionTemplate.headerSection.logoFile.base64;
//       const byteCharacters = atob(base64Data);
//       const byteNumbers = new Array(byteCharacters.length);
//       for (let i = 0; i < byteCharacters.length; i++) {
//         byteNumbers[i] = byteCharacters.charCodeAt(i);
//       }
//       const byteArray = new Uint8Array(byteNumbers);
//       const blob = new Blob([byteArray], {
//         type: prescriptionTemplate.headerSection.logoFile.type,
//       });
//       formdata.append(
//         "headerLogo",
//         blob,
//         prescriptionTemplate.headerSection.logoFile.name
//       );
//     }

//     if (prescriptionTemplate.footerSection.logoFile) {
//       // Convert base64 to Blob
//       const base64Data =
//         prescriptionTemplate.footerSection.logoFile.base64.split(",")[1] ||
//         prescriptionTemplate.footerSection.logoFile.base64;
//       const byteCharacters = atob(base64Data);
//       const byteNumbers = new Array(byteCharacters.length);
//       for (let i = 0; i < byteCharacters.length; i++) {
//         byteNumbers[i] = byteCharacters.charCodeAt(i);
//       }
//       const byteArray = new Uint8Array(byteNumbers);
//       const blob = new Blob([byteArray], {
//         type: prescriptionTemplate.footerSection.logoFile.type,
//       });
//       formdata.append(
//         "footerLogo",
//         blob,
//         prescriptionTemplate.footerSection.logoFile.name
//       );
//     }

//     const response = await createPrescriptionPageSetup(formdata);

//     if (response?.data?.statusCode === 201) {
//       toast.success("Prescription template created successfully");
//       dispatch(resetTemplate());
//       navigate("/dashboard/pre-management/prescription-page-setup");
//     }

//     console.log(
//       response,
//       "API Response after creating prescription page setup"
//     );
//     console.log(
//       Object.fromEntries(formdata.entries()),
//       "Final FormData to be submitted"
//     );
//   };

//   // Check if we're on a sub-route
//   const isOnSubRoute = stepRoutes.includes(location.pathname);

//   if (
//     !isOnSubRoute &&
//     location.pathname !== "/dashboard/pre-management/prescription-templates"
//   ) {
//     return <Outlet />;
//   }

//   return (
//     <div className="min-h-screen py-4">
//       <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//         <div className="flex justify-between items-center">
//           <div>
//             <h4 className="font-semibold text-blue-800">
//               Debug: Template State
//             </h4>
//             <p className="text-sm text-blue-600">
//               Chamber:{" "}
//               {prescriptionTemplate.pageSetup.chamberId || "Not selected"} |
//               Page Type: {prescriptionTemplate.pageSetup.status} | Completed:{" "}
//               {prescriptionTemplate.isCompleted ? "Yes" : "No"}
//             </p>
//           </div>
//           <button
//             onClick={() => {
//               dispatch(resetTemplate());
//               console.log("Template reset");
//             }}
//             className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
//           >
//             Reset Template
//           </button>
//         </div>
//       </div>

//       <Stepper
//         initialStep={currentStep}
//         onStepChange={handleStepChange}
//         onFinalStepCompleted={handleFinalStepCompleted}
//         stepTitles={stepTitles}
//         stepCircleContainerClassName="border-0"
//       >
//         <Step>
//           <PageSetup />
//         </Step>
//         <Step>
//           <PatientSection />
//         </Step>
//         <Step>
//           <BodySection />
//         </Step>
//         <Step>
//           <HeaderSection />
//         </Step>
//         <Step>
//           <FooterSection />
//         </Step>
//       </Stepper>
//     </div>
//   );
// };

// export default PrescriptionTemplatesPageSetup;
