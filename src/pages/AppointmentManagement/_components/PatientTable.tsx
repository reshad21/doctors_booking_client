import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Info, SquarePen, SquarePlus } from "lucide-react";
import ConfirmAlert from "@/components/shared/ConfirmAlert";
import type { Patient } from "@/types/patient.types";

interface PatientTableProps {
  patientsData: Patient[];
  deleteStaff: (id: string) => void;
}

const PatientTable = ({ patientsData, deleteStaff }: PatientTableProps) => {
  if (!patientsData?.length) {
    return (
      <div className="flex justify-center items-center h-[80vh] font-semibold text-xs">
        <div className="flex flex-col justify-center space-y-2 items-center text-yellow-900">
          <Info />
          <span>No Patient booked yet!</span>
        </div>
      </div>
    );
  }
  return (
    <Table className="no-border">
      <TableHeader className="no-border">
        <TableRow className="bg-[#f7f7f7] no-border">
          {["SN", "Token", "Patient Name", "Phone", "Date", "Patient Status", "Payment", "Visited", "Action"].map((header, ind) => (
            <TableHead key={ind} className={`${ind == 7 && "text-center"}`}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {patientsData?.map((patient: Patient, index: number) => (
          <TableRow key={patient.id} className={`no-border ${index % 2 === 0 ? "bg-white" : "bg-[#f7f7f7]"}`}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell className="text-[#5C727D]">{patient.name}</TableCell>
            <TableCell className="text-[#5C727D]">{patient.name || "N/A"}</TableCell>
            <TableCell className="text-[#5C727D] space-x-2">{patient.phoneNumber}</TableCell>
            <TableCell className="text-[#5C727D] space-x-2">{patient.createdAt || "N/A"}</TableCell>
            <TableCell className="text-[#5C727D] space-x-2">{patient.visitStatus || "N/A"}</TableCell>
            <TableCell className="text-[#5C727D] space-x-2">Paid</TableCell>
            <TableCell>
              <Switch checked={patient.status === "ACTIVE"} className="data-[state=checked]:bg-green-600" />
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
                  <ConfirmAlert id={patient?.id} onDeleted={deleteStaff} person={"Staff"} />
                </div>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PatientTable;