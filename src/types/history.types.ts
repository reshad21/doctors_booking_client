export interface HistoryInputItem {
  id: string;
  value: string;
  doctorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface HistoryInputsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    data: HistoryInputItem[];
  };
}
