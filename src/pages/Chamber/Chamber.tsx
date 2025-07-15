/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDeleteStaffMutation } from "@/redux/api/staff/staff";
import { useAppSelector } from "@/redux/hooks";
import { useState } from "react";
import toast from "react-hot-toast";
import CustomModal from "@/components/shared/CustomModal";
import {
  useCreateChamberMutation,
  useGetChambersQuery,
} from "@/redux/api/chamber/chamber";
import type { Chamber } from "@/types/chamber.types";
import ChamberTable from "./ChamberTable";

const Chamber = () => {
  const { data: chamberData } = useGetChambersQuery(undefined);
  const [deleteStaff] = useDeleteStaffMutation();
  const [modalOpen, setModalOpen] = useState(false);
  const [createChamber] = useCreateChamberMutation();
  const doctorId = useAppSelector((state) => state.admin.id);

  const chamberInputFields = [
    { label: "Name", name: "name", type: "text" },
    { label: "Address", name: "address", type: "text" },
    { label: "Old Patient", name: "oldPatientFee", type: "text" },
    { label: "New Patient", name: "newPatientFee", type: "text" },
    { label: "Report", name: "reportFee", type: "text" },
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

  const handleFormSubmit = async (
    data: Record<string, any>,
    helpers: { reset: () => void; close: () => void }
  ) => {
    const res = (await createChamber({
      ...data,
      doctorId,
    })) as any;
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
        {/* Header Section */}
        <div className="flex items-center justify-between mb- bg-white py-[18px] pl-4">
          <div className="flex items-center gap-3">
            <CustomModal
              open={modalOpen}
              setOpen={setModalOpen}
              title="Create Chamber"
              description="Fill in the form below."
              handleFormSubmit={handleFormSubmit}
              input={chamberInputFields}
              select={selectFields}
              buttonProperty={{ type: "create", text: "Add New Chamber" }}
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="rounded-b-sm overflow-hidden shadow-sm">
          <ChamberTable
            chambersData={chamberData?.data}
            deleteStaff={deleteStaff}
          />
        </div>
      </div>
    </div>
  );
};

export default Chamber;
