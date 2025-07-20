/* eslint-disable @typescript-eslint/no-explicit-any */

import CustomModal from "@/components/shared/CustomModal";
import { useUpdatePatientMutation } from "@/redux/api/patient/patient";
import { toast } from "react-hot-toast";

export function UpdatePatientModal({
  open,
  setOpen,
  data,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
}) {
  const [updatePatient] = useUpdatePatientMutation();

  const patientInputFields = [
    { label: "Name", name: "name", type: "text" },
    { label: "Phone", name: "phoneNumber", type: "number" },
    { label: "Email", name: "email", type: "email" },
    { label: "Age", name: "age", type: "text" },
    { label: "Weight", name: "weight", type: "text" },
  ];

  const selectFields = [
    {
      label: "Gender",
      name: "gender",
      options: [
        { name: "Male", val: "MALE" },
        { name: "Female", val: "FEMALE" },
        { name: "Other", val: "OTHER" },
      ],
    },
    {
      label: "Status",
      name: "status",
      options: [
        { name: "New", val: "NEW" },
        { name: "Old", val: "OLD" },
        { name: "Report", val: "REPORT" },
      ],
    },
  ];

  const handleUpdateSubmit = async (
    formData: Record<string, any>,
    helpers: { reset: () => void; close: () => void }
  ) => {
    
    try {
      const res = (await updatePatient({
        id: data?.id,
        payload: formData,
      })) as any;

      if (res?.data?.success) {
        toast.success(res?.data?.message || "Patient updated successfully");
        helpers.reset();
        helpers.close();
      } else {
        toast.error(res?.error?.data?.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating patient:", error);
      toast.error("An unexpected error occurred.");
    }
  };

//   const defaultValues = Array.isArray(data) ? data[0] : data;

  return (
    <CustomModal
      open={open}
      setOpen={setOpen}
      title="Update Patient"
      description="Update the patient information below."
      handleFormSubmit={handleUpdateSubmit}
      input={patientInputFields}
      select={selectFields}
      buttonProperty={{ type: "update", text: "Update Patient" }}
      defaultValues={data}
    />
  );
}
