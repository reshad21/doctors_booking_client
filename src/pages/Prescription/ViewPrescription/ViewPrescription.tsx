/* eslint-disable @typescript-eslint/no-explicit-any */
// import prHead from "@/assets/pr-head.png";
import { useGetPerceptionByPatientIdQuery } from "@/redux/api/prescription/prescription";
import { Edit, Printer } from "lucide-react";
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
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    // Generate diagnosis list HTML
    const diagnosisList = prescriptionData?.tests?.map((item: any) => `
      <li class="print-diagnosis-item">
        <span class="print-diagnosis-bullet"></span>
        <span>${item.description}</span>
      </li>
    `).join('') || '';

    // Generate medicines list HTML
    const medicinesList = prescriptionData?.medicines?.map((med: any, medIndex: number) => `
      <div class="print-medicine-item">
        <p class="print-medicine-header">
          ${medIndex + 1}. ${med.medicineName}
        </p>
        <div class="print-medicine-details">
          <span>${med.dosage}</span>
          <span>${med.day}</span>
          <span>${med.time}</span>
        </div>
        ${med.comment ? `
          <p class="print-medicine-comment">
            ${med.comment}
          </p>
        ` : ''}
      </div>
    `).join('') || '';

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
              <span><strong>Name:</strong> ${prescriptionData?.patient?.name || ''}</span>
              <span><strong>Age:</strong> ${prescriptionData?.patient?.age || ''}</span>
              <span><strong>Date:</strong> ${prescriptionData?.createdAt?.split("T")[0] || ''}</span>
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
              to={"/dashboard/update-prescription"}
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
            className="bg-white rounded-lg overflow-hidden shadow-md max-w-4xl mx-auto"
          >
            <div className="screen-container">
              {/* <img src={prHead} alt="Clinic Header" className="w-full h-auto max-h-32 " /> */}
               <img src={preManagementData?.data?.[0]?.headerImage} alt="" />
              <div className="bg-gray-50 p-3 text-sm flex justify-between">
                <span><strong>Name:</strong> {medic?.patient?.name}</span>
                <span><strong>Age:</strong> {medic?.patient?.age}</span>
                <span><strong>Date:</strong> {medic?.createdAt?.split("T")[0]}</span>
                <span><strong>ID:</strong> N/A</span>
              </div>
              
              <div className="flex min-h-96">
                <div className="w-1/3 p-4 border-r-2 border-gray-800">
                  <h3 className="font-bold text-sm mb-4">Diagnosis</h3>
                  <ul className="space-y-2">
                    {medic?.tests?.map((item: any, idx: number) => (
                      <li key={idx} className="flex items-start text-sm">
                        <span className="w-2 h-2 bg-black rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                        {item.description}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex-1 p-4">
                  <div className="space-y-4">
                    {medic?.medicines?.map((med: any, medIndex: number) => (
                      <div key={medIndex}>
                        <p className="text-sm font-semibold">
                          {medIndex + 1}. {med.medicineName}
                        </p>
                        <div className="text-sm flex justify-between my-1 items-center">
                          <p>{med.dosage}</p>
                          <p>{med.day}</p>
                          <p>{med.time}</p>
                        </div>
                        {med.comment && (
                          <p className="text-xs text-gray-600 ml-4 mt-1">
                            {med.comment}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <img src={preManagementData?.data?.[0]?.footerImage} alt="" />
              {/* <img src={prHead} alt="Clinic Footer" className="w-full h-auto max-h-32 " /> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewPrescription;
