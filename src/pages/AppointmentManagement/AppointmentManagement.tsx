/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  useDeleteStaffMutation,
  useGetStaffQuery,
} from "@/redux/api/staff/staff";
import { useAppSelector } from "@/redux/hooks";
import { ChevronDown, Info, SquarePen, SquarePlus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Switch } from "@/components/ui/switch";
import ConfirmAlert from "@/components/shared/ConfirmAlert";
import type { Patient } from "@/types/patient.types";

const AppointmentManagement = () => {
  const { data: staffData } = useGetStaffQuery(undefined);
  const [deleteStaff] = useDeleteStaffMutation();
  const [modalOpen, setModalOpen] = useState(false);
  const [createPatient] = useCreatePatientMutation();
  const doctorId = useAppSelector((state) => state.admin.id);
  const { data: chambersData } = useGetChambersQuery(undefined);
  const { data: patientsData, isLoading } = useGetPatientQuery({});

  if (isLoading) <div>Loading</div>;

  console.log(patientsData, "patients");

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
          <Button
            className="bg-brand hover:bg-green-800 text-white"
            onClick={() => setModalOpen(true)}
          />
        </div>

        {/* Table Section */}
        <div className="rounded-b-sm overflow-hidden shadow-sm custom-container">
          {patientsData?.data?.length == 0 ? (
            <div className="flex justify-center items-center h-[80vh] font-semibold text-xs">
              <div className="flex flex-col justify-center space-y-2 items-center text-yellow-900">
                <Info />
                <span>Chamber not created yet!</span>
              </div>
            </div>
          ) : (
            <Table className="no-border">
              <TableHeader className="no-border">
                <TableRow className="bg-[#f7f7f7] no-border">
                  {[
                    "SN",
                    "Token",
                    "Patient Name",
                    "Phone",
                    "Date",
                    "Patient Status",
                    "Payment",
                    "Visited",
                    "Action",
                  ].map((header, ind) => (
                    <TableHead
                      key={ind}
                      className={`${ind == 7 && "text-center"}`}
                    >
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {patientsData?.data?.map((patient: Patient, index: number) => (
                  <TableRow
                    key={patient.id}
                    className={`no-border ${index % 2 === 0 ? "bg-white" : "bg-[#f7f7f7]"}`}
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="text-[#5C727D]">
                      {patient.name}
                    </TableCell>
                    <TableCell className="text-[#5C727D]">
                      {patient.name || "N/A"}
                    </TableCell>
                    <TableCell className="text-[#5C727D] space-x-2">
                      {patient.phoneNumber}
                    </TableCell>
                    <TableCell className="text-[#5C727D] space-x-2">
                      {patient.createdAt || "N/A"}
                    </TableCell>
                    <TableCell className="text-[#5C727D] space-x-2">
                      {patient.visitStatus || "N/A"}
                    </TableCell>
                    <TableCell className="text-[#5C727D] space-x-2">
                      Paid
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={patient.status === "ACTIVE"}
                        className="data-[state=checked]:bg-green-600"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2 h-full">
                        <div className=" hover:bg-green-50 no-border">
                          <SquarePlus className="h-5 w-5 text-[#14400D]" />
                        </div>
                        <div className=" hover:bg-green-50 no-border">
                          <SquarePen className="h-5 w-5 text-[#14400D]" />
                        </div>

                        <div>
                          <ConfirmAlert
                            id={patient?.id}
                            onDeleted={deleteStaff}
                            person={"Staff"}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentManagement;
