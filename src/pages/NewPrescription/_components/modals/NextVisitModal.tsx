import { useState } from "react";
import { BaseModal } from "../BaseModal";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const NextVisitModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { nextVisit: string }) => void;
}) => {
  const [nextVisit, setNextVisit] = useState("");

  const handleSubmit = () => {
    if (nextVisit.trim()) {
      onSubmit({ nextVisit });
      setNextVisit("");
      onClose();
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Next Visit">
      <div className="space-y-4">
        <div>
          <Label htmlFor="nextVisit">Next Visit Details</Label>
          <Textarea
            id="nextVisit"
            value={nextVisit}
            onChange={(e) => setNextVisit(e.target.value)}
            placeholder="Enter next visit details"
            rows={2}
          />
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 cursor-pointer"
        >
          Set Next Visit
        </Button>
      </div>
    </BaseModal>
  );
};
