export const generatePrescriptionId = (): string => {
  const now = new Date();
  const day = now.getDate().toString().padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const year = now.getFullYear().toString().slice(-2);

  const datePart = `${day}${month}${year}`;
  const randomPart = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(4, "0");

  return `${datePart}${randomPart}`;
};
