/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import {
  useGetAdminByTokenQuery,
  useUpdateDoctorMutation,
} from "@/redux/api/admin/admin";
import toast from "react-hot-toast";

interface FormData {
  name: string;
  image?: FileList;
}
const UpdateProfile = () => {
  const { data: adminDataFromApi } = useGetAdminByTokenQuery({});
  const [updateDoctor] = useUpdateDoctorMutation();
  const [imagePreview, setImagePreview] = useState<string>(
    adminDataFromApi?.data?.image
  );
  console.log(imagePreview);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: adminDataFromApi?.data?.name,
    },
  });
  useEffect(() => {
    reset({ name: adminDataFromApi?.data?.name });
  }, [reset, adminDataFromApi?.data?.name]);
  // Handle image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();

    formData.append("id", adminDataFromApi?.data?.id);
    formData.append("name", data.name || adminDataFromApi?.data?.name);

    if (data.image && data.image.length > 0) {
      formData.append("doctorImage", data.image[0]);
    }

    const res = (await updateDoctor(formData)) as any;

    if (res?.error?.data?.message) {
      toast.error(res.error.data.message);
    } else {
      toast.success(res?.data?.message || "Success!");
      reset();
    }
  };
  return (
    <div className="w-full mt-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Upload Image Section */}
        <div className="space-y-2">
          <Label htmlFor="image" className="text-sm font-medium text-gray-900">
            Upload Image
          </Label>
          <div className="relative">
            <div className="relative w-48 h-48 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Profile preview"
                className="object-cover"
              />
              <label
                htmlFor="image"
                className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </label>
            </div>
            <input
              id="image"
              type="file"
              accept="image/*"
              className="hidden"
              {...register("image", {
                onChange: handleImageChange,
              })}
            />
          </div>
        </div>

        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Name"
            className="w-full"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Update Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-md font-medium transition-colors"
        >
          {isSubmitting ? "Updating..." : "Update"}
        </Button>
      </form>
    </div>
  );
};
export default UpdateProfile;
