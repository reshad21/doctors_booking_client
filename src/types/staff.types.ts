/* eslint-disable @typescript-eslint/no-explicit-any */
export type Status = "ACTIVE" | "INACTIVE";

// Interface
export interface Staff {
  id: string; 
  name: string;
  email: string;
  phone: string;
  image?: string; 
  password: string;
  status: Status; 
  createdAt: string; 
  updatedAt: string; 
  doctorId?: string; 
  organizationId?: string; 
  doctor?: any; 
  organization?: any; 
  featureToggles?: any
}
