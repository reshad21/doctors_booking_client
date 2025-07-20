/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomModal from "@/components/shared/CustomModal";
import {
  useCreatePreManagementMutation,
  useGetPreManagementQuery,
} from "@/redux/api/PreManagement/PreManagementApi";
import { useState } from "react";
import toast from "react-hot-toast";

const PrescriptionManagement = () => {
  const { data: preManagementData } = useGetPreManagementQuery(undefined);
  const [createPreManagement] = useCreatePreManagementMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const handleFormSubmit = async (
    data: Record<string, any>,
    helpers: { reset: () => void; close: () => void }
  ) => {

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "headerImage" && value instanceof File) {
        formData.append("headerImage", value);
      } else if (key === "footerImage" && value instanceof File) {
        formData.append("footerImage", value);
      } else {
        formData.append(key, value);
      }
    });

    const res = (await createPreManagement(formData)) as any;
    if (res?.data?.success) {
      helpers.reset();
      helpers.close();
      toast.success(res?.data?.message);
    } else {
      console.error();
      toast.error(res?.error?.data?.message || "something went wrong");
    }
  };


  return (
    <div className="custom-container">
      <div className="w-full">
        <div className="flex items-center justify-between mb-6"></div>
        <div className="flex items-center gap-3">
          <CustomModal
            open={modalOpen}
            setOpen={setModalOpen}
            title="Create Prescription Video"
            description="Fill in the form below."
            handleFormSubmit={handleFormSubmit}
            file={[
              { label: "Header Image", name: "headerImage" },
              { label: "Footer Image ", name: "footerImage" },
            ]}
            buttonProperty={{ type: "create", text: "Add Prescription" }}
          />
        </div>
      </div>
    </div>
  );
};

export default PrescriptionManagement;
