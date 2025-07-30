/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Eye, Info, Plus } from "lucide-react";
import type { Patient } from "@/types/patient.types";
import CustomModal from "@/components/shared/CustomModal";
import { useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "@/components/shared/Pagination";

const PrescriptionTable = ({
  patients,
  active,
  totalPages,
  onPageChange,
}: any) => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleFormSubmit = async (
    data: Record<string, unknown>,
    helpers: { reset: () => void; close: () => void }
  ) => {
    const res = true;

    if (res) {
      helpers.reset();
      helpers.close();
      console.log(data);
    } else {
      console.error();
    }
  };

  if (!patients?.data?.data?.length) {
    return (
      <div className="flex justify-center items-center min-h-[91vh] font-semibold text-xs">
        <div className="flex flex-col justify-center space-y-2 items-center text-yellow-900">
          <Info />
          <span>No prescription yet!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="rounded-b-sm overflow-hidden shadow-sm w-full">
        <Table className="no-border">
          <TableHeader className="no-border">
            <TableRow className="bg-[#f7f7f7] no-border">
              {[
                "SN",
                "Token",
                "Patient Name",
                "Phone",
                "Prescription",
                "Patient Status",
                "Payment",
                "Visited",
                "Action",
              ].map((header, ind) => (
                <TableHead key={ind} className={`${ind == 7 && "text-center"}`}>
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients?.data?.data?.map((patient: Patient, index: number) => (
              <TableRow
                key={patient.id}
                className={`no-border ${index % 2 === 0 ? "bg-white" : "bg-[#f7f7f7]"}`}
              >
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="text-[#5C727D]">{patient.name}</TableCell>
                <TableCell className="text-[#5C727D]">
                  {patient.name || "N/A"}
                </TableCell>
                <TableCell className="text-[#5C727D] space-x-2">
                  {patient.phoneNumber}
                </TableCell>
                <TableCell className="text-white space-x-2">
                  <Link
                    to={`/dashboard/create-prescription/${patient?.id}`}
                    state={{
                      patient: { name: patient.name, age: patient.age },
                    }}
                    className="bg-brand flex justify-center items-center gap-2 rounded-sm cursor-pointer"
                  >
                    <Plus />
                    <span>Add</span>
                  </Link>
                </TableCell>
                <TableCell className="text-[#5C727D] space-x-2">
                  {patient.status || "N/A"}
                </TableCell>
                <TableCell className="text-[#5C727D] space-x-2">Paid</TableCell>
                <TableCell>
                  {/* <Switch
                    checked={
                      patient.visitStatus !==
                      ("NOT_VISITED" as typeof patient.visitStatus)
                    }
                    className="data-[state=checked]:bg-green-600"
                  /> */}

                  <span className="border rounded text-xs bg-[#14400D] text-white p-1 capitalize focus:outline-none">
                    {{
                      VISITED: "Visited",
                      NOT_VISITED: "Not Visited",
                    }[patient?.visitStatus ?? ""] || "N/A"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2 h-full">
                    <Link
                      to={`/dashboard/view-prescription/${patient.id}`}
                      className=" hover:bg-green-50 no-border "
                    >
                      <Eye className="h-5 w-5 text-[#14400D]" />
                    </Link>
                    <div className=" hover:bg-green-50 no-border">
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
                        select={[
                          {
                            label: "Role",
                            name: "role",
                            options: [
                              { name: "Admin", val: "admin" },
                              { name: "User", val: "user" },
                            ],
                          },
                        ]}
                        buttonProperty={{
                          text: "Submit",
                          className: "bg-brand text-white px-4 py-2 rounded",
                        }}
                      />
                    </div>
                    <div>
                      {/* <ConfirmAlert id={patient?.id} onDeleted={deleteStaff} person={"Staff"} /> */}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </div>
      {/* Pagination Section */}
      <div className="mt-4">
        <Pagination
          active={active}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default PrescriptionTable;
