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
  { value: "১+১+১", label: "১+১+১" },
  { value: "১+১+০", label: "১+১+০" },
  { value: "১+০+১", label: "১+০+১" },
  { value: "০+১+১", label: "০+১+১" },
  { value: "০+০+১", label: "০+০+১" },
  { value: "১+০+০", label: "১+০+০" },
  { value: "০+১+০", label: "০+১+০" },
  { value: "১/২ + ১/২ + ১/২", label: "১/২ + ১/২ + ১/২" },
  { value: "১/২ + ১/২ + ০", label: "১/২ + ১/২ + ০" },
  { value: "১/২ + ০ + ১/২", label: "১/২ + ০ + ১/২" },
  { value: "০ + ১/২ + ১/২", label: "০ + ১/২ + ১/২" },
  { value: "০ + ০ + ১/২", label: "০ + ০ + ১/২" },
  { value: "১/২ + ০ + ০", label: "১/২ + ০ + ০" },
  { value: "০ + ১/২ + ০", label: "০ + ১/২ + ০" },
];

export const timeOptions = [
  { value: "খাবার আগে", label: "খাবার আগে" },
  { value: "খাবার পরে", label: "খাবার পরে" },
];

export type FormValues = {
  nextVisit?: string;
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
