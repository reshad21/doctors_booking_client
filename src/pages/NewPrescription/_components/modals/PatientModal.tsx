// PrescriptionModals.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BaseModal } from "../BaseModal";

export interface PatientData {
  name: string;
  age: string;
  date: string;
}

// ✅ Define props for PatientModal
export interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PatientData) => void;
  initialData?: Partial<PatientData>;
}

// Patient Information Modal
export const PatientModal: React.FC<PatientModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = { name: "", age: "", date: "" },
}) => {
  const [formData, setFormData] = useState<PatientData>({
    name: initialData.name || "",
    age: initialData.age || "",
    date: initialData.date || new Date().toISOString().split("T")[0],
  });

  const handleChange = (field: keyof PatientData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Patient Information">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Patient Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter patient name"
          />
        </div>

        <div>
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            value={formData.age}
            onChange={(e) => handleChange("age", e.target.value)}
            placeholder="Enter age"
          />
        </div>

        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 cursor-pointer"
        >
          Save Patient Information
        </Button>
      </div>
    </BaseModal>
  );
};
