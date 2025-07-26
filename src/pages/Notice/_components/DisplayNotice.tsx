/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomModal from "@/components/shared/CustomModal";
import { useDisplayNoticeMutation } from "@/redux/api/message/message";
import { useState } from "react";
import toast from "react-hot-toast";
const createPatientInputs = [
  { label: "Display notice ", name: "description", type: "text" },
];
const selectFields = [
  {
    label: "Status",
    name: "status",
    options: [
      { name: "ACTIVE", val: "ACTIVE" },
      { name: "INACTIVE", val: "INACTIVE" },
    ],
  },
];
const DisplayNotice = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [createDisplayNotice] = useDisplayNoticeMutation();
  const handleFormSubmit = async (
    data: Record<string, any>,
    helpers: { reset: () => void; close: () => void }
  ) => {
    try {
      const res = (await createDisplayNotice({
        description: data?.description,
        status: data?.status,
      })) as any;
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
        title="Create Patient"
        description="Fill in the form below."
        handleFormSubmit={handleFormSubmit}
        input={createPatientInputs}
        select={selectFields}
        buttonProperty={{ type: "create", text: "Add Display notice" }}
      />
    </div>
  );
};

export default DisplayNotice;
