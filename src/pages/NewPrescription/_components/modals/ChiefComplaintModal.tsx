"use client"

import { useState } from "react"
import { X, Search, ChevronDown, Plus, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import type { Tag } from "@/types/new-prescription.types"

interface ComplaintItem {
  id: string
  label: string
  duration: string
  unit: string
  notes: string
}

interface ComplaintGroup {
  id: string
  name: string
  symptoms: string[]
}

export const ChiefComplaintModal = ({
  isOpen,
  onClose,
  onSubmit,
  tags = [],
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { complaints: ComplaintItem[] }) => void
  tags?: Tag[]
}) => {
  const [activeTab, setActiveTab] = useState<"complaint" | "groups">("complaint")
  const [searchQuery, setSearchQuery] = useState("")
  const [showInPrescription, setShowInPrescription] = useState(true)
  const [complaints, setComplaints] = useState<ComplaintItem[]>([])

  const [groups, setGroups] = useState<ComplaintGroup[]>([])
  const [newGroupName, setNewGroupName] = useState("")
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [isCreatingGroup, setIsCreatingGroup] = useState(false)

  const filterOptions = ["H/O Fever", "Fever", "Chest Pain (Central)", "Sennzing"]

  const availableSymptoms = [
    "H/O Fever",
    "Fever",
    "Chest Pain (Central)",
    "Sennzing",
    "Headache",
    "Cough",
    "Nausea",
    "Vomiting",
    "Dizziness",
    "Fatigue",
    "Abdominal Pain",
    "Back Pain",
    "Joint Pain",
    "Muscle Pain",
    "Sore Throat",
    "Runny Nose",
    "Shortness of Breath",
    "Wheezing",
    "Chest Tightness",
    "Palpitations",
    "Sweating",
    "Chills",
    "Loss of Appetite",
    "Weight Loss",
    "Weight Gain",
    "Insomnia",
    "Anxiety",
    "Depression",
    "Confusion",
    "Memory Loss",
    "Blurred Vision",
    "Eye Pain",
    "Ear Pain",
    "Hearing Loss",
    "Tinnitus",
    "Nosebleed",
    "Sneezing",
    "Skin Rash",
    "Itching",
    "Swelling",
    "Bruising",
    "Bleeding",
    "Constipation",
    "Diarrhea",
    "Bloating",
    "Gas",
    "Heartburn",
    "Difficulty Swallowing",
    "Frequent Urination",
    "Painful Urination",
    "Blood in Urine",
    "Incontinence",
  ]

  const sortedFilterOptions = filterOptions
    .filter((option) => complaints.some((c) => c.label === option))
    .concat(filterOptions.filter((option) => !complaints.some((c) => c.label === option)))

  const filteredComplaintOptions = sortedFilterOptions.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredSymptoms = availableSymptoms.filter((symptom) =>
    symptom.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const selectedGroup = groups.find((g) => g.id === selectedGroupId)

  if (!isOpen) return null

  const handleSubmit = () => {
    onSubmit({ complaints })
    onClose()
  }

  const handleSaveGroup = () => {
    if (selectedGroupId) {
      alert(`Group "${selectedGroup?.name}" saved successfully!`)
      setSelectedGroupId(null)
    }
  }

  const handleAddComplaint = (label: string) => {
    const exists = complaints.some((c) => c.label === label)
    if (!exists) {
      const newComplaint: ComplaintItem = {
        id: String(Date.now()),
        label,
        duration: "",
        unit: "Days",
        notes: "",
      }
      setComplaints([...complaints, newComplaint])
    }
  }

  const handleRemoveComplaint = (id: string) => {
    setComplaints(complaints.filter((c) => c.id !== id))
  }

  const handleUpdateComplaint = (id: string, field: keyof ComplaintItem, value: string) => {
    setComplaints(complaints.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  const toggleFilter = (filter: string) => {
    const existingComplaint = complaints.find((c) => c.label === filter)

    if (existingComplaint) {
      setComplaints(complaints.filter((c) => c.label !== filter))
    } else {
      handleAddComplaint(filter)
    }
  }

  const isFilterSelected = (filter: string) => {
    return complaints.some((c) => c.label === filter)
  }

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      const newGroup: ComplaintGroup = {
        id: String(Date.now()),
        name: newGroupName,
        symptoms: [],
      }
      setGroups([...groups, newGroup])
      setSelectedGroupId(newGroup.id)
      setNewGroupName("")
      setIsCreatingGroup(false)
    }
  }

  const handleAddSymptomToGroup = (symptom: string) => {
    if (selectedGroupId) {
      setGroups(
        groups.map((group) =>
          group.id === selectedGroupId ? { ...group, symptoms: [...group.symptoms, symptom] } : group,
        ),
      )
    }
  }

  const handleRemoveSymptomFromGroup = (symptom: string) => {
    if (selectedGroupId) {
      setGroups(
        groups.map((group) =>
          group.id === selectedGroupId ? { ...group, symptoms: group.symptoms.filter((s) => s !== symptom) } : group,
        ),
      )
    }
  }

  const handleDeleteGroup = (groupId: string) => {
    setGroups(groups.filter((g) => g.id !== groupId))
    if (selectedGroupId === groupId) {
      setSelectedGroupId(null)
    }
  }

  const handleLoadGroup = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId)
    if (group) {
      setActiveTab("complaint")
      const newComplaints: ComplaintItem[] = group.symptoms.map((symptom) => ({
        id: `${Date.now()}-${symptom}`,
        label: symptom,
        duration: "",
        unit: "Days",
        notes: "",
      }))
      setComplaints(newComplaints)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Add Chief Complaint (C/C)</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Search and Checkbox */}
        <div className="p-6 pb-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="show-prescription"
                checked={showInPrescription}
                onCheckedChange={(checked) => setShowInPrescription(checked as boolean)}
                className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
              <label htmlFor="show-prescription" className="text-sm font-medium text-gray-700 cursor-pointer">
                Show in Prescription
              </label>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab("complaint")}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                activeTab === "complaint" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Chief Complaint
            </button>
            <button
              onClick={() => setActiveTab("groups")}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                activeTab === "groups" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Chief Complaint Groups
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {activeTab === "complaint" && (
            <div className="flex gap-6 pb-6">
              {/* Left Side - Filter Tags */}
              <div className="w-1/2 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {filteredComplaintOptions.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => toggleFilter(filter)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                        isFilterSelected(filter)
                          ? "bg-green-50 border-green-600 text-green-700"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {isFilterSelected(filter) && <span className="text-green-600">✓</span>}
                      {filter}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {filteredComplaintOptions.map((filter) => (
                    <button
                      key={`${filter}-2`}
                      onClick={() => toggleFilter(filter)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                        isFilterSelected(filter)
                          ? "bg-green-50 border-green-600 text-green-700"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {isFilterSelected(filter) && <span className="text-green-600">✓</span>}
                      {filter}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  ))}
                </div>

                {filteredComplaintOptions.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No symptoms found matching "{searchQuery}"</p>
                )}
              </div>

              {/* Right Side - Complaints List */}
              <div className="w-1/2 space-y-3 overflow-x-hidden">
                {complaints.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-8">
                    Select symptoms from the left to add them here
                  </p>
                )}
                {complaints.map((complaint, index) => (
                  <div key={complaint.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                    {/* Header row with complaint name and delete button */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-800">
                        {index + 1}. {complaint.label}
                      </span>
                      <button
                        onClick={() => handleRemoveComplaint(complaint.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Input row with proper spacing */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-600">Duration</label>
                        <Input
                          placeholder="Enter duration..."
                          value={complaint.duration}
                          onChange={(e) => handleUpdateComplaint(complaint.id, "duration", e.target.value)}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-600">Unit</label>
                        <button className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white text-sm hover:bg-gray-50">
                          <span>{complaint.unit}</span>
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-600">Notes</label>
                        <Input
                          placeholder="Add notes..."
                          value={complaint.notes}
                          onChange={(e) => handleUpdateComplaint(complaint.id, "notes", e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "groups" && (
            <div className="flex gap-4 pb-6 h-[500px]">
              {/* Left sidebar - Groups list */}
              <div className="w-64 flex flex-col gap-3">
                {!isCreatingGroup ? (
                  <Button
                    onClick={() => setIsCreatingGroup(true)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white justify-start gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create New Group
                  </Button>
                ) : (
                  <div className="p-3 border-2 border-green-600 rounded-lg bg-green-50 space-y-2">
                    <label className="text-xs font-semibold text-gray-700 uppercase">New Group Name</label>
                    <Input
                      placeholder="Enter group name..."
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCreateGroup()
                        if (e.key === "Escape") {
                          setIsCreatingGroup(false)
                          setNewGroupName("")
                        }
                      }}
                      className="text-sm"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCreateGroup}
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        disabled={!newGroupName.trim()}
                      >
                        Create
                      </Button>
                      <Button
                        onClick={() => {
                          setIsCreatingGroup(false)
                          setNewGroupName("")
                        }}
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto space-y-1 border rounded-lg p-2 bg-gray-50">
                  {groups.map((group) => (
                    <div
                      key={group.id}
                      className={`group flex items-center justify-between gap-2 p-2 rounded cursor-pointer transition-colors ${
                        selectedGroupId === group.id
                          ? "bg-green-600 text-white"
                          : "bg-white hover:bg-gray-100 text-gray-800"
                      }`}
                      onClick={() => setSelectedGroupId(group.id)}
                    >
                      <span className="text-sm font-medium truncate flex-1">{group.name}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleLoadGroup(group.id)
                          }}
                          className={`p-1 rounded transition-all ${
                            selectedGroupId === group.id
                              ? "text-white hover:bg-green-700"
                              : "text-green-600 hover:bg-green-100"
                          }`}
                          title="Use this group in Chief Complaint tab"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteGroup(group.id)
                          }}
                          className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded ${
                            selectedGroupId === group.id
                              ? "text-white hover:bg-red-500"
                              : "text-red-500 hover:bg-red-100"
                          }`}
                          title="Delete group"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {groups.length === 0 && <p className="text-xs text-gray-500 text-center py-8">No groups yet</p>}
                </div>
              </div>

              {/* Right side - Group editor with side-by-side layout */}
              <div className="flex-1 flex flex-col gap-3">
                {selectedGroup ? (
                  <>
                    <div className="flex items-center justify-between pb-2 border-b">
                      <div>
                        <h3 className="font-semibold text-gray-800">"{selectedGroup.name}"</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {selectedGroup.symptoms.length} symptom{selectedGroup.symptoms.length !== 1 ? "s" : ""} in
                          this group
                        </p>
                      </div>
                      <Button
                        onClick={handleSaveGroup}
                        size="sm"
                        className="bg-green-700 hover:bg-green-800 text-white"
                      >
                        Save Group
                      </Button>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
                      {/* Left column - Available Symptoms */}
                      <div className="flex flex-col min-h-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-semibold text-gray-600 uppercase">Available Symptoms</h4>
                          <span className="text-xs text-gray-500">
                            {filteredSymptoms.filter((symptom) => !selectedGroup.symptoms.includes(symptom)).length}{" "}
                            available
                          </span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 bg-gray-50 rounded border space-y-1.5 min-h-0">
                          {filteredSymptoms
                            .filter((symptom) => !selectedGroup.symptoms.includes(symptom))
                            .map((symptom) => (
                              <button
                                key={symptom}
                                onClick={() => handleAddSymptomToGroup(symptom)}
                                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-green-50 hover:border-green-600 hover:text-green-700 transition-colors text-left flex items-start gap-2 min-h-[44px]"
                              >
                                <Plus className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                                <span className="line-clamp-2 leading-relaxed">{symptom}</span>
                              </button>
                            ))}
                          {filteredSymptoms.filter((symptom) => !selectedGroup.symptoms.includes(symptom)).length ===
                            0 && (
                            <p className="text-xs text-gray-500 text-center py-8">
                              {searchQuery ? `No symptoms found matching "${searchQuery}"` : "All symptoms added"}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right column - Selected Symptoms */}
                      <div className="flex flex-col min-h-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-semibold text-gray-600 uppercase">In Group</h4>
                          <span className="text-xs text-green-700 font-medium">
                            {selectedGroup.symptoms.length} selected
                          </span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 bg-green-50 rounded border border-green-200 space-y-1.5 min-h-0">
                          {selectedGroup.symptoms.length > 0 ? (
                            selectedGroup.symptoms.map((symptom) => (
                              <div
                                key={symptom}
                                className="flex items-start justify-between gap-2 px-3 py-2.5 text-sm bg-white border border-green-600 rounded text-green-800 min-h-[44px]"
                              >
                                <span className="flex-1 flex items-start gap-2">
                                  <span className="text-green-600 shrink-0 mt-0.5">✓</span>
                                  <span className="line-clamp-2 leading-relaxed">{symptom}</span>
                                </span>
                                <button
                                  onClick={() => handleRemoveSymptomFromGroup(symptom)}
                                  className="text-red-500 hover:text-red-700 shrink-0 mt-0.5"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-gray-500 text-center py-8">
                              Click symptoms from the left to add them to this group
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-2">
                      <p className="text-sm text-gray-500">Select a group to manage symptoms</p>
                      <p className="text-xs text-gray-400">or create a new group to get started</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {activeTab === "complaint" && (
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
            <Button onClick={handleSubmit} className="bg-green-700 hover:bg-green-800 text-white px-8">
              Save
            </Button>
            <Button onClick={onClose} className="bg-red-600 hover:bg-red-700 text-white px-8">
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
