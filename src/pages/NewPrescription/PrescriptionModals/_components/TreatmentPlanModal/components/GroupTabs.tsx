import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Plus, X } from "lucide-react";
import { useState } from "react";

interface TreatmentPlanGroup {
  id: string;
  name: string;
  treatmentPlans: string[];
}

interface GroupsTabProps {
  searchQuery: string;
  onLoadGroup: (treatmentPlanList: string[]) => void;
}

// Mock treatment plan list - replace with your actual treatment plan data or constants
const treatmentPlanOptions = [
  "Conservative management",
  "Symptomatic treatment",
  "Physiotherapy",
  "Lifestyle modifications",
  "Dietary changes",
  "Regular follow-up",
  "Surgical intervention",
  "Medication therapy",
  "Physical therapy",
  "Rest and observation",
];

export function GroupTabs({ searchQuery, onLoadGroup }: GroupsTabProps) {
  // All group-related state is now internal to this component
  const [groups, setGroups] = useState<TreatmentPlanGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  const filteredTreatmentPlans = treatmentPlanOptions.filter((tp) =>
    tp.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      const newGroup: TreatmentPlanGroup = {
        id: String(Date.now()),
        name: newGroupName,
        treatmentPlans: [],
      };
      setGroups([...groups, newGroup]);
      setSelectedGroupId(newGroup.id);
      setNewGroupName("");
      setIsCreatingGroup(false);
    }
  };

  const handleAddTreatmentPlanToGroup = (tp: string) => {
    if (selectedGroupId) {
      setGroups(
        groups.map((group) =>
          group.id === selectedGroupId
            ? { ...group, treatmentPlans: [...group.treatmentPlans, tp] }
            : group
        )
      );
    }
  };

  const handleRemoveTreatmentPlanFromGroup = (tp: string) => {
    if (selectedGroupId) {
      setGroups(
        groups.map((group) =>
          group.id === selectedGroupId
            ? {
                ...group,
                treatmentPlans: group.treatmentPlans.filter((t) => t !== tp),
              }
            : group
        )
      );
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroups(groups.filter((g) => g.id !== groupId));
    if (selectedGroupId === groupId) {
      setSelectedGroupId(null);
    }
  };

  const handleLoadGroupToTreatmentPlans = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    if (group) {
      onLoadGroup(group.treatmentPlans);
    }
  };

  const handleSaveGroup = () => {
    if (selectedGroupId && selectedGroup) {
      alert(`Group "${selectedGroup.name}" saved successfully!`);
    }
  };

  return (
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
            <label className="text-xs font-semibold text-gray-700 uppercase">
              New Group Name
            </label>
            <Input
              placeholder="Enter group name..."
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateGroup();
                if (e.key === "Escape") {
                  setIsCreatingGroup(false);
                  setNewGroupName("");
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
                  setIsCreatingGroup(false);
                  setNewGroupName("");
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
              <span className="text-sm font-medium truncate flex-1">
                {group.name}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadGroupToTreatmentPlans(group.id);
                  }}
                  className={`p-1 rounded transition-all ${
                    selectedGroupId === group.id
                      ? "text-white hover:bg-green-700"
                      : "text-green-600 hover:bg-green-100"
                  }`}
                  title="Use this group in Treatment Plan tab"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteGroup(group.id);
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
          {groups.length === 0 && (
            <p className="text-xs text-gray-500 text-center py-8">
              No groups yet
            </p>
          )}
        </div>
      </div>

      {/* Right side - Group editor */}
      <div className="flex-1 flex flex-col gap-3">
        {selectedGroup ? (
          <>
            <div className="flex items-center justify-between pb-2 border-b">
              <div>
                <h3 className="font-semibold text-gray-800">
                  "{selectedGroup.name}"
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {selectedGroup.treatmentPlans.length} treatment plan
                  {selectedGroup.treatmentPlans.length !== 1 ? "s" : ""} in this
                  group
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
              {/* Available Treatment Plans */}
              <div className="flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-gray-600 uppercase">
                    Available Treatment Plans
                  </h4>
                  <span className="text-xs text-gray-500">
                    {
                      filteredTreatmentPlans.filter(
                        (tp) => !selectedGroup.treatmentPlans.includes(tp)
                      ).length
                    }{" "}
                    available
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-3 bg-gray-50 rounded border space-y-1.5 min-h-0">
                  {filteredTreatmentPlans
                    .filter(
                      (tp) => !selectedGroup.treatmentPlans.includes(tp)
                    )
                    .map((tp) => (
                      <button
                        key={tp}
                        onClick={() => handleAddTreatmentPlanToGroup(tp)}
                        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-green-50 hover:border-green-600 hover:text-green-700 transition-colors text-left flex items-start gap-2 min-h-[44px]"
                      >
                        <Plus className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 leading-relaxed">
                          {tp}
                        </span>
                      </button>
                    ))}
                  {filteredTreatmentPlans.filter(
                    (tp) => !selectedGroup.treatmentPlans.includes(tp)
                  ).length === 0 && (
                    <p className="text-xs text-gray-500 text-center py-8">
                      {searchQuery
                        ? `No treatment plans found matching "${searchQuery}"`
                        : "All treatment plans added"}
                    </p>
                  )}
                </div>
              </div>

              {/* Selected Treatment Plans */}
              <div className="flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-gray-600 uppercase">
                    In Group
                  </h4>
                  <span className="text-xs text-green-700 font-medium">
                    {selectedGroup.treatmentPlans.length} selected
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-3 bg-green-50 rounded border border-green-200 space-y-1.5 min-h-0">
                  {selectedGroup.treatmentPlans.length > 0 ? (
                    selectedGroup.treatmentPlans.map((tp) => (
                      <div
                        key={tp}
                        className="flex items-start justify-between gap-2 px-3 py-2.5 text-sm bg-white border border-green-600 rounded text-green-800 min-h-[44px]"
                      >
                        <span className="flex-1 flex items-start gap-2">
                          <span className="text-green-600 shrink-0 mt-0.5">
                            ✓
                          </span>
                          <span className="line-clamp-2 leading-relaxed">
                            {tp}
                          </span>
                        </span>
                        <button
                          onClick={() => handleRemoveTreatmentPlanFromGroup(tp)}
                          className="text-red-500 hover:text-red-700 shrink-0 mt-0.5"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 text-center py-8">
                      Click treatment plans from the left to add them to this
                      group
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-500">
                Select a group to manage treatment plans
              </p>
              <p className="text-xs text-gray-400">
                or create a new group to get started
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
