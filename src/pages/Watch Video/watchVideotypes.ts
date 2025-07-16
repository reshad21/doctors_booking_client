/* eslint-disable @typescript-eslint/no-explicit-any */
export type Status = "ACTIVE" | "INACTIVE";

// Interface
export interface WatchVideoTypes {
  id: string;
  title: string;
  videoFile: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}
