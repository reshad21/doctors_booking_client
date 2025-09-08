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

export interface DosageNote {
  qty: string;
  unit: string;
  freq: string;
  freqUnit: string;
}

export interface DosageSchedule {
  id?: string;
  dosage?: string;
  day: string;
  time?: string;
  comment?: string;
  dosageNotes?: DosageNote[];
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
  DosageSchedule?: DosageSchedule[];
}

export interface Test {
  id: string;
  prescriptionId: string;
  prescription: Prescription;
  description: string;
}
