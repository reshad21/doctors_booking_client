/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomModal from "@/components/shared/CustomModal";
import {
  createNoticeInputs,
  selectNoticeFields,
} from "@/constant/notice.constant";
import { useDisplayNoticeMutation } from "@/redux/api/message/message";
import { displayNoticeSchema } from "@/validation/notice.validation";
import { useState } from "react";
import toast from "react-hot-toast";

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
        title="Create Notice"
        description="Fill in the form below."
        handleFormSubmit={handleFormSubmit}
        input={createNoticeInputs}
        select={selectNoticeFields}
        buttonProperty={{ type: "create", text: "Add Display notice" }}
        validationSchema={displayNoticeSchema}
      />
    </div>
  );
};

export default DisplayNotice;
