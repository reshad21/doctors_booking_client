/* eslint-disable @typescript-eslint/no-explicit-any */
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Info } from "lucide-react";
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
import RoutesModal from "./_components/RoutesModal";
import formatDateToReadable from "@/utils/formateDateToReveal";
import UpdateStaff from "./_components/UpdateStaff";
import ExportDropdown from "@/components/shared/ExportDropdown";

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
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "staffImage" && value instanceof File) {
        formData.append("staffImage", value);
      } else {
        formData.append(key, value);
      }
    });

    formData.append("doctorId", doctorId);

    const res = (await createStaff(formData)) as any;
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
        <div className="flex items-center justify-between mb- bg-white py-[18px] ps-[20px] rounded-t-sm">
          <div className="flex items-center gap-3">
            <ExportDropdown
              data={staffData?.data || []}
              columns={[
                { label: "Staff Name", key: "name" },
                { label: "Email", key: "email" },
                { label: "Phone", key: "phone" },
                { label: "Status", key: "status" },
                { label: "Join Date", key: "createdAt" },
              ]}
            />

            {staffData?.data?.length == 0 && (
              <CustomModal
                open={modalOpen}
                setOpen={setModalOpen}
                title="Create User"
                description="Fill in the form below."
                handleFormSubmit={handleFormSubmit}
                input={[
                  { label: "Full Name", name: "name", type: "text" },
                  { label: "Email", name: "email", type: "email" },
                  { label: "Phone", name: "phone", type: "number" },
                  { label: "Password", name: "password", type: "password" },
                ]}
                file={[{ label: "Profile Image", name: "staffImage" }]}
                buttonProperty={{ type: "create", text: "AddNew Staff" }}
              />
            )}
          </div>
        </div>

        {/* Table Section */}
        <div className="rounded-b-sm overflow-hidden shadow-sm">
          {staffData?.data?.length == 0 ? (
            <div className="flex justify-center items-center h-[80vh] font-semibold text-xs">
              <div className="flex flex-col justify-center items-center text-yellow-900">
                <Info />
                <span>Staff not created yet!</span>
              </div>
            </div>
          ) : (
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
                    <TableCell className="font-medium pl-4">{index + 1}</TableCell>
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
                      {formatDateToReadable(member.createdAt)}
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
                        <RoutesModal routesAccess={member?.routeAccess ?? []} />
                        <div className=" hover:bg-green-50 no-border">
                          <UpdateStaff staff={member} />
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
export default StaffManagement;
