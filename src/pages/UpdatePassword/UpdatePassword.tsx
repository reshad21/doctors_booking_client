/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import {
  useUpdateAdminPassMutation,
  useUpdateStaffPassMutation,
} from "@/redux/api/auth/auth";
import { useAppSelector } from "@/redux/hooks";
import UpdateProfile from "./_components/UpdateProfile";

type FormData = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};
const UpdatePassword = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updateAdminPass] = useUpdateAdminPassMutation();
  const [updateStaffPass] = useUpdateStaffPassMutation();
  const user = useAppSelector((state) => state.admin);
  const { register, handleSubmit, reset } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (data.newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters");
    }
    if (data.newPassword !== data.confirmPassword) {
      return toast.error("Confirm password and new password should match");
    }
    const updateData = {
      oldPassword: data.oldPassword,
      password: data.newPassword,
      id: user?.id,
    };
    let res;
    if (user?.type == "DOCTOR") {
      res = (await updateAdminPass(updateData)) as any;
    }
    if (user?.type == "STAFF") {
      res = (await updateStaffPass(updateData)) as any;
    }
    if (res?.error?.data?.message) {
      toast.error(res.error.data.message);
    } else {
      toast.success(res?.data?.message || "Success!");
      reset();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-start justify-start p-4 ">
      <Card className="w-full bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Old Password */}
            <div className="space-y-2">
              <Label
                htmlFor="oldPassword"
                className="text-sm font-medium text-gray-700"
              >
                Old Password
              </Label>
              <div className="relative">
                <Input
                  id="oldPassword"
                  type={showOldPassword ? "text" : "password"}
                  placeholder="Old Password"
                  className="pr-10 bg-gray-50 border-gray-200 focus:bg-white"
                  {...register("oldPassword", { required: true })}
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showOldPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label
                htmlFor="newPassword"
                className="text-sm font-medium text-gray-700"
              >
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  className="pr-10 bg-gray-50 border-gray-200 focus:bg-white"
                  {...register("newPassword", { required: true })}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="pr-10 bg-gray-50 border-gray-200 focus:bg-white"
                  {...register("confirmPassword", { required: true })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white font-medium px-6 py-2 rounded"
            >
              Update
            </Button>
          </form>
        </CardContent>
      </Card>
      <UpdateProfile /> 
    </div>
  );
};

export default UpdatePassword;
