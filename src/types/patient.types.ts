import type { Prescription } from "./prescription.types";

export type VisitStatus = "VISITED" | "NOT_VISITED";

export type PatientStatus = "NEW" | "OLD" | "REPORT";

export interface Patient {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  age: string;
  gender: string;
  weight: string;
  isArrived: boolean
  status: PatientStatus;
  visitStatus: VisitStatus;
  visitedAt?: Date;
  doctorId: string;
  createdAt: string;
  updatedAt: string;
  discountAmount:number;
  chamberId?: string;
  prescription: Prescription[];
  visit: Visit[];
}

export interface Visit {
  id: string;
  patientId: string;
  doctorId: string;
  visitDate: Date;
  createdAt: Date;
  patient: Patient;
}
