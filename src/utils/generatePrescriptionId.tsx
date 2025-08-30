export const generatePrescriptionId = (patientId: string | number): string => {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0].replace(/-/g, ""); // YYYYMMDD
    const patientIdPart = patientId.toString().slice(-3); // Last 3 digits of patient ID
    const timeStr = now.getTime().toString().slice(-4); // Last 4 digits of timestamp
    const randomStr = Math.floor(10 + Math.random() * 90); // 2-digit random number
    
    return `RX${dateStr}${patientIdPart}${timeStr}${randomStr}`;
  }