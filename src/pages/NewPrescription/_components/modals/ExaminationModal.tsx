import type { Tag } from "@/types/new-prescription.types";
import { useState } from "react";
import { BaseModal } from "../BaseModal";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const ExaminationsModal = ({
  isOpen,
  onClose,
  onSubmit,
  tags = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { examination: string }) => void;
  tags?: Tag[];
}) => {
  const [examination, setExamination] = useState("");

  const handleSubmit = () => {
    if (examination.trim()) {
      onSubmit({ examination });
      setExamination("");
      onClose();
    }
  };

  const handleTagSelect = (tag: Tag) => {
    setExamination(tag.label);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Examinations"
      showSearch={true}
      tags={tags}
      onTagSelect={handleTagSelect}
      searchPlaceholder="Search examinations..."
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="examination">Examination Finding</Label>
          <Textarea
            id="examination"
            value={examination}
            onChange={(e) => setExamination(e.target.value)}
            placeholder="Enter examination findings"
            rows={3}
          />
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 cursor-pointer"
        >
          Add Examination
        </Button>
      </div>
    </BaseModal>
  );
};
