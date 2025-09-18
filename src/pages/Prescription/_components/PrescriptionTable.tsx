/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Plus, CheckCircle } from "lucide-react"
import type { Patient } from "@/types/patient.types"
import { Link } from "react-router-dom"
import Pagination from "@/components/shared/Pagination"
import { formatTimeAgo } from "@/utils/formatTimeAgo"

const PrescriptionTable = ({ patients, active, totalPages, onPageChange,meta }: any) => {

  const hasPrescription = (patient: Patient) => {
    return patient.prescription && patient.prescription.length > 0
  }

  const getLatestPrescriptionTime = (patient: Patient) => {
    if (!hasPrescription(patient)) return null

    // Find the most recent prescription by createdAt
    const latestPrescription = patient.prescription.reduce((latest: any, current: any) => {
      return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
    })

    return latestPrescription.createdAt
  }

  // Helper function to get prescription status
  const getPrescriptionStatus = (patient: Patient) => {
    if (hasPrescription(patient)) {
      return {
        text: "Consultation Done",
        className: "bg-green-100 text-green-800 border-green-200",
        icon: <CheckCircle className="h-3 w-3" />,
      }
    }
    return {
      text: "Pending Consultation",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: null,
    }
  }

  return (
    <>
      <div className="rounded-b-sm overflow-hidden shadow-sm w-full">
        <Table className="no-border">
          <TableHeader className="no-border">
            <TableRow className="bg-[#f7f7f7] no-border">
              {[
                "SN",
                "Patient Name",
                "Prescription Status",
                "Created",
                "Patient Status",
                "Action",
              ].map((header, ind) => (
                <TableHead
                  key={ind}
                  className={`${ind === 0 && "text-center"} ${ind === 4 && "text-center"} ${ind === 5 && "text-center"} pl-4`}
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients?.map((patient: Patient, index: number) => {
              const prescriptionStatus = getPrescriptionStatus(patient)
              const latestPrescriptionTime = getLatestPrescriptionTime(patient)

              return (
                <TableRow key={patient.id} className={`no-border ${index % 2 === 0 ? "bg-white" : "bg-[#f7f7f7]"}`}>
                  <TableCell className="font-medium text-center">{(meta?.currentPage - 1) * 10 + (index + 1)}</TableCell>
                  <TableCell className="pl-4">
                    <div className="flex flex-col">
                      <span className="font-medium">{patient.name || "N/A"}</span>
                      <span className="text-xs text-[#5C727D]">{patient.phoneNumber}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4">
                    <div className="min-h-[2.5rem] items-center flex">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${prescriptionStatus.className}`}
                      >
                        {prescriptionStatus.icon}
                        {prescriptionStatus.text}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4">
                    <div className="min-h-[2.5rem] items-center flex">
                      <span className="text-sm text-[#5C727D]">
                        {latestPrescriptionTime ? formatTimeAgo(latestPrescriptionTime) : "No prescription"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-[#5C727D] text-center px-4">
                    <div className="flex items-center justify-center min-h-[2.5rem]">{patient.status || "N/A"}</div>
                  </TableCell>
                  <TableCell className="text-center px-4">
                    <div className="flex items-center justify-center gap-2 min-h-[2.5rem]">
                      {/* Eye button or invisible placeholder for consistent spacing */}
                      <div className="w-9 h-9 flex items-center justify-center">
                        {hasPrescription(patient) ? (
                          <Link
                            to={`/dashboard/view-prescription/${patient.id}`}
                            className="p-2 rounded-lg transition-all duration-200 hover:scale-110 hover:bg-gray-100"
                            title="View Prescription"
                          >
                            <Eye className="h-5 w-5 text-[#14400D]" />
                          </Link>
                        ) : (
                          <div className="w-5 h-5"></div>
                        )}
                      </div>

                      {/* Add button with consistent sizing */}
                      <Link
                        to={`/dashboard/create-prescription/${patient?.id}`}
                        className="bg-brand inline-flex items-center justify-center w-9 h-9 rounded-md text-white shadow-sm border border-transparent hover:opacity-90 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1"
                        title="Create New Prescription"
                      >
                        <Plus className="h-4 w-4" />
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      {/* Pagination Section */}
      <div className="mt-4">
        <Pagination active={active} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
    </>
  )
}

export default PrescriptionTable
