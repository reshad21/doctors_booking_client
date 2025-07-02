import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import BaseInput from "./BaseInput";
import BaseSelect from "./BaseSelect";
import { SquarePen } from "lucide-react";

type FieldConfig = {
  label: string;
  name: string;
};

type SelectConfig = FieldConfig & {
  options: { name: string; val: string | number }[];
};

interface CustomModalProps {
  title: string;
  description: string;
  input?: FieldConfig[];
  select?: SelectConfig[];
  open: boolean;
  setOpen: (value: boolean) => void;
  handleFormSubmit: (
    data: Record<string, any>,
    helpers: { reset: () => void; close: () => void }
  ) => void | Promise<void>;
}

const CustomModal: React.FC<CustomModalProps> = ({
  title,
  description,
  input = [],
  select = [],
  open,
  setOpen,
  handleFormSubmit,
}) => {
  const formMethods = useForm<Record<string, any>>();

  const onSubmit = async (data: Record<string, any>) => {
    await handleFormSubmit(data, {
      reset: () => formMethods.reset(),
      close: () => setOpen(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="shadow-none !px-0 !py-0 no-padding no-border">
          <SquarePen className="!h-5 !w-5 text-[#14400D]" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-4">
            {input.map(({ label, name }) => (
              <BaseInput
                key={name}
                name={name}
                label={label}
                placeholder={`Enter your ${label}`}
                classname="bg-gray-50"
              />
            ))}
            {select.map(({ label, name, options }) => (
              <BaseSelect
                key={name}
                name={name}
                label={label}
                options={options.map(({ name, val }) => ({ name, value: val }))}
              />
            ))}
            <div className="flex justify-end space-x-4 pt-4">
              <AlertDialogCancel asChild>
                <Button variant="outline" type="button">
                  Close
                </Button>
              </AlertDialogCancel>
              <Button type="submit" className="bg-brand">
                Submit
              </Button>
            </div>
          </form>
        </FormProvider>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomModal;
