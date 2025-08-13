/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, User } from "lucide-react";
import {
  useGetAdminByTokenQuery,
  useUpdateDoctorMutation,
} from "@/redux/api/admin/admin";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card className="w-full bg-white shadow-lg border border-gray-200 rounded-2xl">
      <CardHeader className="pb-2 border-b border-gray-100">
        <CardTitle className="text-2xl font-semibold text-gray-800">
          Update Profile
        </CardTitle>
        <p className="text-sm text-gray-500">
          Update your profile information and photo.
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Upload Image Section */}
          <div className="space-y-2">
            <Label
              htmlFor="image"
              className="text-sm font-medium text-gray-700"
            >
              Profile Photo
            </Label>
            <div className="relative">
              <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                {imagePreview ? (
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <label
                  htmlFor="image"
                  className="absolute inset-0 flex items-center justify-center bg-opacity-0 hover:bg-opacity-20 transition-all cursor-pointer group"
                >
                  <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
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
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              className="bg-white border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-green-600"
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
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700 cursor-pointer text-white font-semibold py-2 rounded-lg transition-all duration-200"
            >
              {isSubmitting ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
export default UpdateProfile;
