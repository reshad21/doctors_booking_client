export type Advice = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
};

export interface AdviceInput {
  id: string;
  value: string;
  doctorId: string;
  createdAt: string;
  updatedAt: string;
}
