"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetPerceptionByPatientIdQuery } from "@/redux/api/prescription/prescription"
import { Edit, Info, Printer } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { useRef } from "react"
import { useGetPreManagementQuery } from "@/redux/api/PreManagement/PreManagementApi"
import { EmptyState } from "@/components/shared/EmptyState"
import { printPrescription } from "@/utils/printPrescription"
import BackButton from "@/components/shared/BackButton"

const ViewPrescription = () => {
  const { patientId } = useParams()
  const { data: prescriptions } = useGetPerceptionByPatientIdQuery(patientId)
  const { data: preManagementData } = useGetPreManagementQuery(undefined)
  const printRefs = useRef<(HTMLDivElement | null)[]>([])

  const setPrintRef = (el: HTMLDivElement | null, index: number) => {
    printRefs.current[index] = el
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <BackButton className="shadow-none border-none hover:bg-gray-100 rounded-none text-gray-600 hover:text-gray-800" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {prescriptions?.data?.length === 0 && (
          <EmptyState
            icon={<Info className="w-full h-full" />}
            title="No Prescription is Found"
            description="There are currently no prescription to display. Add prescription to get started."
            size="md"
          />
        )}

        {prescriptions?.data?.map((medic: any, index: number) => (
          <div className="mb-8" key={medic.id || index}>
            <div className="flex justify-start items-center gap-2 pb-4">
              <button
                onClick={() => printPrescription(medic, preManagementData)}
                className="flex justify-center items-center gap-2 bg-brand text-white py-2 px-4 rounded-lg hover:bg-brand/90 transition-colors shadow-sm"
              >
                <Printer className="size-4 text-white" />
                <span>Print</span>
              </button>

              <Link
                to={`/dashboard/update-prescription/${medic.id}`}
                state={{ perception: medic }}
                className="flex justify-center items-center gap-2 bg-[#47C363] text-white py-2 px-4 rounded-lg hover:bg-[#47C363]/90 transition-colors shadow-sm"
              >
                <Edit className="size-4 text-white" />
                <span>Edit</span>
              </Link>
            </div>

            {/* Screen View */}
            <div
              ref={(el) => setPrintRef(el, index)}
              className="bg-white rounded-lg overflow-hidden shadow-md max-w-2xl mx-auto"
            >
              <div className="screen-container min-h-[800px] flex flex-col justify-between">
                <img src={preManagementData?.data?.[0]?.headerImage || "/placeholder.svg"} alt="" />

                <div className="min-h-[620px]">
                  <div className="bg-gray-50 p-3 text-sm flex justify-between">
                    <span>
                      <strong>Name:</strong> {medic?.patient?.name}
                    </span>
                    <span>
                      <strong>Age:</strong> {medic?.patient?.age}
                    </span>
                    <span>
                      <strong>Date:</strong> {medic?.createdAt?.split("T")[0]}
                    </span>
                    <span>
                      <strong>ID:</strong> N/A
                    </span>
                  </div>

                  <div className="h-screen">
                    <div className="flex h-full">
                      {/* Left Column: Chief Complaints, Examinations, Diagnosis, Investigation */}
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

                      {/* Right Column: Medicines, Advice, Next Visit */}
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
                                    <div className="min-w-[50px]">{item?.day || ""}</div>
                                    <div className="min-w-[50px]">{item?.time || ""}</div>
                                    <div className="flex-1">
                                      {item?.comment && (
                                        <span className="text-[9px] font-normal text-gray-500 ml-2">
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
                                  <div key={inx} className="flex items-start justify-start gap-1 text-xs text-gray-700">
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

                <img src={preManagementData?.data?.[0]?.footerImage || "/placeholder.svg"} alt="" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ViewPrescription