import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Activity, Calendar, Clock, Eye, Info, Mail, Phone, User, UserCheck, Users, Weight } from "lucide-react";
import ConfirmAlert from "@/components/shared/ConfirmAlert";
import type { Patient } from "@/types/patient.types";
import formatDateToReadable from "@/utils/formateDateToReveal";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface PatientTableProps {
  patientsData: Patient[];
  deletePatient: (id: string) => void;
}


const PatientTable = ({ patientsData, deletePatient }: PatientTableProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPatient(null);
  };

  console.log(patientsData)

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
                  value={
                    patient.status === "ACTIVE" ? "VISITED" : "NOT VISITED"
                  }
                  className="border rounded text-xs bg-[#14400D] text-white p-1 focus:outline-none"
                >
                  <option value="VISITED">Visited</option>
                  <option value="NOT VISITED">Not Visited</option>
                </select>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2 h-full">
                  <div
                    className="hover:bg-green-50 no-border cursor-pointer"
                    onClick={() => handleViewPatient(patient)}
                  >
                    <Eye className="h-5 w-5 text-[#14400D]" />
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
        </TableBody>
      </Table>

      <Dialog
        open={showModal}
        onOpenChange={(open) => {
          if (!open) handleCloseModal()
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Patient Information
            </DialogTitle>
            <DialogDescription>Complete details and medical information for the selected patient</DialogDescription>
          </DialogHeader>

          {selectedPatient && (
            <div className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Name</p>
                      <p className="font-medium">{selectedPatient.name || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Phone</p>
                      <p className="font-medium">{selectedPatient.phoneNumber || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Email</p>
                      <p className="font-medium text-sm">{selectedPatient.email || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Age</p>
                      <p className="font-medium">
                        {selectedPatient.age ? `${selectedPatient.age} years` : "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Medical Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Medical Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Gender</p>
                      <p className="font-medium">{selectedPatient.gender || "Not specified"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Weight className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Weight</p>
                      <p className="font-medium">{selectedPatient.weight || "Not recorded"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Status Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Status & Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Patient Status</p>
                        <Badge className="mt-1">
                          {selectedPatient.status || "Unknown"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Visit Status</p>
                        <Badge className="mt-1">
                          {selectedPatient.visitStatus || "Unknown"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 md:col-span-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Registration Date</p>
                      <p className="font-medium">
                        {selectedPatient.createdAt ? formatDateToReadable(selectedPatient.createdAt) : "Not available"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientTable;
