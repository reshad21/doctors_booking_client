/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import BaseInput from "./BaseInput";
import BaseSelect from "./BaseSelect";
import BaseImageUpload from "./BaseImageUpload";
import { Plus, SquarePen } from "lucide-react";
import { FormField } from "../ui/form";
import { ScrollArea } from "../ui/scroll-area";
import { Label } from "@radix-ui/react-label";

type FieldConfig = {
  label: string;
  name: string;
  type?: any;
  className?: string; // Optional custom class for input
};

type SelectConfig = FieldConfig & {
  options: { name: string; val: string | number }[];
};

interface CustomModalProps {
  title: string;
  description?: string;
  input?: FieldConfig[];
  file?: any[];
  select?: SelectConfig[];
  open: boolean;
  setOpen: (value: boolean) => void;
  buttonProperty: any;
  defaultValues?: Record<string, any>;
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
  file = [],
  open,
  setOpen,
  handleFormSubmit,
  buttonProperty,
  defaultValues = {},
}) => {
  const formMethods = useForm<Record<string, any>>({
    defaultValues,
  });

  // Optional: Sync defaultValues on prop change
  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      formMethods.reset(defaultValues);
    }
  }, [defaultValues, formMethods]);

  const onSubmit = async (data: Record<string, any>) => {
    await handleFormSubmit(data, {
      reset: () => formMethods.reset(),
      close: () => setOpen(false),
    });
  };

  // Chamber and Status select fields are now passed via the select prop from the parent, not hardcoded here.

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {buttonProperty.type === "create" ? (
          <Button className="bg-brand hover:bg-green-800 rounded cursor-pointer text-white">
            <Plus className="mr-2 h-4 w-4" />
            {buttonProperty?.text}
          </Button>
        ) : (
          <Button className="shadow-none !px-0 rounded !py-0 no-padding cursor-pointer no-border">
            <SquarePen className="!h-5 !w-5 text-[#14400D]" />
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent className="max-h-[90vh] overflow-hidden">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          <hr className="text-gray-300 mt-2" />
        </AlertDialogHeader>

        <ScrollArea className="max-h-[65vh] pr-4">
          <FormProvider {...formMethods}>
            {/* File Upload Field */}
            {file.map(({ name, label }) => (
              <div className="pb-2" key={name}>
                <Label>{label}</Label>
                <FormField
                  control={formMethods.control}
                  name={name}
                  render={({ field }) => (
                    <BaseImageUpload
                      classname="mt-2"
                      onFileChange={(file) => field.onChange(file)}
                    />
                  )}
                />
              </div>
            ))}

            {/* Form */}
            <form
              onSubmit={formMethods.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {input.map(({ label, name, type, className }) => (
                <BaseInput
                  key={name}
                  name={name}
                  label={label}
                  type={type}
                  placeholder={`${label}`}
                  classname={`bg-gray-50${className ? ` ${className}` : ""}`}
                />
              ))}

              {select.map(({ label, name, options }) => (
                <BaseSelect
                  key={name}
                  name={name}
                  label={label}
                  options={options.map(({ name, val }) => ({
                    name,
                    value: val,
                  }))}
                  className="border-[#A0B19E] rounded-[4px] border text-[#5F597480] w-full bg-gray-50"
                />
              ))}

              {/* Buttons */}
              <div className="flex justify-end space-x-4 pt-4 pb-2">
                <AlertDialogCancel asChild>
                  <Button
                    variant="outline"
                    type="button"
                    className="cursor-pointer"
                  >
                    Close
                  </Button>
                </AlertDialogCancel>
                <Button type="submit" className="bg-brand cursor-pointer">
                  Submit
                </Button>
              </div>
            </form>
          </FormProvider>
        </ScrollArea>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomModal;
