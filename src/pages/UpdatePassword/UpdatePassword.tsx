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
    // <div className="min-h-screen bg-gray-50 flex flex-col items-start justify-start p-4 ">
     
    //   <div className=" grid lg:grid-cols-2  gap-6"> 
    //   <Card className="w-full bg-white">
    //     <CardHeader>
    //       <CardTitle className="text-xl font-semibold text-gray-900">
    //         Change Password
    //       </CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
    //         {/* Old Password */}
    //         <div className="space-y-2">
    //           <Label
    //             htmlFor="oldPassword"
    //             className="text-sm font-medium text-gray-700"
    //           >
    //             Old Password
    //           </Label>
    //           <div className="relative">
    //             <Input
    //               id="oldPassword"
    //               type={showOldPassword ? "text" : "password"}
    //               placeholder="Old Password"
    //               className="pr-10 bg-gray-50 border-gray-200 focus:bg-white"
    //               {...register("oldPassword", { required: true })}
    //             />
    //             <button
    //               type="button"
    //               onClick={() => setShowOldPassword(!showOldPassword)}
    //               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
    //             >
    //               {showOldPassword ? (
    //                 <EyeOff className="w-4 h-4" />
    //               ) : (
    //                 <Eye className="w-4 h-4" />
    //               )}
    //             </button>
    //           </div>
    //         </div>

    //         {/* New Password */}
    //         <div className="space-y-2">
    //           <Label
    //             htmlFor="newPassword"
    //             className="text-sm font-medium text-gray-700"
    //           >
    //             New Password
    //           </Label>
    //           <div className="relative">
    //             <Input
    //               id="newPassword"
    //               type={showNewPassword ? "text" : "password"}
    //               placeholder="New Password"
    //               className="pr-10 bg-gray-50 border-gray-200 focus:bg-white"
    //               {...register("newPassword", { required: true })}
    //             />
    //             <button
    //               type="button"
    //               onClick={() => setShowNewPassword(!showNewPassword)}
    //               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
    //             >
    //               {showNewPassword ? (
    //                 <EyeOff className="w-4 h-4" />
    //               ) : (
    //                 <Eye className="w-4 h-4" />
    //               )}
    //             </button>
    //           </div>
    //         </div>

    //         {/* Confirm Password */}
    //         <div className="space-y-2">
    //           <Label
    //             htmlFor="confirmPassword"
    //             className="text-sm font-medium text-gray-700"
    //           >
    //             Confirm New Password
    //           </Label>
    //           <div className="relative">
    //             <Input
    //               id="confirmPassword"
    //               type={showConfirmPassword ? "text" : "password"}
    //               placeholder="Confirm Password"
    //               className="pr-10 bg-gray-50 border-gray-200 focus:bg-white"
    //               {...register("confirmPassword", { required: true })}
    //             />
    //             <button
    //               type="button"
    //               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    //               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
    //             >
    //               {showConfirmPassword ? (
    //                 <EyeOff className="w-4 h-4" />
    //               ) : (
    //                 <Eye className="w-4 h-4" />
    //               )}
    //             </button>
    //           </div>
    //         </div>

    //         <Button
    //           type="submit"
    //           className="bg-green-700 hover:bg-green-800 text-white font-medium px-6 py-2 rounded"
    //         >
    //           Update
    //         </Button>
    //       </form>
    //     </CardContent>
    //   </Card>
    //   <UpdateProfile />
    // </div>
    // </div>

    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center items-start">
  <div className="grid lg:grid-cols-2 gap-10 w-full max-w-6xl">
    {/* Change Password Card */}
    <Card className="w-full bg-white shadow-lg border border-gray-200 rounded-2xl">
      <CardHeader className="pb-2 border-b border-gray-100">
        <CardTitle className="text-2xl font-semibold text-gray-800">
          Change Password
        </CardTitle>
        <p className="text-sm text-gray-500">Update your password regularly to keep your account secure.</p>
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Old Password */}
          <div className="space-y-1">
            <Label htmlFor="oldPassword" className="text-sm font-medium text-gray-700">
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
                {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1">
            <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
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
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
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
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-all duration-200"
            >
              Update Password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>

    {/* Update Profile Component */}
    <div className="">
      <UpdateProfile />
    </div>
  </div>
</div>

  );
};

export default UpdatePassword;


// import type React from "react";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Separator } from "@/components/ui/separator";
// import { Eye, EyeOff, Upload, User, Lock, Camera } from "lucide-react";
// import toast from "react-hot-toast";

// type PasswordFormData = {
//   oldPassword: string;
//   newPassword: string;
//   confirmPassword: string;
// };

// type ProfileFormData = {
//   name: string;
// };

// export default function ProfileSettings() {
//   const [showOldPassword, setShowOldPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [profileImage, setProfileImage] = useState(
//     "/placeholder.svg?height=120&width=120"
//   );
//   const [isUploading, setIsUploading] = useState(false);

//   const passwordForm = useForm<PasswordFormData>();
//   const profileForm = useForm<ProfileFormData>({
//     defaultValues: {
//       name: "System Admin",
//     },
//   });

//   const onPasswordSubmit = async (data: PasswordFormData) => {
//     if (data.newPassword.length < 6) {
//       return toast.error("New password must be at least 6 characters");
//     }
//     if (data.newPassword !== data.confirmPassword) {
//       return toast.error("Confirm password and new password should match");
//     }

//     // Simulate API call
//     try {
//       // Your API logic here
//       toast.success("Password updated successfully!");
//       passwordForm.reset();
//     } catch (error) {
//       toast.error("Failed to update password");
//     }
//   };

//   const onProfileSubmit = async (data: ProfileFormData) => {
//     try {
//       // Your API logic here
//       toast.success("Profile updated successfully!");
//     } catch (error) {
//       toast.error("Failed to update profile");
//     }
//   };

//   const handleImageUpload = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     if (file.size > 5 * 1024 * 1024) {
//       toast.error("Image size should be less than 5MB");
//       return;
//     }

//     setIsUploading(true);
//     try {
//       // Simulate upload
//       const imageUrl = URL.createObjectURL(file);
//       setProfileImage(imageUrl);
//       toast.success("Profile image updated successfully!");
//     } catch (error) {
//       toast.error("Failed to upload image");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <div className="custom-container">
//       <div className=" bg-gradient-to-br from-slate-50 to-slate-100">
//         {/* Header */}
//         <div className=" grid lg:grid-cols-2  gap-6">
//           {/* Profile Image & Basic Info */}
//           <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
//             <CardHeader className="pb-4">
//               <CardTitle className="flex items-center gap-2 text-slate-800">
//                 <Camera className="w-5 h-5 text-emerald-600" />
//                 Profile Photo & Information
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {/* Profile Image Upload */}
//               <div className="flex flex-col sm:flex-row items-center gap-6">
//                 <div className="relative group">
//                   <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
//                     <AvatarImage
//                       src={profileImage || "/placeholder.svg"}
//                       alt="Profile"
//                     />
//                     <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xl font-semibold">
//                       SA
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                     <Camera className="w-6 h-6 text-white" />
//                   </div>
//                 </div>
//                 <div className="flex-1 space-y-3">
//                   <div>
//                     <h3 className="font-semibold text-slate-800">
//                       Profile Picture
//                     </h3>
//                     <p className="text-sm text-slate-600">
//                       Upload a new profile picture. Max size: 5MB
//                     </p>
//                   </div>
//                   <div className="flex gap-3">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="relative overflow-hidden border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
//                       disabled={isUploading}
//                     >
//                       <Upload className="w-4 h-4 mr-2" />
//                       {isUploading ? "Uploading..." : "Upload Photo"}
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageUpload}
//                         className="absolute inset-0 opacity-0 cursor-pointer"
//                       />
//                     </Button>
//                   </div>
//                 </div>
//               </div>

//               <Separator />

//               {/* Name Update */}
//               <form
//                 onSubmit={profileForm.handleSubmit(onProfileSubmit)}
//                 className="space-y-4"
//               >
//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="name"
//                     className="text-sm font-medium text-slate-700"
//                   >
//                     Full Name
//                   </Label>
//                   <Input
//                     id="name"
//                     placeholder="Enter your full name"
//                     className="bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
//                     {...profileForm.register("name", { required: true })}
//                   />
//                 </div>
//                 <Button
//                   type="submit"
//                   className="bg-emerald-600 hover:bg-emerald-700 text-white"
//                 >
//                   Update Profile
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>

//           {/* Change Password */}
//           <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
//             <CardHeader className="pb-4">
//               <CardTitle className="flex items-center gap-2 text-slate-800">
//                 <Lock className="w-5 h-5 text-emerald-600" />
//                 Change Password
//               </CardTitle>
//               <p className="text-sm text-slate-600">
//                 Update your password to keep your account secure
//               </p>
//             </CardHeader>
//             <CardContent>
//               <form
//                 onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
//                 className="space-y-4"
//               >
//                 {/* Old Password */}
//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="oldPassword"
//                     className="text-sm font-medium text-slate-700"
//                   >
//                     Current Password
//                   </Label>
//                   <div className="relative">
//                     <Input
//                       id="oldPassword"
//                       type={showOldPassword ? "text" : "password"}
//                       placeholder="Enter current password"
//                       className="pr-10 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
//                       {...passwordForm.register("oldPassword", {
//                         required: true,
//                       })}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowOldPassword(!showOldPassword)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
//                     >
//                       {showOldPassword ? (
//                         <EyeOff className="w-4 h-4" />
//                       ) : (
//                         <Eye className="w-4 h-4" />
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {/* New Password */}
//                   <div className="space-y-2">
//                     <Label
//                       htmlFor="newPassword"
//                       className="text-sm font-medium text-slate-700"
//                     >
//                       New Password
//                     </Label>
//                     <div className="relative">
//                       <Input
//                         id="newPassword"
//                         type={showNewPassword ? "text" : "password"}
//                         placeholder="Enter new password"
//                         className="pr-10 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
//                         {...passwordForm.register("newPassword", {
//                           required: true,
//                         })}
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowNewPassword(!showNewPassword)}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
//                       >
//                         {showNewPassword ? (
//                           <EyeOff className="w-4 h-4" />
//                         ) : (
//                           <Eye className="w-4 h-4" />
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   {/* Confirm Password */}
//                   <div className="space-y-2">
//                     <Label
//                       htmlFor="confirmPassword"
//                       className="text-sm font-medium text-slate-700"
//                     >
//                       Confirm New Password
//                     </Label>
//                     <div className="relative">
//                       <Input
//                         id="confirmPassword"
//                         type={showConfirmPassword ? "text" : "password"}
//                         placeholder="Confirm new password"
//                         className="pr-10 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
//                         {...passwordForm.register("confirmPassword", {
//                           required: true,
//                         })}
//                       />
//                       <button
//                         type="button"
//                         onClick={() =>
//                           setShowConfirmPassword(!showConfirmPassword)
//                         }
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
//                       >
//                         {showConfirmPassword ? (
//                           <EyeOff className="w-4 h-4" />
//                         ) : (
//                           <Eye className="w-4 h-4" />
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="pt-2">
//                   <Button
//                     type="submit"
//                     className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
//                   >
//                     Update Password
//                   </Button>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>

         
//         </div>
//       </div>
//     </div>
//   );
// }
