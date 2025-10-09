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
import { useCreateMedicineMutation } from "@/redux/api/medicine/medicine";
import medicineValidation from "@/validation/medicine.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  FormProvider,
  useForm,
  type FieldValues,
  type SubmitHandler,
} from "react-hook-form";
import toast from "react-hot-toast";

const CreateMedicine = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [createMedicine, { isLoading }] = useCreateMedicineMutation();
  const form = useForm({
    resolver: zodResolver(medicineValidation),
    defaultValues: {
      nameManufacturer: "",
      brandName: "",
      genericName: "",
      strength: "",
      dosageDescription: "",
      price: 0,
      useFor: "",
    },
  });
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const response = await createMedicine(data).unwrap();

    if (response.statusCode === 201) {
      form.reset();
      setIsOpen(false);
      toast.success(response.message);
    }

    console.log(data);
  };
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <Button className="bg-brand">Add Medicine</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Medicine</DialogTitle>
          </DialogHeader>
          <div>
            <FormProvider {...form}>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
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
                    {isLoading ? "Adding..." : "Add Medicine"}
                  </Button>
                </form>
              </Form>
            </FormProvider>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateMedicine;
