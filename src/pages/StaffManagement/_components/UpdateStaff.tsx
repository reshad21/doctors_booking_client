/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomModal from "@/components/shared/CustomModal";
import { useUpdateStaffMutation } from "@/redux/api/staff/staff";
import { useState } from "react";
import toast from "react-hot-toast";

const UpdateStaff = ({ staff }: any) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [updateStaff] =  useUpdateStaffMutation()
  console.log(staff);

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
      console.log(res);
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
        defaultValues={{
          name: staff?.name,
          email: staff?.email,
          phone: staff?.phone,
        }}
        buttonProperty={{ type: "edit", text: "AddNew Staff" }}
      />
    </div>
  );
};

export default UpdateStaff;
