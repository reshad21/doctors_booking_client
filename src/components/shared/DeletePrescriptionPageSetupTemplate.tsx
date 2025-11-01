import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button";
import { useDeletePrescriptionPageSetupByIdMutation } from "@/redux/api/PreManagement/PrescriptionPageSetupApi";
import { Trash2 } from "lucide-react";

const DeletePrescriptionPageSetupTemplate = ({
  deleteId,
}: {
  deleteId: string;
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletePrescriptionPageSetup, { isLoading }] =
    useDeletePrescriptionPageSetupByIdMutation();

  const handleDelete = async () => {
    if (deleteId) {
      await deletePrescriptionPageSetup(deleteId);
      setConfirmOpen(false);
    }
  };
  return (
    <div>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogTrigger asChild>
          <Button className="bg-red-500 hover:bg-red-600 cursor-pointer text-white" size={"icon"}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm w-full">
          <DialogHeader>
            <DialogTitle>Delete Template?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to delete this template?
          </div>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDelete}>
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeletePrescriptionPageSetupTemplate;
