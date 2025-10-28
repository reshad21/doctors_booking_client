import { useState } from "react"
import { Button } from "@/components/ui/button"
import Modal from "@/components/shared/Modal"
import { AdviceTabs } from "./components/AdviceTabs"
import { GroupTabs } from "./components/GroupTabs"


export interface AdviceItem {
  id: string
  label: string
  notes: string
}

export const AdviceModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { advices: AdviceItem[] } | { advices: string[] }) => void
  tags?: Array<{ id: string; label: string; category?: string }>
}) => {
  const [activeTab, setActiveTab] = useState<"advice" | "groups">("advice")
  const [searchQuery, setSearchQuery] = useState("")
  const [showInPrescription, setShowInPrescription] = useState(true)
  const [advices, setAdvices] = useState<AdviceItem[]>([])

  if (!isOpen) return null

  const handleSubmit = () => {
    onSubmit({ advices })
    onClose()
  }

  const handleAddAdvice = (label: string) => {
    console.log(advices, "advices")
    const exists = advices.some((a) => a.label === label)
    if (!exists) {
      setAdvices([
        ...advices,
        {
          id: String(Date.now()),
          label,
          notes: "",
        },
      ])
    }
  }

  const handleRemoveAdvice = (id: string) => {
    setAdvices(advices.filter((a) => a.id !== id))
  }

  const handleUpdateAdvice = (id: string, field: keyof AdviceItem, value: string) => {
    setAdvices(advices.map((a) => (a.id === id ? { ...a, [field]: value } : a)))
  }

  const handleLoadGroupToAdvices = (items: string[]) => {
    setActiveTab("advice")
    const newAdvices: AdviceItem[] = items.map((item) => ({
      id: `${Date.now()}-${item}`,
      label: item,
      notes: "",
    }))
    setAdvices(newAdvices)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidthClass="max-w-6xl"
      title="Add Advice"
      search={{
        value: searchQuery,
        onChange: setSearchQuery,
        placeholder: "Search advice...",
      }}
      prescriptionToggle={{
        checked: showInPrescription,
        onChange: setShowInPrescription,
      }}
    >
      <div className="flex flex-col h-full max-h-[calc(90vh-120px)]">
        <div className="flex gap-3 p-4 pb-0 flex-shrink-0">
          <Button
            className={`flex-1 py-3 px-6 cursor-pointer rounded-lg font-medium transition-colors ${
              activeTab === "advice" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("advice")}
          >
            Advice
          </Button>
          <Button
            className={`flex-1 py-3 px-6 cursor-pointer rounded-lg font-medium transition-colors ${
              activeTab === "groups" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("groups")}
          >
            Groups
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-2 min-h-0">
          {activeTab === "advice" && (
            <AdviceTabs
              searchQuery={searchQuery}
              advices={advices}
              onToggleFilter={handleAddAdvice}
              onRemoveAdvice={handleRemoveAdvice}
              onUpdateAdvice={handleUpdateAdvice}
            />
          )}

          {activeTab === "groups" && <GroupTabs searchQuery={searchQuery} onLoadGroup={handleLoadGroupToAdvices} />}
        </div>

        {activeTab === "advice" && (
          <Modal.Footer>
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              Add to Prescription
            </Button>
          </Modal.Footer>
        )}
      </div>
    </Modal>
  )
}