/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, SquarePlus, SquarePen } from "lucide-react";
import {
  useCreateStaffMutation,
  useDeleteStaffMutation,
  useGetStaffQuery,
} from "@/redux/api/staff/staff";
import type { Staff } from "@/types/staff.types";
import ConfirmAlert from "@/components/shared/ConfirmAlert";
import CustomModal from "@/components/shared/CustomModal";
import { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import toast from "react-hot-toast";

const StaffManagement = () => {
  const { data: staffData } = useGetStaffQuery(undefined);
  const [deleteStaff] = useDeleteStaffMutation();
  const [modalOpen, setModalOpen] = useState(false);
  const [createStaff] = useCreateStaffMutation();
  const doctorId = useAppSelector((state) => state.admin.id);

  const handleFormSubmit = async (
    data: Record<string, any>,
    helpers: { reset: () => void; close: () => void }
  ) => {
    const res = await createStaff({
      ...data,
      doctorId,
    }) as any;
    if (res?.data?.success) {
      helpers.reset();
      helpers.close();
      toast.success(res?.data?.message)
    } else {
      console.error();
      toast.error(res?.error?.data?.message || "something went wrong")
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

            {staffData?.data?.length == 0 && (
              <CustomModal
                open={modalOpen}
                setOpen={setModalOpen}
                title="Create User"
                description="Fill in the form below."
                handleFormSubmit={handleFormSubmit}
                input={[
                  { label: "Full Name", name: "name" },
                  { label: "Email", name: "email" },
                  { label: "Phone", name: "phone" },
                  { label: "Password", name: "password" },
                ]}
                file={[
                   { label: "Profile Image", name: "staffImage" },
                ]}
                buttonProperty={{ type: "create", text: "AddNew Staff" }}
              />
            )}
          </div>
        </div>

        {/* Table Section */}
        <div className="rounded-lg overflow-hidden shadow-sm">
          <Table className="no-border">
            <TableHeader className="no-border">
              <TableRow className="bg-[#f7f7f7] no-border">
                {[
                  "SN",
                  "Image",
                  "Staff Name",
                  "Email",
                  "JoinDate",
                  "Phone Number",
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
              {staffData?.data?.map((member: Staff, index: number) => (
                <TableRow
                  key={member.id}
                  className={`no-border ${index % 2 === 0 ? "bg-white" : "bg-[#f7f7f7]"}`}
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src={member.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-[#5C727D]">
                    {member.name}
                  </TableCell>
                  <TableCell className="text-[#5C727D]">
                    {member.email}
                  </TableCell>
                  <TableCell className="text-[#5C727D]">
                    {member.createdAt}
                  </TableCell>
                  <TableCell className="text-[#5C727D]">
                    {member.phone}
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
        </div>
      </div>
    </div>
  );
};
export default StaffManagement;
