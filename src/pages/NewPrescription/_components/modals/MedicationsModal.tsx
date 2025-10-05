import type { Tag } from "@/types/new-prescription.types";
import { useState } from "react";
import { BaseModal } from "../BaseModal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const MedicationsModal = ({
  isOpen,
  onClose,
  onSubmit,
  tags = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }) => void;
  tags?: Tag[];
}) => {
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (formData.name.trim()) {
      onSubmit(formData);
      setFormData({ name: "", dosage: "", frequency: "", duration: "" });
      onClose();
    }
  };

  const handleTagSelect = (tag: Tag) => {
    handleChange("name", tag.label);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Medications"
      showSearch={true}
      tags={tags}
      onTagSelect={handleTagSelect}
      searchPlaceholder="Search medications..."
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Medication Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter medication name"
          />
        </div>

        <div>
          <Label htmlFor="dosage">Dosage</Label>
          <Input
            id="dosage"
            value={formData.dosage}
            onChange={(e) => handleChange("dosage", e.target.value)}
            placeholder="e.g., 500mg"
          />
        </div>

        <div>
          <Label htmlFor="frequency">Frequency</Label>
          <Input
            id="frequency"
            value={formData.frequency}
            onChange={(e) => handleChange("frequency", e.target.value)}
            placeholder="e.g., Twice daily"
          />
        </div>

        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => handleChange("duration", e.target.value)}
            placeholder="e.g., 7 days"
          />
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 cursor-pointer"
        >
          Add Medication
        </Button>
      </div>
    </BaseModal>
  );
};
