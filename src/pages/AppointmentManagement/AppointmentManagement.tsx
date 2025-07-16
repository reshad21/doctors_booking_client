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
  useGetPatientQuery,
} from "@/redux/api/patient/patient";
import { useDeleteStaffMutation } from "@/redux/api/staff/staff";
import { useAppSelector } from "@/redux/hooks";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import PatientTable from "./_components/PatientTable";
import { useSendSingleMessageMutation } from "@/redux/api/message/message";

const AppointmentManagement = () => {
  const [deleteStaff] = useDeleteStaffMutation();
  const [sendSingleMessage] = useSendSingleMessageMutation();
  const [modalOpen, setModalOpen] = useState(false);
  const [createPatient] = useCreatePatientMutation();
  const doctorId = useAppSelector((state) => state.admin.id);
  const { data: chambersData } = useGetChambersQuery(undefined);
  const { data: patientsData, isLoading } = useGetPatientQuery({});

  if (isLoading) <div>Loading</div>;

  const createPatientInputs = [
    { label: "Name", name: "name", type: "text" },
    { label: "Phone", name: "phoneNumber", type: "number" },
    { label: "Email", name: "email", type: "email" },
    { label: "Age", name: "age", type: "text" },
    { label: "Weight", name: "weight", type: "text" },
    { label: "Gender", name: "gender", type: "text" },
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
      const response = await sendSingleMessage({
        number: data?.phoneNumber,
        message: "this is test message",
      });
      console.log(response);
      helpers.reset();
      helpers.close();

      if (response?.data?.data?.success_message) {
        toast.success(
          `${res?.data?.message} & ${response?.data?.data?.success_message}`
        );
      } else {
        toast.success(`${res?.data?.message} `);
      }
    } else {
      console.error();
      toast.error(res?.error?.data?.message || "something went wrong");
    }
  };

  return (
    <div className="custom-container">
      <div className="w-full">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-brand hover:bg-green-800 cursor-pointer text-white">
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
          </div>
        </div>

        {/* Table Section */}
        <div className="rounded-b-sm overflow-hidden shadow-sm">
          <PatientTable
            patientsData={patientsData?.data}
            deleteStaff={deleteStaff}
          />
        </div>
      </div>
    </div>
  );
};

export default AppointmentManagement;
