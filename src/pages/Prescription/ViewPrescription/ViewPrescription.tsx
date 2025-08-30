"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetPerceptionByPatientIdQuery } from "@/redux/api/prescription/prescription"
import { Edit, Info, Printer } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { useGetPreManagementQuery } from "@/redux/api/PreManagement/PreManagementApi"
import { EmptyState } from "@/components/shared/EmptyState"
import { printPrescription } from "@/utils/printPrescription"
import BackButton from "@/components/shared/BackButton"

const ViewPrescription = () => {
  const { patientId } = useParams()
  const { data: prescriptions, refetch } = useGetPerceptionByPatientIdQuery(patientId)
  const { data: preManagementData } = useGetPreManagementQuery(undefined)
  const printRefs = useRef<(HTMLDivElement | null)[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    refetch()
  }, [patientId, refetch])

  useEffect(() => {
    if (prescriptions?.data?.length > 0 && !selectedDate) {
      setSelectedDate(prescriptions.data[0]?.createdAt?.split("T")[0])
    }
  }, [prescriptions?.data, selectedDate])

  const setPrintRef = (el: HTMLDivElement | null, index: number) => {
    printRefs.current[index] = el
  }

  const uniqueDates = [...new Set(prescriptions?.data?.map((medic: any) => medic?.createdAt?.split("T")[0]))]

  const getPrescriptionCountForDate = (date: string) => {
    return prescriptions?.data?.filter((medic: any) => medic?.createdAt?.split("T")[0] === date).length || 0
  }

  const filteredPrescriptions = selectedDate
    ? prescriptions?.data?.filter((medic: any) => medic?.createdAt?.split("T")[0] === selectedDate)
    : prescriptions?.data

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <BackButton className="shadow-none border-none hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-800 transition-colors" />
              <h1 className="text-lg font-semibold text-slate-900">Prescription History</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {prescriptions?.data?.length === 0 && (
          <EmptyState
            icon={<Info className="w-full h-full" />}
            title="No Prescription is Found"
            description="There are currently no prescription to display. Add prescription to get started."
            size="md"
          />
        )}

        <div className="flex gap-8">
          <div className="w-72 flex-shrink-0 z-10">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Prescription Dates</h3>
              <div className="space-y-1">
                {uniqueDates?.map((date: any) => {
                  const isSelected = selectedDate === date
                  const count = getPrescriptionCountForDate(date)
                  return (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        isSelected ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{date}</span>
                        {count > 1 && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{count}</span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="max-h-[850px] overflow-y-auto space-y-8 pr-2">
              {filteredPrescriptions?.map((medic: any, index: number) => (
                <div key={medic.id || index}>
                  <div className="flex justify-end gap-3 mb-4">
                    <button
                      onClick={() => printPrescription(medic, preManagementData)}
                      className="flex items-center gap-2 px-4 py-2 cursor-pointer border border-slate-300 rounded-lg hover:bg-slate-50 transition-all duration-200 text-slate-700 hover:text-slate-900"
                      title="Print Prescription"
                    >
                      <Printer className="size-4" />
                      <span className="text-sm font-medium">Print</span>
                    </button>

                    <Link
                      to={`/dashboard/update-prescription/${medic.id}`}
                      state={{ perception: medic }}
                      className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all duration-200 text-slate-700 hover:text-slate-900"
                      title="Edit Prescription"
                    >
                      <Edit className="size-4" />
                      <span className="text-sm font-medium">Edit</span>
                    </Link>
                  </div>

                  <div
                    ref={(el) => setPrintRef(el, index)}
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 relative hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="screen-container min-h-[800px] flex flex-col justify-between">
                      <img
                        src={preManagementData?.data?.[0]?.headerImage || "/placeholder.svg" || "/placeholder.svg"}
                        alt=""
                      />

                      <div className="min-h-[620px]">
                        <div className="bg-slate-50 p-4 text-sm flex justify-between border-b border-slate-200">
                          <span className="font-medium">
                            <strong className="text-slate-700">Name:</strong>{" "}
                            <span className="text-slate-900">{medic?.patient?.name}</span>
                          </span>
                          <span className="font-medium">
                            <strong className="text-slate-700">Age:</strong>{" "}
                            <span className="text-slate-900">{medic?.patient?.age}</span>
                          </span>
                          <span className="font-medium">
                            <strong className="text-slate-700">Date:</strong>{" "}
                            <span className="text-slate-900">
                              {medic?.createdAt ? new Date(medic.createdAt).toLocaleDateString("en-GB") : ""}
                            </span>
                          </span>
                          <span className="font-medium">
                            <strong className="text-slate-700">ID:</strong>{" "}
                            <span className="text-slate-900">{medic?.prescriptionNo}</span>
                          </span>
                        </div>

                        <div className="h-screen">
                          <div className="flex h-full">
                            <div className="flex flex-col items-start justify-start w-1/3 border-r-2 border-gray-800 gap-2 mt-5">
                              {medic?.chiefComplaint?.length > 0 && (
                                <div className="ps-4 overflow-y-auto">
                                  <h3 className="font-bold text-xs">Chief Complaints</h3>
                                  <ul>
                                    {medic.chiefComplaint.map((item: any, idx: number) => (
                                      <li key={idx} className="flex items-start text-sm ps-2">
                                        <span className="w-1 h-1 bg-gray-800 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                                        <span className="text-xs text-gray-800">{item.description}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {medic?.onExaminations?.length > 0 && (
                                <div className="ps-4 overflow-y-auto">
                                  <h3 className="font-bold text-xs">On Examinations</h3>
                                  <ul>
                                    {medic.onExaminations.map((item: any, idx: number) => (
                                      <li key={idx} className="flex items-start text-sm ps-2">
                                        <span className="w-1 h-1 bg-gray-800 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                                        <span className="text-xs text-gray-800">{item.description}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {medic?.diagnosis?.length > 0 && (
                                <div className="ps-4">
                                  <h3 className="font-bold text-xs">Diagnosis</h3>
                                  <ul>
                                    {medic.diagnosis.map((item: any, idx: number) => (
                                      <li key={idx} className="flex items-start text-sm ps-2">
                                        <span className="w-1 h-1 bg-gray-800 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                                        <span className="text-xs text-gray-800">{item.description}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {medic?.investigation?.length > 0 && (
                                <div className="ps-4 overflow-y-auto">
                                  <h3 className="font-bold text-xs">Investigation</h3>
                                  <ul>
                                    {medic.investigation.map((item: any, idx: number) => (
                                      <li key={idx} className="flex items-start text-sm ps-2">
                                        <span className="w-1 h-1 bg-gray-800 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                                        <span className="text-xs text-gray-800">{item.description}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            <div className="flex-1 flex flex-col justify-between items-start px-2 py-4 h-full overflow-y-auto w-full">
                              <div className="space-y-4">
                                {medic?.medicines?.map((med: any, medIndex: number) => (
                                  <div key={medIndex} className="mb-3">
                                    <div className="font-semibold text-xs mb-1">
                                      {medIndex + 1}. {med.medicineName}
                                    </div>
                                    {med?.DosageSchedule?.map((item: any, scheduleIndex: number) => (
                                      <div key={scheduleIndex} className="ml-6 text-xs">
                                        <div className="flex items-start gap-6">
                                          <div className="min-w-[50px]">{item?.dosage || ""}</div>
                                          <div className="min-w-[50px]">{item?.time || ""}</div>
                                          <div className="min-w-[50px]">{item?.day || ""}</div>
                                          <div className="flex-1">
                                            {item?.comment && (
                                              <span className="text-[10px] font-normal text-gray-500 ml-2">
                                                {item.comment}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>

                              <div>
                                {medic?.advice?.length > 0 && (
                                  <div>
                                    <span className="font-semibold text-xs">Advice</span>
                                    <div className="ps-5">
                                      {medic.advice.map((item: any, inx: number) => (
                                        <div
                                          key={inx}
                                          className="flex items-start justify-start gap-1 text-xs text-gray-700"
                                        >
                                          <span>
                                            {inx + 1}. {item.description}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {medic?.nextVisit && (
                                  <div>
                                    <span className="font-semibold text-xs">Next Visit</span>
                                    <div className="ps-5 text-xs text-gray-700">{medic.nextVisit}</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <img
                        src={preManagementData?.data?.[0]?.footerImage || "/placeholder.svg" || "/placeholder.svg"}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewPrescription
