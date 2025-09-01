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
import {
  useUpdateIsArrivedPatientMutation,
  useUpdatePatientMutation,
} from "@/redux/api/patient/patient";
import { useAppDispatch } from "@/redux/hooks";
import { useSelector } from "react-redux";
import { toggleSerial, endSerial } from "@/redux/api/features/serialSlice";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

interface AppointmentTableProps {
  patients: Patient[];
  deletePatient: (id: string) => void;
}

const AppointmentTable = ({
  patients,
  deletePatient,
}: AppointmentTableProps) => {
  const [updateIsArrivedPatient] = useUpdateIsArrivedPatientMutation();
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
    const arrivedStatus = visitStatus == "VISITED" ? true : false
    try {
      await updatePatient({
        id,
        payload: { visitStatus ,isArrived:arrivedStatus},
      });
      toast.success("Visit status updated successfully");
    } catch (error) {
      toast.success("Visit status is not updated");
      console.error("Failed to update visit status", error);
    }
  };

  const handleCheckboxChange = async (patientId: string, isArrived: any) => {
    const arrived = isArrived == "ARRIVED" ? true : false;
    const updateData = { isArrived: arrived, id: patientId };
    const res = (await updateIsArrivedPatient(updateData)) as any;
    if (res?.data?.message) {
      toast.success(res?.data?.message);
    } else {
      toast.error(res?.error?.data?.message);
    }
  };

  const patientsData = [...(patients || [])]?.sort(
    (a: any, b: any) => a.time - b.time
  );
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
              "Arrived Status",
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
                  <Button
                    className="rounded bg-green-600 cursor-pointer size-2 px-5 py-3"
                    onClick={() => dispatch(toggleSerial(patient.id))}
                    disabled={patient?.visitStatus == "VISITED" ? true : false}
                  >
                    Called
                  </Button>
                ) : (
                  <Button
                    className="rounded bg-[#14400D] cursor-pointer size-2 px-5 py-3"
                    onClick={() => dispatch(toggleSerial(patient.id))}
                    disabled={patient?.visitStatus == "VISITED" ? true : false}
                  >
                    Call
                  </Button>
                )}
                <Button
                  className="rounded bg-red-500 cursor-pointer size-2 px-5 py-3"
                  onClick={() => dispatch(endSerial(patient.id))}
                  disabled={patient?.visitStatus == "VISITED" ? true : false}
                >
                  End
                </Button>
              </TableCell>
              <TableCell>
                <select
                  value={
                    patient?.isArrived == false ? "NOT-ARRIVED" : "ARRIVED"
                  }
                  onChange={(e) =>
                    handleCheckboxChange(patient.id, e.target.value)
                  }
                  disabled={patient?.visitStatus == "VISITED" ? true : false}
                  className={`border rounded text-xs  text-white p-1 focus:outline-none ${patient?.visitStatus == "VISITED" ? "bg-gray-400" : "bg-[#14400D]"}`}
                >
                  <option value="ARRIVED">ARRIVED</option>
                  <option value="NOT-ARRIVED">NOT-ARRIVED</option>
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
