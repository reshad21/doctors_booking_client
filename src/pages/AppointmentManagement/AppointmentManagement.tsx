/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomModal from "@/components/shared/CustomModal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetChambersQuery } from "@/redux/api/chamber/chamber";
import {
  useCreatePatientMutation,
  useDeletePatientMutation,
  useGetPatientQuery,
} from "@/redux/api/patient/patient";
import { useGetStaffQuery } from "@/redux/api/staff/staff";
import { useAppSelector } from "@/redux/hooks";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import PatientTable from "./_components/PatientTable";
import HeaderSelect from "./_components/HeaderSelect";

const AppointmentManagement = () => {
  const { data: staffData } = useGetStaffQuery(undefined);
  const [deletePatient] = useDeletePatientMutation();
  const [modalOpen, setModalOpen] = useState(false);
  const [createPatient] = useCreatePatientMutation();
  const doctorId = useAppSelector((state) => state.admin.id);
  const { data: chambersData } = useGetChambersQuery(undefined);
  const { data: patientsData, isLoading } = useGetPatientQuery({});

  if (isLoading) <div>Loading</div>;

  const createPatientInputs = [
    { label: "Name", name: "name" },
    { label: "Phone", name: "phoneNumber" },
    { label: "Email", name: "email" },
    { label: "Age", name: "age" },
    { label: "Weight", name: "weight" },
    { label: "Gender", name: "gender" },
  ];

  // Define select fields for Chamber and Status
  const selectFields = [
    {
      label: "Chamber",
      name: "chamberId",
      options: (chambersData?.data || []).map((chamber: any) => ({
        name: chamber.name,
        val: chamber.id,
      })),
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

  const handleFormSubmit = async (
    data: Record<string, any>,
    helpers: { reset: () => void; close: () => void }
  ) => {
    const res = (await createPatient({
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
        <div className="mb-4">
          <HeaderSelect chambersData={chambersData?.data} />
        </div>
        {/* Header Section */}
        <div className="flex items-center justify-between py-4 pl-4 bg-white">
          <div className="flex items-center gap-3 justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-brand rounded hover:bg-green-800 cursor-pointer text-white">
                  Export
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                <DropdownMenuItem>Export as Excel</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {staffData?.data?.length == 0 && (
              <CustomModal
                open={modalOpen}
                setOpen={setModalOpen}
                title="Create Patient"
                description="Fill in the form below."
                handleFormSubmit={handleFormSubmit}
                input={createPatientInputs}
                select={selectFields}
                buttonProperty={{ type: "create", text: "Add New Patient" }}
              />
            )}
          </div>
        </div>

        {/* Table Section */}
        <div className="rounded-b-sm overflow-hidden shadow-sm">
          <PatientTable
            patientsData={patientsData?.data}
            deletePatient={deletePatient}
          />
        </div>
      </div>
    </div>
  );
};

export default AppointmentManagement;
