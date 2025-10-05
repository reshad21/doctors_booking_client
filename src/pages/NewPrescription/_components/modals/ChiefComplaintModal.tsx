import { useState } from "react";
import { BaseModal, type Tag } from "../BaseModal";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const ChiefComplaintModal = ({
  isOpen,
  onClose,
  onSubmit,
  tags = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { complaint: string }) => void;
  tags?: Tag[];
}) => {
  const [complaint, setComplaint] = useState("");

  const handleSubmit = () => {
    if (complaint.trim()) {
      onSubmit({ complaint });
      setComplaint("");
      onClose();
    }
  };

  const handleTagSelect = (tag: Tag) => {
    setComplaint(tag.label);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Chief Complaint"
      showSearch={true}
      tags={tags}
      onTagSelect={handleTagSelect}
      searchPlaceholder="Search complaints..."
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="complaint">Complaint</Label>
          <Textarea
            id="complaint"
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            placeholder="Enter chief complaint"
            rows={3}
          />
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 cursor-pointer"
        >
          Add Complaint
        </Button>
      </div>
    </BaseModal>
  );
};
