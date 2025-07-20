/* eslint-disable @typescript-eslint/no-explicit-any */

import CustomModal from "@/components/shared/CustomModal";
import { useUpdateChamberMutation } from "@/redux/api/chamber/chamber";
import { toast } from "react-hot-toast";

export function UpdateChamberModal({
  open,
  setOpen,
  data,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
}) {
  const [updateChamber] = useUpdateChamberMutation();

  const chamberInputFields = [
    { label: "Name", name: "name", type: "text" },
    { label: "Address", name: "address", type: "text" },
    { label: "Old Patient", name: "oldPatientFee", type: "text" },
    { label: "New Patient", name: "newPatientFee", type: "text" },
    { label: "Report", name: "reportFee", type: "text" },
    { label: "Start Time", name: "startTime", type: "time" },
    { label: "End Time", name: "endTime", type: "time" },
  ];

  const selectFields = [
    {
      label: "Status",
      name: "status",
      options: [
        { name: "Active", val: "ACTIVE" },
        { name: "Inactive", val: "INACTIVE" },
      ],
    },
  ];

  const handleUpdateSubmit = async (
    formData: Record<string, any>,
    helpers: { reset: () => void; close: () => void }
  ) => {
    try {
      
      const res = (await updateChamber({
        id: data?.id,
        data: formData,
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
      title="Create Chamber"
      description="Fill in the form below."
      handleFormSubmit={handleUpdateSubmit}
      input={chamberInputFields}
      select={selectFields}
      buttonProperty={{ type: "update", text: "Update New Chamber" }}
      defaultValues={data}
    />
  );
}
