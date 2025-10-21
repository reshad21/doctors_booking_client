import { useState } from "react";
import { BaseModal } from "../BaseModal";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const HistoryModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { history: string }) => void;
}) => {
  const [history, setHistory] = useState("");

  const handleSubmit = () => {
    if (history.trim()) {
      onSubmit({ history });
      setHistory("");
      onClose();
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="History">
      <div className="space-y-4">
        <div>
          <Label htmlFor="history">Medical History</Label>
          <Textarea
            id="history"
            value={history}
            onChange={(e) => setHistory(e.target.value)}
            placeholder="Enter medical history"
            rows={3}
          />
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 cursor-pointer"
        >
          Add History
        </Button>
      </div>
    </BaseModal>
  );
};
