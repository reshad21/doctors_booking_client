/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CustomModal from "@/components/shared/CustomModal";
import {
  useCreateChamberMutation,
  useDeleteChamberMutation,
  useGetChambersQuery,
} from "@/redux/api/chamber/chamber";
import ChamberTable from "./ChamberTable";
import { convertTo12HourFormat } from "@/utils/TweleveHoursFormat";
import { Input } from "@/components/ui/input";

const Chamber = () => {
  const [deleteChamber] = useDeleteChamberMutation();
  const [modalOpen, setModalOpen] = useState(false);
  const [createChamber] = useCreateChamberMutation();
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { data: chamberData } = useGetChambersQuery({ searchTerm });


  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const chamberInputFields = [
    { label: "Name", name: "name", type: "text" },
    { label: "Address", name: "address", type: "text" },
    { label: "Old Patient", name: "oldPatientFee", type: "text" },
    { label: "New Patient", name: "newPatientFee", type: "text" },
    { label: "Report", name: "reportFee", type: "text" },
    { label: "Start Time", name: "startTime", type: "time" },
    { label: "End Time", name: "endTime", type: "time" },
    { label: "Day", name: "day", type: "days" },
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
    const formattedData = {
      ...data,
      startTime: convertTo12HourFormat(data.startTime),
      endTime: convertTo12HourFormat(data.endTime),
    };

    const res = (await createChamber(formattedData)) as any;
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
          
          <div className="flex items-center justify-center pr-4 gap-x-2">
            <span className="text-sm">Search:</span>
            <Input
              placeholder="Search"
              className="text-xs rounded"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="rounded-b-sm overflow-hidden shadow-sm">
          <ChamberTable
            chambersData={chamberData?.data}
            deleteChamber={deleteChamber}
          />
        </div>
      </div>
    </div>
  );
};

export default Chamber;
