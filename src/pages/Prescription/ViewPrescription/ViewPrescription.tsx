/* eslint-disable @typescript-eslint/no-explicit-any */
// import prHead from "@/assets/pr-head.png";
import { useGetPerceptionByPatientIdQuery } from "@/redux/api/prescription/prescription";
import { Edit, Info, Printer } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useRef } from "react";
import { useGetPreManagementQuery } from "@/redux/api/PreManagement/PreManagementApi";

const ViewPrescription = () => {
  const { patientId } = useParams();
  const { data: perceptions } = useGetPerceptionByPatientIdQuery(patientId);
  const { data: preManagementData } = useGetPreManagementQuery(undefined);
  const printRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setPrintRef = (el: HTMLDivElement | null, index: number) => {
    printRefs.current[index] = el;
  };

  const handlePrint = (prescriptionData: any) => {
    const printWindow = window.open("", "", "width=800,height=600");
    if (!printWindow) return;

    // Generate diagnosis list HTML
    const diagnosisList =
      prescriptionData?.tests
        ?.map(
          (item: any) => `
      <li class="print-diagnosis-item">
        <span class="print-diagnosis-bullet"></span>
        <span>${item.description}</span>
      </li>
    `
        )
        .join("") || "";

    // Generate medicines list HTML
    const medicinesList =
      prescriptionData?.medicines
        ?.map(
          (med: any, medIndex: number) => `
      <div class="print-medicine-item">
        <div class="print-medicine-details">
        <span class="print-medicine-header">
          ${medIndex + 1}. ${med.medicineName}
        </span>
          <span>${med.dosage}</span>
          <span>${med.day}</span>
          <span>${med.time}</span>
        </div>
        ${
          med.comment
            ? `
          <p class="print-medicine-comment">
            ${med.comment}
          </p>
        `
            : ""
        }
      </div>
    `
        )
        .join("") || "";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Prescription</title>
          <style>
            @page {
              size: A4;
              margin: 0;
            }
            @media print {
              body {
                width: 210mm;
                height: 297mm;
                margin: 0;
                padding: 0;
              }
              .print-container {
                width: 210mm;
                height: 297mm;
                margin: 0 auto;
                background: white;
                display: flex;
                flex-direction: column;
                page-break-after: avoid;
                page-break-inside: avoid;
              }
              .no-print {
                display: none !important;
              }
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
            }
            .print-header-image {
              width: 100%;
              height: 30mm;
            }
            .print-patient-info {
              background: #f8f8f8;
              padding: 2mm;
              font-size: 10px;
              display: flex;
              justify-content: space-between;
            }
            .print-content-container {
              display: flex;
              flex: 1;
              min-height: 0;
            }
            .print-diagnosis-section {
              width: 35%;
              padding: 3mm;
              border-right: 1px solid #333;
              overflow: auto;
            }
            .print-prescription-section {
              width: 65%;
              padding: 3mm;
              overflow: auto;
            }
            .print-diagnosis-list {
              padding: 0;
              margin: 0;
              list-style: none;
            }
            .print-diagnosis-item {
              font-size: 10px;
              margin-bottom: 2mm;
              display: flex;
              align-items: flex-start;
            }
            .print-diagnosis-bullet {
              width: 2mm;
              height: 2mm;
              background: black;
              border-radius: 50%;
              margin-right: 2mm;
              margin-top: 0.5mm;
              flex-shrink: 0;
            }
            .print-medicine-item {
              margin-bottom: 3mm;
            }
            .print-medicine-header {
              font-size: 10px;
              font-weight: bold;
              margin-bottom: 1mm;
            }
            .print-medicine-details {
              font-size: 9px;
              display: flex;
              justify-content: space-between;
            }
            .print-medicine-comment {
              font-size: 9px;
              color: #666;
              margin-left: 4mm;
              margin-top: 1mm;
            }
            .print-footer-image {
              width: 100%;
              height: 30mm;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            
             <img src=${preManagementData?.data?.[0]?.headerImage} alt="" />
            <div class="print-patient-info">
              <span><strong>Name:</strong> ${prescriptionData?.patient?.name || ""}</span>
              <span><strong>Age:</strong> ${prescriptionData?.patient?.age || ""}</span>
              <span><strong>Date:</strong> ${prescriptionData?.createdAt?.split("T")[0] || ""}</span>
              <span><strong>ID:</strong> N/A</span>
            </div>
            
            <div class="print-content-container">
              <div class="print-diagnosis-section">
                <h3 style="font-size: 11px; margin-bottom: 3mm">Diagnosis</h3>
                <ul class="print-diagnosis-list">
                  ${diagnosisList}
                </ul>
              </div>
              
              <div class="print-prescription-section">
                ${medicinesList}
              </div>
            </div>
            
            <img src=${preManagementData?.data?.[0]?.footerImage} alt="" />
           
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div>
      {perceptions?.data?.length == 0 && (
        <div className="flex  justify-center items-center min-h-[85vh]">
          <div className="flex flex-col items-center justify-center gap-2">
            <Info />
            <span className="font-semibold text-xs">No perceptions Found</span>
          </div>
        </div>
      )}
      {perceptions?.data?.map((medic: any, index: number) => (
        <div className="m-5" key={medic.id || index}>
          <div className="flex justify-start items-center gap-2 pb-2">
            <button
              onClick={() => handlePrint(medic)}
              className="flex justify-center items-center gap-2 bg-brand text-white py-1 px-3 rounded-sm"
            >
              <Printer className="size-4 text-white" />
              <span>Print</span>
            </button>
            <Link
              to={`/dashboard/update-prescription/${medic.id}`}
              state={{ perception: medic }}
              className="flex justify-center items-center gap-2 bg-[#47C363] text-white py-1 px-3 rounded-sm"
            >
              <Edit className="size-4 text-white" />
              <span>Edit</span>
            </Link>
          </div>

          {/* Screen View */}
          <div
            ref={(el) => setPrintRef(el, index)}
            className="bg-white rounded-lg overflow-hidden shadow-md max-w-2xl mx-auto "
          >
            <div className="screen-container min-h-[800px] flex flex-col justify-between">
              <img src={preManagementData?.data?.[0]?.headerImage} alt="" />

              <div className="min-h-[620px]">
                <div className="bg-gray-50 p-3 text-sm flex justify-between">
                  <span>
                    <strong>Name:</strong> {medic?.patient?.name}
                  </span>
                  <span>
                    <strong>Age:</strong> {medic?.patient?.age}
                  </span>
                  <span>
                    <strong>Date:</strong> {medic?.createdAt?.split("T")[0]}
                  </span>
                  <span>
                    <strong>ID:</strong> N/A
                  </span>
                </div>

                <div className="h-screen">
                  {" "}
                  {/* or use a custom height if needed */}
                  <div className="flex h-full">
                    <div className="flex flex-col items-start justify-start w-1/3 border-r-2 border-gray-800 gap-2 mt-5">
                      <div className="ps-4 overflow-y-auto">
                        <h3 className="font-bold text-xs">ChiefComplaint</h3>
                        <ul className="">
                          {medic?.chiefComplaint?.map(
                            (item: any, idx: number) => (
                              <li
                                key={idx}
                                className="flex items-start text-sm ps-2"
                              >
                                <span className="w-1 h-1 bg-gray-800 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                                <span className="text-xs text-gray-800">
                                  {item.description}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                      <div className="ps-4 overflow-y-auto">
                        <h3 className="font-bold text-xs">On examinations</h3>
                        <ul className="">
                          {medic?.onExaminations?.map(
                            (item: any, idx: number) => (
                              <li
                                key={idx}
                                className="flex items-start text-sm ps-2"
                              >
                                <span className="w-1 h-1 bg-gray-800 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                                <span className="text-xs text-gray-800">
                                  {item.description}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                      <div className="ps-4">
                        <h3 className="font-bold text-xs">Diagnosis</h3>
                        <ul className="">
                          {medic?.diagnosis?.map((item: any, idx: number) => (
                            <li key={idx} className="flex items-start text-sm ps-2">
                              <span className="w-1 h-1 bg-gray-800 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                              <span className="text-xs text-gray-800">
                                {item.description}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="ps-4 overflow-y-auto">
                        <h3 className="font-bold text-xs">Investigation</h3>
                        <ul className="">
                          {medic?.investigation?.map(
                            (item: any, idx: number) => (
                              <li
                                key={idx}
                                className="flex items-start text-sm ps-2"
                              >
                                <span className="w-1 h-1 bg-gray-800 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                                <span className="text-xs text-gray-800">
                                  {item.description}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between items-start px-2 py-4 h-full overflow-y-auto w-full">
                      <div className="space-y-4">
                        {medic?.medicines?.map((med: any, medIndex: number) => {
                          console.log(med, "this is ");

                          return (
                            // <div key={medIndex}>
                            //   <div className="text-sm flex justify-between my-1 items-center gap-10">
                            //     <p className="text-sm font-semibold">
                            //       {medIndex + 1}. {med.medicineName}
                            //     </p>
                            //     <p>{med.dosage}</p>
                            //     <p>{med.day}</p>
                            //     <p>{med.time}</p>
                            //   </div>
                            //   {med.comment && (
                            //     <p className="text-xs text-gray-600 ml-4 mt-1">
                            //       {med.comment}
                            //     </p>
                            //   )}
                            // </div>
                            <div className=" line-clamp-1">
                              <span className="font-semibold text-xs">
                                {medIndex + 1}. {med.medicineName}
                              </span>
                              {medic?.medicines?.map((med: any) => (
                                <div>
                                  {med?.DosageSchedule?.map((item: any) => (
                                    <div className="flex justify-between items-start w-full text-xs ps-14 gap-10">
                                      <div className="flex gap-2 items-start justify-start ">
                                        <div>{item?.dosage}</div>
                                        <span>....................</span>
                                        <span>{item?.time}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                      <div>
                        <span className="font-semibold text-xs">Advice</span>
                        <div className="ps-5">
                          {medic?.advice?.map((item: any, inx: any) => {
                            return (
                              <div className="flex items-start justify-start gap-1 text-xs text-gray-700">
                                <span>
                                  {inx + 1}. {item?.description}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <img src={preManagementData?.data?.[0]?.footerImage} alt="" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewPrescription;
