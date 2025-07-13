import type { Patient } from "./patient.types";

export interface Prescription {
  id: string;
  patientId: string;
  patient: Patient;
  doctorId: string;
  advice: string;
  nextVisit?: string;
  createdAt: Date;
  medicines: Medicine[];
  tests: Test[];
}

export interface Medicine {
  id: string;
  prescriptionId: string;
  prescription: Prescription;
  medicineName: string;
  dosage: string;
  day: string;
  time: string;
  comment?: string;
}

export interface Test {
  id: string;
  prescriptionId: string;
  prescription: Prescription;
  description: string;
}
