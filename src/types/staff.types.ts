/* eslint-disable @typescript-eslint/no-explicit-any */
export type Status = "ACTIVE" | "INACTIVE";

export interface RouteAccess {
  id: string;
  path: string;
  name: string;
  allowed: boolean;
  createdAt: string;
  updatedAt: string;
  staffId: string;
}

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
  featureToggles?: any;
  routeAccess?: RouteAccess[];
}
