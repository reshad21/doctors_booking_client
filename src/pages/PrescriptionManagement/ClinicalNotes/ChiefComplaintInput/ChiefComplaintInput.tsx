import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAppSelector } from "@/redux/hooks";
import { useCurrentToken } from "@/redux/api/features/authSlice";
import { jwtDecode } from "jwt-decode";
import {
  useCreateChiefComponentInputMutation,
  useGetChiefComponentInputsQuery,
  useUpdateChiefComponentInputMutation,
  useDeleteChiefComponentInputMutation,
} from "@/redux/api/chiefComplaintInput/chiefComplaintInput";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Breadcrumb from "@/components/shared/BreadCrumb";
import { ClipboardList, RepeatIcon, Trash2, Edit2, Plus } from "lucide-react";

type Complaint = {
  id: string;
  value: string;
  doctorId: string;
};

interface ComplaintForm {
  value: string;
}

const ChiefComplaintInput = () => {
  const breadcrumbItems = [
    {
      label: "Pre Management",
      icon: <RepeatIcon className="h-4 w-4" />,
      to: "/dashboard/pre-management",
    },
    {
      label: "Clinical Notes",
      icon: <ClipboardList className="h-4 w-4" />,
      to: "/dashboard/pre-management/clinical-notes",
    },
    {
      label: "Chief Complaint Input",
      icon: <ClipboardList className="h-4 w-4" />,
    },
  ];
  const token = useAppSelector(useCurrentToken);
  const decoded: { id: string } = jwtDecode(token || "");
  const doctorId = decoded?.id;

  // API hooks
  const { data, refetch, isLoading } = useGetChiefComponentInputsQuery([
    { key: "doctorId", value: doctorId },
  ]);

  const [createComplaint] = useCreateChiefComponentInputMutation();
  const [updateComplaint] = useUpdateChiefComponentInputMutation();
  const [deleteComplaint] = useDeleteChiefComponentInputMutation();

  // Modal state
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Form
  const form = useForm<ComplaintForm>({
    defaultValues: { value: "" },
  });

  // Open modal for create
  const handleOpenCreate = () => {
    setEditId(null);
    form.reset({ value: "" });
    setOpen(true);
  };

  // Open modal for edit
  const handleOpenEdit = (complaint: Complaint) => {
    setEditId(complaint.id);
    form.reset({ value: complaint.value });
    setOpen(true);
  };

  // Open confirm modal for delete
  const handleOpenDelete = (id: string) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  // Handle create/edit submit
  const onSubmit = async (values: ComplaintForm) => {
    if (editId) {
      await updateComplaint({
        id: editId,
        value: values.value,
        doctorId,
      });
    } else {
      await createComplaint({ value: values.value, doctorId });
    }
    setOpen(false);
    refetch();
  };

  // Handle delete confirm
  const handleDelete = async () => {
    if (deleteId) {
      await deleteComplaint(deleteId);
      setDeleteId(null);
      setConfirmOpen(false);
      refetch();
    }
  };

  return (
    <div className="custom-container !pt-6">
      <Breadcrumb items={breadcrumbItems} />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Chief Complaints
          </h2>
          <p className="text-gray-500 text-sm">
            Manage and organize all chief complaints for your clinical notes.
            Add, edit, or remove as needed.
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all px-6 py-2 rounded-xl font-semibold"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Chief Complaint
        </Button>
      </div>

      <Card className="p-6 rounded-2xl shadow-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100">
        <div className="flex flex-wrap gap-3 min-h-[56px]">
          {isLoading ? (
            <span>Loading...</span>
          ) : data?.data?.data?.length ? (
            data.data.data.map((item: Complaint) => (
              <div key={item.id} className="relative group">
                <Badge className="px-4 py-2 text-base rounded-lg cursor-pointer bg-primary/10 border border-primary/20 text-primary flex items-center gap-2 min-w-[120px] justify-between transition-all group-hover:shadow-lg group-hover:bg-primary/20">
                  <span className="truncate max-w-[100px]">{item.value}</span>
                  <span className="opacity-0 group-hover:opacity-100 flex gap-1 ml-2 transition-opacity">
                    <Edit2
                      className="w-4 h-4 cursor-pointer hover:text-blue-600"
                      onClick={() => handleOpenEdit(item)}
                    />
                    <Trash2
                      className="w-4 h-4 cursor-pointer hover:text-red-600"
                      onClick={() => handleOpenDelete(item.id)}
                    />
                  </span>
                </Badge>
              </div>
            ))
          ) : (
            <span className="text-gray-400">No chief complaints found.</span>
          )}
        </div>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>
              {editId ? "Edit Chief Complaint" : "Add Chief Complaint"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              autoComplete="off"
            >
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chief Complaint</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter chief complaint"
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  variant="default"
                  className="bg-green-600"
                >
                  {editId ? "Update" : "Create"}
                </Button>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="default"
                    className="bg-red-600"
                  >
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Modal */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm w-full">
          <DialogHeader>
            <DialogTitle>Delete Chief Complaint?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to delete this chief complaint?
          </div>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
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

export default ChiefComplaintInput;
