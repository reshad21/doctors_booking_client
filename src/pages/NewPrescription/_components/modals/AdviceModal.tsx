import type { Tag } from "@/types/new-prescription.types";
import { useState } from "react";
import { BaseModal } from "../BaseModal";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const AdviceModal = ({
  isOpen,
  onClose,
  onSubmit,
  tags = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { advice: string }) => void;
  tags?: Tag[];
}) => {
  const [advice, setAdvice] = useState("");

  const handleSubmit = () => {
    if (advice.trim()) {
      onSubmit({ advice });
      setAdvice("");
      onClose();
    }
  };

  const handleTagSelect = (tag: Tag) => {
    setAdvice(tag.label);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Advice"
      showSearch={true}
      tags={tags}
      onTagSelect={handleTagSelect}
      searchPlaceholder="Search advice..."
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="advice">Medical Advice</Label>
          <Textarea
            id="advice"
            value={advice}
            onChange={(e) => setAdvice(e.target.value)}
            placeholder="Enter medical advice"
            rows={3}
          />
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 cursor-pointer"
        >
          Add Advice
        </Button>
      </div>
    </BaseModal>
  );
};
