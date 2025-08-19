/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SquarePen } from "lucide-react";
import ConfirmAlert from "@/components/shared/ConfirmAlert";
import type { Patient } from "@/types/patient.types";
import { Badge } from "@/components/ui/badge";
import { UpdatePatientModal } from "./UpdatePatientModal";
import { useState } from "react";
import { useUpdatePatientMutation } from "@/redux/api/patient/patient";
import { useAppDispatch } from "@/redux/hooks";
import { useSelector } from "react-redux";
import { toggleSerial, endSerial } from "@/redux/api/features/serialSlice";
import toast from "react-hot-toast";

interface AppointmentTableProps {
  patientsData: Patient[];
  deletePatient: (id: string) => void;
}

const AppointmentTable = ({
  patientsData,
  deletePatient,
}: AppointmentTableProps) => {
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [modalDataToUpdate, setModalDataToUpdate] = useState<Patient | null>(
    null
  );
  const [updatePatient] = useUpdatePatientMutation();
  const dispatch = useAppDispatch();
  const calledSerials = useSelector((state: any) => state.serial.calledSerials);

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
      console.error("Failed to update visit status", error);
    }
  };

  return (
    <div>
      <Table className="no-border">
        <TableHeader className="no-border">
          <TableRow className="bg-[#f7f7f7] no-border">
            {[
              "SN",
              "Patient Name",
              "Patient Status",
              "Payment",
              "Visited",
              "Patient Calling",
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
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{patient.name || "N/A"}</span>
                  <span className="text-xs text-[#5C727D]">
                    {patient.phoneNumber}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-[#5C727D] capitalize space-x-2">
                {patient.status ? patient.status.toLowerCase() : "N/A"}
              </TableCell>
              <TableCell className="text-[#5C727D] space-x-2">
                <TableCell className="text-[#5C727D] space-x-2">
                  {patient.visitStatus === "VISITED" ? (
                    <Badge className="bg-[#14400D] rounded">Offline Paid</Badge>
                  ) : (
                    <Badge className="bg-red-400 rounded">Unpaid</Badge>
                  )}
                </TableCell>
              </TableCell>
              <TableCell>
                <select
                  value={patient.visitStatus}
                  onChange={(e) =>
                    handleVisitChange(patient.id, e.target.value)
                  }
                  className="border rounded text-xs bg-[#14400D] text-white p-1 focus:outline-none"
                >
                  <option value="VISITED">Visited</option>
                  <option value="NOT_VISITED">Not Visited</option>
                </select>
              </TableCell>
              <TableCell className="text-[#5C727D] capitalize space-x-2">
                {calledSerials.includes(patient.id) ? (
                  <Badge
                    className="rounded bg-green-600 cursor-pointer"
                    onClick={() => dispatch(toggleSerial(patient.id))}
                  >
                    Called
                  </Badge>
                ) : (
                  <Badge
                    className="rounded bg-[#14400D] cursor-pointer"
                    onClick={() => dispatch(toggleSerial(patient.id))}
                  >
                    Call
                  </Badge>
                )}
                <Badge
                  className="rounded bg-red-500 cursor-pointer"
                  onClick={() => dispatch(endSerial(patient.id))}
                >
                  End
                </Badge>
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
