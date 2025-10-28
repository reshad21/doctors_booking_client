import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteMedicineMutation } from "@/redux/api/medicine/medicine";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface DeleteMedicineProps {
  medicineId: string;
  trigger?: React.ReactNode;
  medicineName?: string;
}

const DeleteMedicine = ({ medicineId, medicineName }: DeleteMedicineProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteMedicine, { isLoading }] = useDeleteMedicineMutation();

  const handleDelete = async () => {
    const response = await deleteMedicine(medicineId).unwrap();
    if (response.statusCode === 200) {
      setIsOpen(false);
      toast.success(response.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Trash2 className="w-4 h-4 text-red-500 cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Delete Medicine</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>
            Are you sure you want to delete{" "}
            <b>{medicineName || "this medicine"}</b>?
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMedicine;
