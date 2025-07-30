/* eslint-disable @typescript-eslint/no-explicit-any */

import CustomModal from "@/components/shared/CustomModal";
import { useUpdateAdviceMutation } from "@/redux/api/advice/advice";
import { toast } from "react-hot-toast";

export function UpdateAdviceModal({
  open,
  setOpen,
  data,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
}) {
  const [updateAdvice] = useUpdateAdviceMutation();

  const handleUpdateSubmit = async (
    formData: Record<string, any>,
    helpers: { reset: () => void; close: () => void }
  ) => {
    try {
      const res = (await updateAdvice({
        id: data?.id,
        payload: formData,
      })) as any;

      if (res?.data?.success) {
        toast.success(res?.data?.message || "Advice updated successfully");
        helpers.reset();
        helpers.close();
      } else {
        toast.error(res?.error?.data?.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating advice:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <CustomModal
      open={open}
      setOpen={setOpen}
      title="Update Advice"
      description="Update the advice information below."
      handleFormSubmit={handleUpdateSubmit}
      input={[{ label: "Title", name: "title", type: "text" }]}
      richTextEditor={{ name: "content", label: "Content" }}
      select={[
        {
          label: "Status",
          name: "status",
          type: "select",
          options: [
            { name: "Active", val: "ACTIVE" },
            { name: "Inactive", val: "INACTIVE" },
          ],
        },
      ]}
      buttonProperty={{ type: "update", text: "Update Advice" }}
      defaultValues={data}
    />
  );
}
