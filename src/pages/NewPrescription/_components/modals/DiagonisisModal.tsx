import type { Tag } from "@/types/new-prescription.types";
import { BaseModal } from "../BaseModal";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const DiagnosisModal = ({
  isOpen,
  onClose,
  onSubmit,
  tags = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { diagnosis: string }) => void;
  tags?: Tag[];
}) => {
  const [diagnosis, setDiagnosis] = useState("");

  const handleSubmit = () => {
    if (diagnosis.trim()) {
      onSubmit({ diagnosis });
      setDiagnosis("");
      onClose();
    }
  };

  const handleTagSelect = (tag: Tag) => {
    setDiagnosis(tag.label);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Diagnosis"
      showSearch={true}
      tags={tags}
      onTagSelect={handleTagSelect}
      searchPlaceholder="Search diagnosis..."
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="diagnosis">Diagnosis</Label>
          <Textarea
            id="diagnosis"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Enter diagnosis"
            rows={3}
          />
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 cursor-pointer"
        >
          Add Diagnosis
        </Button>
      </div>
    </BaseModal>
  );
};
