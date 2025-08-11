/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";

export const CreateFn = async (inputValue: any, rtkFn: any) => {
  const res = (await rtkFn({
    value: inputValue,
    title: inputValue && inputValue?.slice(0, 10),
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
