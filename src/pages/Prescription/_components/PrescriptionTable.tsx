/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Plus } from "lucide-react";
import type { Patient } from "@/types/patient.types";
import { Link } from "react-router-dom";
import Pagination from "@/components/shared/Pagination";

const PrescriptionTable = ({
  patients,
  active,
  totalPages,
  onPageChange,
}: any) => {
  return (
    <>
      <div className="rounded-b-sm overflow-hidden shadow-sm w-full">
        <Table className="no-border">
          <TableHeader className="no-border">
            <TableRow className="bg-[#f7f7f7] no-border">
              {[
                "SN",
                "Patient Name",
                "Phone",
                "Prescription",
                "Patient Status",
                "Action",
              ].map((header, ind) => (
                <TableHead
                  key={ind}
                  className={`${ind === 4 && "text-center"} ${ind === 5 && "text-center"} pl-4`}
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients?.map((patient: Patient, index: number) => (
              <TableRow
                key={patient.id}
                className={`no-border ${index % 2 === 0 ? "bg-white" : "bg-[#f7f7f7]"}`}
              >
                <TableCell className="font-medium pl-4">{index + 1}</TableCell>
                <TableCell className="text-[#5C727D]">
                  {patient.name || "N/A"}
                </TableCell>
                <TableCell className="text-[#5C727D] space-x-2">
                  {patient.phoneNumber}
                </TableCell>
                <TableCell className="text-white space-x-2">
                  <div className="flex items-center justify-center min-h-[2.5rem]">
                    <span className="text-[#5C727D]">-</span>
                  </div>
                </TableCell>
                <TableCell className="text-[#5C727D] text-center px-4">
                  <div className="flex items-center justify-center min-h-[2.5rem]">
                    {patient.status || "N/A"}
                  </div>
                </TableCell>
                <TableCell className="text-center px-4">
                  <div className="flex items-center justify-center gap-2 min-h-[2.5rem]">
                    <Link
                      to={`/dashboard/view-prescription/${patient.id}`}
                      className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                    >
                      <Eye className="h-5 w-5 text-[#14400D]" />
                    </Link>
                    <Link
                      to={`/dashboard/create-prescription/${patient?.id}`}
                      state={{
                        patient: { name: patient.name, age: patient.age },
                      }}
                      className="bg-brand inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium text-white shadow-sm border border-transparent hover:opacity-90 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1"
                    >
                      <Plus className="h-3 w-3" />
                    </Link>
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
    </>
  );
};

export default PrescriptionTable;
