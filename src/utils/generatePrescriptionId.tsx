export const generatePrescriptionId = (patientId: string | number): string => {
  const now = Date.now().toString(36).slice(-4);
  const patientPart = patientId.toString().slice(-2);
  const randomPart = Math.floor(10 + Math.random() * 90).toString();

  return `RX${patientPart}${now}${randomPart}`;
};
