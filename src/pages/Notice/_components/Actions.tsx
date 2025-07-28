/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfirmAlert from "@/components/shared/ConfirmAlert";
import CustomModal from "@/components/shared/CustomModal";
import { Switch } from "@/components/ui/switch";
import { TableCell } from "@/components/ui/table";
import {
  useDeleteDisplayNoticeMutation,
  useUpdateDisplayNoticeMutation,
} from "@/redux/api/message/message";
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

const Actions = ({
  id,
  description,
  status,
}: {
  id: string;
  description: string;
  status: string;
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDisplayNotice] = useDeleteDisplayNoticeMutation();
  const [updateDisplayNotice] = useUpdateDisplayNoticeMutation();
  const handleFormSubmit = async (
    data: Record<string, any>,
    helpers: { reset: () => void; close: () => void }
  ) => {
    try {
      const res = (await updateDisplayNotice({
        updateValue: { status: data?.status, description: data?.description },
        id,
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
  const handelStatusChange = async () => {
    try {
      let newStatus;
      if (status == "ACTIVE") {
        newStatus = "INACTIVE";
      } else {
        newStatus = "ACTIVE";
      }
      const res = (await updateDisplayNotice({
        updateValue: { status: newStatus, description },
        id,
      })) as any;
      if (res?.data?.success) {
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
    <>
      <TableCell>
        <Switch
          checked={status !== "INACTIVE"}
          className="data-[state=checked]:bg-green-600 cursor-pointer"
          onClick={() => handelStatusChange()}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-center gap-2 h-full">
          <div className="hover:bg-green-50 no-border cursor-pointer">
            <CustomModal
              open={modalOpen}
              setOpen={setModalOpen}
              title="Create Patient"
              description="Fill in the form below."
              handleFormSubmit={handleFormSubmit}
              input={createPatientInputs}
              select={selectFields}
              buttonProperty={{ type: "edit", text: "Add Display notice" }}
              defaultValues={{
                description,
                status,
              }}
            />
          </div>
          <div>
            <ConfirmAlert
              id={id}
              onDeleted={deleteDisplayNotice}
              person={"Patient"}
            />
          </div>
        </div>
      </TableCell>
    </>
  );
};

export default Actions;
