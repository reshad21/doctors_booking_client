/* eslint-disable @typescript-eslint/no-explicit-any */

import CustomModal from "@/components/shared/CustomModal";
import { useUpdateWatchVideoMutation } from "@/redux/api/watchVideoApi/watchVideoApi";
import { toast } from "react-hot-toast";

export function UpdateWatchVideoModal({
  open,
  setOpen,
  data,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
}) {
  const [updateWatchVideo] = useUpdateWatchVideoMutation();

  const handleUpdateSubmit = async (
    formData: Record<string, any>,
    helpers: { reset: () => void; close: () => void }
  ) => {
    try {
      const res = (await updateWatchVideo({
        id: data?.id,
        payload: formData,
      })) as any;

      if (res?.data?.success) {
        toast.success(res?.data?.message || "Video updated successfully");
        helpers.reset();
        helpers.close();
      } else {
        toast.error(res?.error?.data?.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating video:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <CustomModal
      open={open}
      setOpen={setOpen}
      title="Update Video"
      description="Edit the form fields to update the video."
      handleFormSubmit={handleUpdateSubmit}
      input={[
        { label: "Video Title", name: "title", type: "text" },
        { label: "Video Full Link", name: "videoFile", type: "text" },
      ]}
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
      buttonProperty={{ type: "update", text: "Update Video" }}
      defaultValues={{
        title: data?.title || "",
        videoFile: data?.videoFile || "",
        status: data?.status || " ",
      }}
    />
  );
}
