import { Label } from "@/components/ui/label";
import { BaseModal } from "../BaseModal";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const InvestigationModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { investigation: string }) => void;
}) => {
  const [investigation, setInvestigation] = useState("");

  const handleSubmit = () => {
    if (investigation.trim()) {
      onSubmit({ investigation });
      setInvestigation("");
      onClose();
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Investigations">
      <div className="space-y-4">
        <div>
          <Label htmlFor="investigation">Investigation</Label>
          <Textarea
            id="investigation"
            value={investigation}
            onChange={(e) => setInvestigation(e.target.value)}
            placeholder="Enter investigation details"
            rows={3}
          />
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 cursor-pointer"
        >
          Add Investigation
        </Button>
      </div>
    </BaseModal>
  );
};
