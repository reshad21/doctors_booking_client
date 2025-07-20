/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomModal from "@/components/shared/CustomModal";
import { useUpdateStaffMutation } from "@/redux/api/staff/staff";
import type { Staff } from "@/types/staff.types";
import { useState } from "react";
import toast from "react-hot-toast";

const UpdateStaff = ({ staff }: { staff: Staff }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [updateStaff] = useUpdateStaffMutation();

  const handleFormSubmit = async (
    data: Record<string, any>,
    helpers: { reset: () => void; close: () => void }
  ) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("id", staff.id);

      // Append file
      if (data.staffImage && data.staffImage[0]) {
        formData.append("staffImage", data.staffImage[0]);
      }

      const res = (await updateStaff(formData)) as any;

      if (res?.data?.success) {
        helpers.reset();
        helpers.close();
        toast.success(res?.data?.message);
      } else {
        console.error();
        toast.error(res?.error?.data?.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong");
    }
  };

  console.log(staff, "staff");
  return (
    <div>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title="Create User"
        description="Fill in the form below."
        handleFormSubmit={handleFormSubmit}
        input={[
          { label: "Full Name", name: "name", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Phone", name: "phone", type: "number" },
        ]}
        file={[{ label: "Profile Image", name: "staffImage" }]}
        defaultValues={staff}
        buttonProperty={{ type: "edit", text: "AddNew Staff" }}
      />
    </div>
  );
};

export default UpdateStaff;
