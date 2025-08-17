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
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center items-start">
      <div className="grid lg:grid-cols-2 gap-10 w-full max-w-6xl">
        {/* Change Password Card */}
        <Card className="w-full bg-white shadow-lg border border-gray-200 rounded-2xl">
          <CardHeader className="pb-2 border-b border-gray-100">
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Change Password
            </CardTitle>
            <p className="text-sm text-gray-500">
              Update your password regularly to keep your account secure.
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Old Password */}
              <div className="space-y-1">
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
                    placeholder="Enter old password"
                    className="pr-10 bg-white border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-green-600"
                    {...register("oldPassword", { required: true })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showOldPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1">
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
                    placeholder="Enter new password"
                    className="pr-10 bg-white border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-green-600"
                    {...register("newPassword", { required: true })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
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
                    placeholder="Confirm new password"
                    className="pr-10 bg-white border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-green-600"
                    {...register("confirmPassword", { required: true })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-green-600 cursor-pointer hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-all duration-200"
                >
                  Update Password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Update Profile Component */}
        <UpdateProfile />
      </div>
    </div>
  );
};

export default UpdatePassword;
