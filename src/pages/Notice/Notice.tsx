/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomModal from "@/components/shared/CustomModal";
import { Button } from "@/components/ui/button";
import { useSendMultipleMessageMutation } from "@/redux/api/message/message";
import { Plus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
const createPatientInputs = [
  { label: "Write your message", name: "message", type: "text" },
];

const Notice = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [sendMultipleMsg] = useSendMultipleMessageMutation();
  const handleFormSubmit = async (
    data: Record<string, any>,
    helpers: { reset: () => void; close: () => void }
  ) => {
    try {
      const res = (await sendMultipleMsg({ message: data?.message })) as any;

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
    <div className="custom-container">
      <div className="w-full">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button className="bg-brand hover:bg-green-800 cursor-pointer text-white">
              <Plus className="ml-2 h-4 w-4" />
              Add display notice
            </Button>

            <CustomModal
              open={modalOpen}
              setOpen={setModalOpen}
              title="Create Patient"
              description="Fill in the form below."
              handleFormSubmit={handleFormSubmit}
              input={createPatientInputs}
              buttonProperty={{ type: "create", text: "Add sMS notice" }}
            />
          </div>
        </div>

        {/* Table Section */}
        <div></div>
      </div>
    </div>
  );
};

export default Notice;
