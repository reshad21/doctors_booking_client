/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";

export const CreateFn = async (inputValue: any, rtkFn: any) => {
  const res = (await rtkFn({
    value: inputValue,
  })) as any;
  if (res?.data?.message) {
    toast.success(res?.data?.message);
  } else {
    toast.error(res?.error?.data?.message || "Something Went Wrong");
  }
};

export const CreateAdviceFn = async (inputValue: any, rtkFn: any) => {
  const res = (await rtkFn({
    content: inputValue,
    status: "ACTIVE",
    title: inputValue && inputValue?.slice(0, 10),
  })) as any;
  if (res?.data?.message) {
    toast.success(res?.data?.message);
  } else {
    toast.error(res?.error?.data?.message || "Something Went Wrong");
  }
};

export const InputOptions = (data: any, type: any) => {
  if (type !== "advice") {
    const options = data?.data?.map((item: any) => ({
      value: item.value,
      label: item.value,
    }));
    return options;
  } else {
    const options = data?.data?.map((item: any) => ({
      value: item.content,
      label: item.title,
    }));
    return options;
  }
};

export const dosageOptions = [
  { value: "1+1+1", label: "1+1+1" },
  { value: "1+1+0", label: "1+1+0" },
  { value: "1+0+1", label: "1+0+1" },
  { value: "0+1+1", label: "0+1+1" },
  { value: "0+0+1", label: "0+0+1" },
  { value: "1+0+0", label: "1+0+0" },
  { value: "0+1+0", label: "0+1+0" },
  { value: "1/2 + 1/2 + 1/2", label: "1/2 + 1/2 + 1/2" },
  { value: "1/2 + 1/2 + 0", label: "1/2 + 1/2 + 0" },
  { value: "1/2 + 0 + 1/2", label: "1/2 + 0 + 1/2" },
  { value: "0 + 1/2 + 1/2", label: "0 + 1/2 + 1/2" },
  { value: "0 + 0 + 1/2", label: "0 + 0 + 1/2" },
  { value: "1/2 + 0 + 0", label: "1/2 + 0 + 0" },
  { value: "0 + 1/2 + 0", label: "0 + 1/2 + 0" },
];

export const timeOptions = [
  { value: "খাবার আগে", label: "খাবার আগে" },
  { value: "খাবার পরে", label: "খাবার পরে" },
];

export type FormValues = {
  nxVisit?: string;
  advice?: string[];
  "chief-complaint"?: string[];
  "on-examinations"?: string[];
  diagnosis?: string[];
  investigation?: string[];
  content?: string;
  // Dynamic medicine fields (these will be handled separately)
  [key: `medicine-${number}`]: string;
  [key: `${number}-dosage-${number}`]: string;
  [key: `${number}-duration-${number}`]: string;
  [key: `${number}-time-${number}`]: string;
  [key: `${number}-comment-${number}`]: string;
};
