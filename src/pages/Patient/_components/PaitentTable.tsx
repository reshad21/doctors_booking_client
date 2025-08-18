"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye } from "lucide-react"
import ConfirmAlert from "@/components/shared/ConfirmAlert"
import type { Patient } from "@/types/patient.types"
import formatDateToReadable from "@/utils/formateDateToReveal"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import PatientModal from "./PatientModal"

interface PatientTableProps {
  patientsData: Patient[]
  deletePatient: (id: string) => void
}

const PatientTable = ({ patientsData, deletePatient }: PatientTableProps) => {
  const [showModal, setShowModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedPatient(null)
  }

  return (
    <div>
      <Table className="no-border">
        <TableHeader className="no-border">
          <TableRow className="bg-[#f7f7f7] no-border">
            {[
              "SN",
              "Patient Details", // Changed from "Patient Name" to "Patient Details" since it now includes phone
              "Date",
              "Patient Status",
              "Payment",
              "Visited",
              "Action",
            ].map((header, ind) => (
              <TableHead
                key={ind}
                className={`${ind === 0 ? "pl-4" : ""} ${ind == 6 && "text-center"}`} // Updated index from 7 to 6 for Action column
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {patientsData?.map((patient: Patient, index: number) => (
            <TableRow key={patient.id} className={`no-border ${index % 2 === 0 ? "bg-white" : "bg-[#f7f7f7]"}`}>
              <TableCell className="font-medium pl-4">{index + 1}</TableCell>
              <TableCell className="text-[#5C727D]">
                <div className="flex flex-col">
                  <span>{patient.name || "N/A"}</span>
                  <span className="text-xs text-gray-500">{patient.phoneNumber}</span>
                </div>
              </TableCell>
              <TableCell className="text-[#5C727D] space-x-2">
                {formatDateToReadable(patient.createdAt) || "N/A"}
              </TableCell>
              <TableCell className="text-[#5C727D] capitalize space-x-2">
                {patient.status ? patient.status.toLowerCase() : "N/A"}
              </TableCell>
              <TableCell className="text-[#5C727D] space-x-2">
                {patient.visitStatus === "VISITED" ? (
                  <Badge className="bg-[#14400D] rounded">Offline Paid</Badge>
                ) : (
                  <Badge className="bg-red-400 rounded">Unpaid</Badge>
                )}
              </TableCell>
              <TableCell>
                <span className="border rounded text-xs bg-[#14400D] text-white p-1 capitalize focus:outline-none">
                  {{
                    VISITED: "Visited",
                    NOT_VISITED: "Not Visited",
                  }[patient?.visitStatus ?? ""] || "N/A"}
                </span>
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
                    <ConfirmAlert id={patient?.id} onDeleted={deletePatient} person={"Patient"} />
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PatientModal patient={selectedPatient} isOpen={showModal} onClose={handleCloseModal} />
    </div>
  )
}

export default PatientTable
