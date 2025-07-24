import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Info, SquarePen } from "lucide-react";
import ConfirmAlert from "@/components/shared/ConfirmAlert";
import type { Patient } from "@/types/patient.types";
import formatDateToReadable from "@/utils/formateDateToReveal";
import { Badge } from "@/components/ui/badge";
import { UpdatePatientModal } from "./UpdatePatientModal";
import { useState } from "react";
import { useUpdatePatientMutation } from "@/redux/api/patient/patient";
import toast from "react-hot-toast";

interface AppointmentTableProps {
  patientsData: Patient[];
  deletePatient: (id: string) => void;
}

const AppointmentTable = ({ patientsData, deletePatient }: AppointmentTableProps) => {
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [modalDataToUpdate, setModalDataToUpdate] = useState<Patient | null>(null);
  const [updatePatient] = useUpdatePatientMutation();

  const handleUpdateClick = (patient: Patient) => {
    setModalDataToUpdate(patient);
    setUpdateModalOpen(true);
  };

  const handleVisitChange = async (id: string, visitStatus: string) => {
    try {
      await updatePatient({
        id,
        payload: { visitStatus },
      });
      toast.success("Visit status updated successfully");
    } catch (error) {
      toast.success("Visit status is not updated");
      console.error('Failed to update visit status', error);
    }
  }

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
    <div>
      <Table className="no-border">
        <TableHeader className="no-border">
          <TableRow className="bg-[#f7f7f7] no-border">
            {[
              "SN",
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
                className={`${ind === 0 ? "pl-4" : ""} ${ind == 7 && "text-center"}`}
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {patientsData?.map((patient: Patient, index: number) => (
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
              <TableCell className="text-[#5C727D] space-x-2">
                {formatDateToReadable(patient.createdAt) || "N/A"}
              </TableCell>
              <TableCell className="text-[#5C727D] capitalize space-x-2">
                {patient.status ? patient.status.toLowerCase() : "N/A"}
              </TableCell>
              <TableCell className="text-[#5C727D] space-x-2">
                <Badge className="bg-[#14400D] rounded">Paid</Badge>
              </TableCell>
              <TableCell>
                <select
                  value={patient.visitStatus}
                  onChange={(e) => handleVisitChange(patient.id, e.target.value)}
                  className="border rounded text-xs bg-[#14400D] text-white p-1 focus:outline-none"
                >
                  <option value="VISITED">Visited</option>
                  <option value="NOT_VISITED">Not Visited</option>
                </select>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2 h-full">
                  <div className="hover:bg-green-50 no-border cursor-pointer">
                    <SquarePen
                      onClick={() => handleUpdateClick(patient)}
                      className="h-5 w-5 text-[#14400D]"
                    />
                  </div>
                  <div>
                    <ConfirmAlert
                      id={patient?.id}
                      onDeleted={deletePatient}
                      person={"Patient"}
                    />
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
          <div className="hidden">
            <UpdatePatientModal
              open={updateModalOpen}
              setOpen={setUpdateModalOpen}
              data={modalDataToUpdate}
            />
          </div>
        </TableBody>
      </Table>
    </div>
  );
};

export default AppointmentTable;
