import { useState } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ObservationTab } from "./ObservationTab";
import { GroupsTab } from "./GroupTabs";

interface ExaminationItem {
  id: string;
  label: string;
  notes: string;
}

interface GeneralExamination {
  bloodPressure: string;
  diastolic: string;
  pulse: string;
  pulseType: "Regular" | "Irregular" | "Drop-Beat";
  temperature: string;
  temperatureType: "Normal" | "Abnormal";
  weight: string;
  height: {
    feet: string;
    inch: string;
  };
  showInPrescription: boolean;
}

export const ExaminationsModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { examinations: ExaminationItem[]; generalExam: GeneralExamination }) => void;
}) => {
  const [activeTab, setActiveTab] = useState<"observation" | "observation-groups" | "general" | "systemic">("observation");
  const [searchQuery, setSearchQuery] = useState("");
  const [showInPrescription, setShowInPrescription] = useState(true);
  const [examinations, setExaminations] = useState<ExaminationItem[]>([]);
  
  const [generalExam, setGeneralExam] = useState<GeneralExamination>({
    bloodPressure: "",
    diastolic: "",
    pulse: "",
    pulseType: "Regular",
    temperature: "",
    temperatureType: "Normal",
    weight: "",
    height: {
      feet: "",
      inch: ""
    },
    showInPrescription: true
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit({ examinations, generalExam });
    onClose();
  };

  const handleGeneralExamChange = (field: keyof GeneralExamination, value: string | boolean) => {
    setGeneralExam(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHeightChange = (field: "feet" | "inch", value: string) => {
    setGeneralExam(prev => ({
      ...prev,
      height: {
        ...prev.height,
        [field]: value
      }
    }));
  };

  const renderGeneralExamination = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div>
              <Label>Blood Pressure:</Label>
              <Input 
                value={generalExam.bloodPressure} 
                onChange={(e) => handleGeneralExamChange("bloodPressure", e.target.value)}
                placeholder="120"
              />
            </div>
            <div>
              <Label>Diastolic:</Label>
              <Input 
                value={generalExam.diastolic} 
                onChange={(e) => handleGeneralExamChange("diastolic", e.target.value)}
                placeholder="120"
              />
            </div>
            <span className="mt-8">= mm Hg</span>
            <div className="mt-8">
              <Checkbox
                checked={generalExam.showInPrescription}
                onCheckedChange={(checked) => handleGeneralExamChange("showInPrescription", checked)}
              />
              <Label className="ml-2">Show in Prescription</Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <Label>Weight:</Label>
            <div className="flex items-center gap-2">
              <Input 
                value={generalExam.weight} 
                onChange={(e) => handleGeneralExamChange("weight", e.target.value)}
                placeholder="120"
              />
              <span>Kg</span>
              <Checkbox
                checked={generalExam.showInPrescription}
                onCheckedChange={(checked) => handleGeneralExamChange("showInPrescription", checked)}
              />
              <Label className="ml-2">Show in Prescription</Label>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Pulse:</Label>
          <div className="flex items-center gap-2">
            <Input 
              value={generalExam.pulse} 
              onChange={(e) => handleGeneralExamChange("pulse", e.target.value)}
              placeholder="80"
            />
            <span>BPM</span>
            <div className="flex gap-2">
              {["Regular", "Irregular", "Drop-Beat"].map((type) => (
                <Button
                  key={type}
                  onClick={() => handleGeneralExamChange("pulseType", type)}
                  className={cn(
                    "px-4",
                    generalExam.pulseType === type ? "bg-green-600" : "bg-gray-200"
                  )}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Height:</Label>
          <div className="flex items-center gap-2">
            <Input 
              value={generalExam.height.feet} 
              onChange={(e) => handleHeightChange("feet", e.target.value)}
              placeholder="Feet"
            />
            <Input 
              value={generalExam.height.inch} 
              onChange={(e) => handleHeightChange("inch", e.target.value)}
              placeholder="Inch"
            />
            <span>Kg</span>
            <Checkbox
              checked={generalExam.showInPrescription}
              onCheckedChange={(checked) => handleGeneralExamChange("showInPrescription", checked)}
            />
            <Label className="ml-2">Show in Prescription</Label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Temperature:</Label>
          <div className="flex items-center gap-2">
            <Input 
              value={generalExam.temperature} 
              onChange={(e) => handleGeneralExamChange("temperature", e.target.value)}
              placeholder="80"
            />
            <span>°F</span>
            <Button
              onClick={() => handleGeneralExamChange("temperatureType", "Normal")}
              className={cn(
                "px-4",
                generalExam.temperatureType === "Normal" ? "bg-green-600" : "bg-gray-200"
              )}
            >
              Normal
            </Button>
          </div>
        </div>

        <div className="flex items-end gap-4">
          <Button onClick={() => console.log("Show BMI")}>Show BMI</Button>
          <Button onClick={() => console.log("Show BSA")}>Show BSA</Button>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidthClass="max-w-6xl"
      title="On Examinations"
      search={{
        value: searchQuery,
        onChange: setSearchQuery,
        placeholder: "Search examinations...",
      }}
      prescriptionToggle={{
        checked: showInPrescription,
        onChange: setShowInPrescription,
      }}
    >
      <div className="p-4 pb-4 space-y-4">
        {/* Tabs */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Observation", value: "observation" },
            { label: "Observation Groups", value: "observation-groups" },
            { label: "General Examination", value: "general" },
            { label: "Systemic Examination", value: "systemic" }
          ].map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.value as "observation" | "observation-groups" | "general" | "systemic")}
                className={cn(
                  "py-3 px-6 cursor-pointer rounded-lg font-medium transition-colors",
                  activeTab === tab.value
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {tab.label}
              </button>
            )
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-2">
        {activeTab === "observation" && (
          <ObservationTab
            searchQuery={searchQuery}
            observations={examinations}
            onToggleFilter={(label: string) => {
              const exists = examinations.some((e) => e.label === label);
              if (exists) {
                setExaminations(examinations.filter((e) => e.label !== label));
              } else {
                setExaminations([
                  ...examinations,
                  {
                    id: `${Date.now()}`,
                    label,
                    notes: "",
                  },
                ]);
              }
            }}
            onRemoveObservation={(id: string) => {
              setExaminations(examinations.filter((e) => e.id !== id));
            }}
            onUpdateObservation={(id: string, field: keyof ExaminationItem, value: string) => {
              setExaminations(
                examinations.map((e) => (e.id === id ? { ...e, [field]: value } : e))
              );
            }}
          />
        )}
        {activeTab === "observation-groups" && (
          <GroupsTab
            searchQuery={searchQuery}
            selectedObservations={examinations.map(e => e.label)}
            onLoadGroup={(observations: string[]) => {
              setActiveTab("observation");
              const newExaminations = observations.map((observation: string) => ({
                id: `${Date.now()}-${observation}`,
                label: observation,
                notes: "",
              }));
              setExaminations(newExaminations);
            }}
          />
        )}
        {activeTab === "general" && renderGeneralExamination()}
        {/* Systemic examination tab to be implemented */}
      </div>

      <Modal.Footer>
        <Button
          onClick={handleSubmit}
          className="bg-green-700 hover:bg-green-800 text-white px-8"
        >
          Save
        </Button>
        <Button
          onClick={onClose}
          className="bg-red-600 hover:bg-red-700 text-white px-8"
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
