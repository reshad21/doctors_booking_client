/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SquareX } from "lucide-react";
import toast from "react-hot-toast";

const ConfirmAlert = ({ id, onDeleted, person }: any) => {
  const handelCancel = async () => {};
  const handelSubmit = async () => {
    const res = await onDeleted(id);
    if (res?.data?.success) {
      toast.success(res?.data?.message || `${person} deleted successfully`);
    }
    console.log(res);
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="shadow-none !px-0 !py-0 no-padding no-border !bg-none cursor-pointer">
          <SquareX className="!h-5 !w-5 text-[#F44336] " />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="cursor-pointer"
            onClick={() => handelCancel()}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-brand cursor-pointer"
            onClick={() => handelSubmit()}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default ConfirmAlert;
