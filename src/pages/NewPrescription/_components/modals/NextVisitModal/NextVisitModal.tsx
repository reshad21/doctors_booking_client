"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Modal from "@/components/shared/Modal"
import { Check } from "lucide-react"

export interface NextVisitItem {
  id: string
  durationType: string
  durationValue: string
  notes: string
  showInReport?: boolean
  withPatient?: boolean
}

export const NextVisitModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { nextVisit: NextVisitItem }) => void
}) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [nextVisit, setNextVisit] = useState<NextVisitItem>({
    id: String(Date.now()),
    durationType: "",
    durationValue: "",
    notes: "",
    showInReport: false,
    withPatient: false,
  })

  if (!isOpen) return null

  const handleSubmit = () => {
    if (nextVisit.durationType && nextVisit.durationValue) {
      // Include the searchQuery in the submitted nextVisit (so caller can show the same display)
      onSubmit({ nextVisit: { ...nextVisit, notes: searchQuery ? searchQuery : nextVisit.notes } })
      setNextVisit({
        id: String(Date.now()),
        durationType: "",
        durationValue: "",
        notes: "",
        showInReport: false,
        withPatient: false,
      })
      setSearchQuery("")
      onClose()
    }
  }

  const durationTypes = [
    { value: "সপ্তাহ", label: "সপ্তাহ" },
    { value: "দিন", label: "দিন" },
    { value: "মাস", label: "মাস" },
  ]

  const durationValues = Array.from({ length: 30 }, (_, i) => String(i + 1))

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-6xl" title="Next Visit">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="border-2 border-blue-500 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
              <select
                value={nextVisit.durationValue}
                onChange={(e) => setNextVisit({ ...nextVisit, durationValue: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
              >
                <option value="">সংখ্যা</option>
                {durationValues.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>

              <select
                value={nextVisit.durationType}
                onChange={(e) => setNextVisit({ ...nextVisit, durationType: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
              >
                <option value="">নিত</option>
                {durationTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>


              <span className="px-3 py-2 text-gray-700 font-medium">পর</span>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="CBC"
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={() =>
                  setNextVisit({
                    ...nextVisit,
                    showInReport: !nextVisit.showInReport,
                  })
                }
                className={`flex items-center gap-2 px-3 py-2 rounded font-medium ${nextVisit.showInReport ? "bg-green-600 text-white" : "bg-white border border-gray-300 text-gray-700"
                  }`}
              >
                {nextVisit.showInReport && <Check className="h-4 w-4" />}
                বিশেষ
              </button>

              <button
                onClick={() =>
                  setNextVisit({
                    ...nextVisit,
                    withPatient: !nextVisit.withPatient,
                  })
                }
                className={`flex items-center gap-2 px-3 py-2 rounded font-medium ${nextVisit.withPatient ? "bg-green-600 text-white" : "bg-white border border-gray-300 text-gray-700"
                  }`}
              >
                {nextVisit.withPatient && <Check className="h-4 w-4" />}
                সহ আসবেন
              </button>
            </div>
          </div>

          {nextVisit.durationType && nextVisit.durationValue && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">
                  {nextVisit.durationValue} {nextVisit.durationType} পর
                  {searchQuery && ` ${searchQuery}`}
                  {nextVisit.showInReport && " বিশেষ"}
                  {nextVisit.withPatient && " সহ আসবেন"}
                </span>
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:text-blue-800">✎</button>
                  <button className="text-red-600 hover:text-red-800">✕</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <Modal.Footer>
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            Add to Prescription
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  )
}
