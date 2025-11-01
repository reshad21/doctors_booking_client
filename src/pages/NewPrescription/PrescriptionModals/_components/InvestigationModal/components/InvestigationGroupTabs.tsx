import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { useState, useEffect } from "react"

interface InvestigationGroup {
  id: string
  name: string
  investigationList: string[]
}

interface GroupsTabProps {
  searchQuery: string
  onLoadGroup: (investigationList: string[]) => void
}

const investigationOptions = [
  "CBC",
  "Blood Sugar",
  "X-Ray Chest",
  "ECG",
  "Urine R/M",
  "Liver Function Test",
  "Kidney Function Test",
  "Lipid Profile",
  "Thyroid Profile",
  "Ultrasound Abdomen"
]

export function InvestigationGroupTabs({ searchQuery, onLoadGroup }: GroupsTabProps) {
  const [groups, setGroups] = useState<InvestigationGroup[]>(() => {
    try {
      const raw = localStorage.getItem("investigation_groups")
      return raw ? (JSON.parse(raw) as InvestigationGroup[]) : []
    } catch {
      return []
    }
  })
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [isCreatingGroup, setIsCreatingGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")

  const selectedGroup = groups.find((g) => g.id === selectedGroupId)

  const filteredInvestigation = investigationOptions.filter((investigation) =>
    investigation.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      const newGroup: InvestigationGroup = {
        id: String(Date.now()),
        name: newGroupName,
        investigationList: [],
      }
      setGroups([...groups, newGroup])
      setSelectedGroupId(newGroup.id)
      setNewGroupName("")
      setIsCreatingGroup(false)
    }
  }

  useEffect(() => {
    try {
      localStorage.setItem("investigation_groups", JSON.stringify(groups))
    } catch {
      // ignore
    }
  }, [groups])

  const handleAddInvestigationToGroup = (investigation: string) => {
    if (selectedGroupId) {
      setGroups(
        groups.map((group) =>
          group.id === selectedGroupId
            ? { ...group, investigationList: [...group.investigationList, investigation] }
            : group
        )
      )
    }
  }

  const handleRemoveInvestigationFromGroup = (investigation: string) => {
    if (selectedGroupId) {
      setGroups(
        groups.map((group) =>
          group.id === selectedGroupId
            ? {
                ...group,
                investigationList: group.investigationList.filter((a) => a !== investigation),
              }
            : group
        )
      )
    }
  }

  const handleDeleteGroup = (groupId: string) => {
    setGroups(groups.filter((g) => g.id !== groupId))
    if (selectedGroupId === groupId) {
      setSelectedGroupId(null)
    }
  }

  const handleLoadGroupToInvestigations = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId)
    if (group) {
      onLoadGroup(group.investigationList)
    }
  }

  const handleSaveGroup = () => {
    const group = groups.find((g) => g.id === selectedGroupId)
    if (group) {
      try {
        localStorage.setItem("investigation_groups", JSON.stringify(groups))
      } catch {
        // ignore
      }
      alert(`Group "${group.name}" saved successfully!`)
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 pb-6 h-[500px] max-h-[70vh]">
      {/* Left sidebar - Groups list */}
      <div className="w-full md:w-64 flex flex-col gap-3 min-h-0">
        {!isCreatingGroup ? (
          <Button
            onClick={() => setIsCreatingGroup(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white justify-start gap-2"
          >
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

        <div className="flex-1 overflow-y-auto space-y-1 border rounded-lg p-2 bg-gray-50 ">
          {groups.map((group) => (
            <div
              key={group.id}
              className={`group flex items-center justify-between gap-2 p-2 rounded cursor-pointer transition-colors ${
                selectedGroupId === group.id ? "bg-green-600 text-white" : "bg-white hover:bg-gray-100 text-gray-800"
              }`}
              onClick={() => setSelectedGroupId(group.id)}
            >
              <span className="text-sm font-medium truncate flex-1">{group.name}</span>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleLoadGroupToInvestigations(group.id)
                  }}
                  className={`p-1 rounded transition-all ${
                    selectedGroupId === group.id ? "text-white hover:bg-green-700" : "text-green-600 hover:bg-green-100"
                  }`}
                  title="Use this group in Investigation tab"
                >
                  Load
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteGroup(group.id)
                  }}
                  className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded ${
                    selectedGroupId === group.id ? "text-white hover:bg-red-500" : "text-red-500 hover:bg-red-100"
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

      {/* Right side - Group editing */}
      {selectedGroup && (
        <div className="flex-1 space-y-4 min-h-0 flex flex-col">
          <div className="flex items-center justify-between flex-shrink-0">
            <h3 className="font-medium text-sm text-gray-700">
              Editing Group: <span className="text-green-600">{selectedGroup.name}</span>
            </h3>
            <Button onClick={handleSaveGroup} size="sm" className="bg-green-700 hover:bg-green-800 text-white">
              Save Group
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 flex-1 min-h-0">
            {/* Available investigations */}
            <div className="w-full md:w-1/2 space-y-2 flex flex-col min-h-0">
              <h4 className="text-xs font-semibold text-gray-600 uppercase flex-shrink-0">Available Investigations</h4>
              <div className="space-y-1 border rounded-lg p-2 bg-gray-50 overflow-y-auto flex-1 min-h-0">
                {filteredInvestigation.map((investigation) => (
                  <button
                    key={investigation}
                    onClick={() => handleAddInvestigationToGroup(investigation)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      selectedGroup.investigationList.includes(investigation)
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "hover:bg-white"
                    }`}
                    disabled={selectedGroup.investigationList.includes(investigation)}
                  >
                    {investigation}
                  </button>
                ))}
              </div>
            </div>

            {/* Group investigations */}
            <div className="w-full md:w-1/2 space-y-2 flex flex-col min-h-0">
              <h4 className="text-xs font-semibold text-gray-600 uppercase flex-shrink-0">Group Investigations</h4>
              <div className="space-y-1 border rounded-lg p-2 bg-gray-50 overflow-y-auto flex-1 min-h-0">
                {selectedGroup.investigationList.map((investigation, index) => (
                  <div key={investigation} className="flex items-center justify-between p-2 bg-white rounded-md">
                    <span className="text-sm">
                      {index + 1}. {investigation}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveInvestigationFromGroup(investigation)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {selectedGroup.investigationList.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No investigation added to this group</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
