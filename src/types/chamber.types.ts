export type Chamber = {
  id: string;
  name: string;
  address: string;
  oldPatientFee: string;
  newPatientFee: string;
  reportFee: string;
  status: "ACTIVE" | "INACTIVE";
  startTime?: string;
  endTime?: string;
  doctorId: string;
  createdAt: Date;
  updatedAt: Date;
};
