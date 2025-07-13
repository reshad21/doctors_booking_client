"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField } from "@/components/ui/form";
import BaseInput from "@/components/shared/BaseInput";
import BaseImageUpload from "@/components/shared/BaseImageUpload";
import BaseSelect from "@/components/shared/BaseSelect";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  status: z.enum(["active", "inactive"]),
  image: z.any().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

const DemoShadcnForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      status: "active",
      image: null,
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form Data:", data);
    if (data.image) {
      console.log("Image File:", data.image);
    } else {
      console.log("No image file selected");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4 max-w-md mx-auto mt-8">
          <BaseInput name="name" title="Name" placeholder="Enter your name" label="Name" />
          <BaseInput name="email" title="Email" placeholder="Enter your email" type="email" label="Email" />
          <BaseSelect
            name="status"
            options={[
              { name: "Active", value: "active" },
              { name: "Inactive", value: "inactive" },
            ]}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <BaseImageUpload
                classname="mt-2"
                onFileChange={file => field.onChange(file)}
              />
            )}
          /> 
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </Form>
  );
};

export default DemoShadcnForm;