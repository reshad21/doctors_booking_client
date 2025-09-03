export const generatePrescriptionId = (patientId: string | number): string => {
  const now = new Date();
  const day = now.getDate().toString().padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const year = now.getFullYear().toString().slice(-2);

  const datePart = `${day}${month}${year}`;
  const patientPart = patientId.toString().slice(-2).padStart(2, "0");
  const randomPart = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  return `${datePart}${patientPart}${randomPart}`;
};
