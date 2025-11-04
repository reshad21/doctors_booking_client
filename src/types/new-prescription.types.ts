export interface Tag {
  id: string;
  label: string;
  category?: string;
}

export interface PrescriptionData {
  patientName: string;
  age: string;
  date: string;
  chiefComplaint: string[];
  examinations: string[];
  diagnosis: string[];
  investigations: string[];
  history: string[];
  treatmentPlan: string[];
  coMorbidities: string[];
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  advice: string[];
  nextVisit: string;
}
