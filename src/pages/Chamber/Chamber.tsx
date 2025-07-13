/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteStaffMutation } from "@/redux/api/staff/staff";
import { useAppSelector } from "@/redux/hooks";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Info, SquarePen, SquarePlus } from "lucide-react";
import CustomModal from "@/components/shared/CustomModal";
import { Switch } from "@/components/ui/switch";
import ConfirmAlert from "@/components/shared/ConfirmAlert";
import {
  useCreateChamberMutation,
  useGetChambersQuery,
} from "@/redux/api/chamber/chamber";
import type { Chamber } from "@/types/chamber.types";
import { Badge } from "@/components/ui/badge";

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
    <div className="">
      <div className="w-full mt-[30px]">
        {/* Header Section */}
        <div className="flex items-center justify-between mb- bg-white py-[18px] ps-[20px] rounded-t-sm">
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-brand hover:bg-green-800 text-white">
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

            {chamberData?.data?.length == 0 && (
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
            )}
          </div>
        </div>

        {/* Table Section */}
        <div className="rounded-b-sm overflow-hidden shadow-sm custom-container">
          {chamberData?.data?.length == 0 ? (
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
                    "Chamber Name",
                    "Start Date",
                    "End Date",
                    "Patient (Tk)",
                    "Status",
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
                {chamberData?.data?.map((member: Chamber, index: number) => (
                  <TableRow
                    key={member.id}
                    className={`no-border ${index % 2 === 0 ? "bg-white" : "bg-[#f7f7f7]"}`}
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="text-[#5C727D]">
                      {member.name}
                    </TableCell>
                    <TableCell className="text-[#5C727D]">
                      {member.startTime || "N/A"}
                    </TableCell>
                    <TableCell className="text-[#5C727D]">
                      {member.endTime || "N/A"}
                    </TableCell>
                    <TableCell className="text-[#5C727D] space-x-2">
                      <Badge variant="outline" className="rounded">
                        New {member.newPatientFee}
                      </Badge>
                      <Badge variant="outline" className="rounded">
                        Old {member.oldPatientFee}
                      </Badge>
                      <Badge variant="outline" className="rounded">
                        Report {member.reportFee}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={member.status === "ACTIVE"}
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
                            id={member?.id}
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

export default Chamber;
