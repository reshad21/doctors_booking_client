import BaseInput from "@/components/shared/BaseInput";
import BaseSelect from "@/components/shared/BaseSelect";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useUpdateMedicineMutation } from "@/redux/api/medicine/medicine";
import medicineValidation from "@/validation/medicine.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2 } from "lucide-react";
import { useState } from "react";
import {
  FormProvider,
  useForm,
  type FieldValues,
  type SubmitHandler,
} from "react-hook-form";
import toast from "react-hot-toast";

interface MedicineFormValues {
  nameManufacturer: string;
  brandName: string;
  genericName: string;
  strength: string;
  dosageDescription: string;
  price: number;
  useFor: string;
}

interface UpdateMedicineProps {
  defaultValues: MedicineFormValues;
  medicineId: string;
  trigger?: React.ReactNode;
}

const UpdateMedicine = ({ defaultValues, medicineId }: UpdateMedicineProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [updateMedicine, { isLoading }] = useUpdateMedicineMutation();
  const form = useForm({
    resolver: zodResolver(medicineValidation),
    defaultValues,
  });
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log(data);
    const response = await updateMedicine({ id: medicineId, data }).unwrap();
    if (response.statusCode === 200) {
      setIsOpen(false);
      toast.success(response.message);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Edit2 className="w-4 h-4 text-blue-500 cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Update Medicine</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <BaseInput
                  label="Manufacturer Name"
                  name="nameManufacturer"
                  placeholder="Enter Manufacturer Name"
                />
                <BaseInput
                  label="Brand Name"
                  name="brandName"
                  placeholder="Enter Brand Name"
                />
                <BaseInput
                  label="Generic Name"
                  name="genericName"
                  placeholder="Enter Generic Name"
                />
                <BaseInput
                  label="Strength"
                  name="strength"
                  placeholder="Enter Strength"
                />
                <BaseSelect
                  label="Dosage Description"
                  name="dosageDescription"
                  options={[
                    { name: "Tablet", value: "Tablet" },
                    { name: "Capsule", value: "Capsule" },
                    { name: "Syrup", value: "Syrup" },
                    { name: "Injection", value: "Injection" },
                    { name: "Ointment", value: "Ointment" },
                    { name: "Drops", value: "Drops" },
                    { name: "Inhaler", value: "Inhaler" },
                    { name: "Suppository", value: "Suppository" },
                    { name: "Powder", value: "Powder" },
                  ]}
                />
                <BaseInput
                  label="Price"
                  name="price"
                  placeholder="Enter Price"
                  type="number"
                />
                <BaseSelect
                  label="Use For"
                  name="useFor"
                  options={[
                    { name: "Human", value: "Human" },
                    { name: "Veterinary", value: "Veterinary" },
                  ]}
                />
              </div>
              <Button type="submit" className="bg-brand w-full mt-4">
                {isLoading ? "Updating..." : "Update Medicine"}
              </Button>
            </form>
          </Form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateMedicine;
