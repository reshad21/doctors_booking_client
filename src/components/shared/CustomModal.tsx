/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
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
  triggerText: string;
  title: string;
  description: string;
  input?: FieldConfig[];
  select?: SelectConfig[];
  handleFormSubmit: (data: Record<string, any>) => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  title,
  description,
  input = [],
  select = [],
  handleFormSubmit,
}) => {
  const formMethods = useForm<Record<string, any>>();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="shadow-none !px-0 !py-0 no-padding  no-border ">
          <SquarePen className="!h-5 !w-5 text-[#14400D]" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <FormProvider {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            {/* Render Input Fields */}
            {input.map(({ label, name }) => (
              <BaseInput
                key={name}
                name={name}
                label={label}
                placeholder={`Enter your ${label}`}
                classname="bg-gray-50"
              />
            ))}
            {/* Render Select Fields */}
            {select.map(({ label, name, options }) => (
              <BaseSelect
                key={name}
                name={name}
                label={label}
                options={options.map(({ name, val }) => ({ name, value: val }))}
              />
            ))}
            <Button type="submit" className="w-full bg-brand">
              Submit
            </Button>
          </form>
        </FormProvider>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomModal;
