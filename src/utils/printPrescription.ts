/* eslint-disable @typescript-eslint/no-explicit-any */
export const printPrescription = (
  prescriptionData: any,
  preManagementData: any
) => {
  const printWindow = window.open("", "", "width=800,height=600");
  if (!printWindow) return;

  const createListHTML = (items: any[]) =>
    items
      ?.map(
        (item: any) => `
      <li class="print-list-item">
        <span class="print-bullet"></span>
        <span>${item.description}</span>
      </li>
    `
      )
      .join("") || "";

  const chiefComplaintsList = createListHTML(prescriptionData?.chiefComplaint);
  const examinationsList = createListHTML(prescriptionData?.onExaminations);
  const diagnosisList = createListHTML(prescriptionData?.diagnosis);
  const investigationList = createListHTML(prescriptionData?.investigation);

  const medicinesList =
    prescriptionData?.medicines
      ?.map((med: any, medIndex: number) => {
        const dosageSchedules =
          med?.DosageSchedule?.map(
            (schedule: any) => `
      <div class="print-dosage-schedule">
        <div class="print-dosage-row">
          <span class="print-dosage">${schedule.dosage || ""}</span>
          <span class="print-day">${schedule.day || ""}</span>
          <span class="print-time">${schedule.time || ""}</span>
          <span class="print-comment-inline">
            ${schedule.comment ? `${schedule.comment}` : ""}
          </span>
        </div>
      </div>
    `
          ).join("") || "";

        return `
      <div class="print-medicine-item">
        <div class="print-medicine-header">
          ${medIndex + 1}. ${med.medicineName}
        </div>
        <div class="print-dosage-schedules">
          ${dosageSchedules}
        </div>
      </div>
    `;
      })
      .join("") || "";

  // Advice section
  const adviceList = createListHTML(prescriptionData?.advice);

  // Next Visit / Follow-up
  const nextVisit = prescriptionData?.nextVisit
    ? `<div class="print-next-visit">
         <h4>Next Visit</h4>
         <div class="print-next-visit-text">${prescriptionData.nextVisit}</div>
       </div>`
    : "";

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Prescription</title>
        <style>
          @page { size: A4; margin: 0; }
          @media print {
            body { width: 210mm; height: 297mm; margin: 0; padding: 0; }
            .print-container { width: 210mm; height: 297mm; margin: 0 auto; background: white; display: flex; flex-direction: column; page-break-after: avoid; page-break-inside: avoid; }
            .no-print { display: none !important; }
          }

          body {
            font-family: Arial, sans-serif;
            font-size: 10pt;
            margin: 0;
            padding: 0;
            color: #000;
          }

          .print-header-image, .print-footer-image {
            width: 100%;
            height: 30mm;
            object-fit: cover;
          }

          .print-patient-info {
            background: #f8f8f8;
            padding: 4mm;
            font-size: 10pt;
            display: flex;
            justify-content: space-between;
          }

          .print-content-container {
            display: flex;
            flex: 1;
            min-height: 200mm;
            padding: 4mm;
          }

          .print-diagnosis-section {
            width: 35%;
            border-right: 1px solid #333;
            padding-right: 3mm;
            display: flex;
            flex-direction: column;
            gap: 2mm;
          }

          .print-prescription-section {
            width: 65%;
            padding-left: 4mm;
            display: flex;
            flex-direction: column;
            gap: 2mm;
          }

          h4 {
            font-size: 11pt;
            margin: 0 0 0.2mm 0;
            font-weight: bold;
          }

          .print-diagnosis-section ul {
            padding-left: 0;
            margin: 0;
            list-style: none;
          }

          .print-list-item {
            margin-bottom: 0.2mm;
            display: flex;
            align-items: flex-start;
            font-size: 10pt;
          }

          .print-bullet {
            width: 1.5mm;
            height: 1.5mm;
            background: #000;
            border-radius: 50%;
            margin-right: 1mm;
            margin-top: 0.15em;
            flex-shrink: 0;
          }

          .print-medicine-item {
            margin-bottom: 3mm;
            font-size: 10pt;
          }

          .print-medicine-header {
            font-weight: bold;
            margin-bottom: 1mm;
          }

          .print-dosage-schedules {
            margin-left: 4mm;
          }

          .print-dosage-schedule {
            margin-bottom: 1mm;
          }

          .print-dosage-row {
            display: flex;
            align-items: flex-start;
            gap: 6mm;
            font-size: 10pt;
          }

          .print-dosage {
            min-width: 15mm;
          }

          .print-day {
            min-width: 15mm;
          }

          .print-time {
            min-width: 18mm;
          }

          .print-comment-inline {
            font-size: 8pt;
            color: #666;
            margin-left: 2mm;
            flex: 1;
            max-width: 55mm;
          }

          .print-advice-section ul {
            padding-left: 0;
            margin: 0;
          }

          .print-next-visit-text {
            font-size: 10pt;
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <img src=${preManagementData?.data?.[0]?.headerImage} alt="" class="print-header-image"/>
          <div class="print-patient-info">
            <span><strong>Name:</strong> ${prescriptionData?.patient?.name || ""}</span>
            <span><strong>Age:</strong> ${prescriptionData?.patient?.age || ""}</span>
            <span><strong>Date:</strong> ${prescriptionData?.createdAt?.split("T")[0] || ""}</span>
            <span><strong>ID:</strong> N/A</span>
          </div>

          <div class="print-content-container">
            <div class="print-diagnosis-section">
              ${chiefComplaintsList ? `<h4>Chief Complaints</h4><ul>${chiefComplaintsList}</ul>` : ""}
              ${examinationsList ? `<h4>On Examinations</h4><ul>${examinationsList}</ul>` : ""}
              ${diagnosisList ? `<h4>Diagnosis</h4><ul>${diagnosisList}</ul>` : ""}
              ${investigationList ? `<h4>Investigation</h4><ul>${investigationList}</ul>` : ""}
            </div>
            <div class="print-prescription-section">
              ${medicinesList}
              ${adviceList ? `<div class="print-advice-section"><h4>Advice</h4><ul>${adviceList}</ul></div>` : ""}
              ${nextVisit}
            </div>
          </div>

          <img src=${preManagementData?.data?.[0]?.footerImage} alt="" class="print-footer-image"/>
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