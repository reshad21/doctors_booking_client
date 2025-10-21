/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import BaseInput from "@/components/shared/BaseInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  loginSchema,
  type LoginSchemaType,
} from "@/validation/login.validation";
import { User, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/redux/hooks";
import { setUserToken } from "@/redux/api/features/authSlice";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { decodeToken } from "@/hooks/decodedToken";
import { setAdminDecodeData } from "@/redux/api/features/adminSlice";
import { useLoginAdminMutation } from "@/redux/api/auth/auth";

const Login = () => {
  const [login] = useLoginAdminMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    const res = (await login(data)) as any;

    console.log(res, 'res')
    if (res?.error) {
      return toast.error(res?.error?.data?.message);
    }
    const token = res?.data?.data?.accessToken;
    dispatch(setUserToken({ token: token }));
    const decoded = decodeToken(token);
    dispatch(setAdminDecodeData(decoded));
    toast.success("Doctor Logged In!");
    navigate("/dashboard");
     // Force a page reload to ensure fresh permission state
    // window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4">
      <div className="max-w-6xl w-full bg-brand rounded-lg overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row min-h-[500px] sm:min-h-[600px]">
          {/* Left side - Doctor Image */}
          <div className="w-full lg:w-1/2 bg-brand flex items-center justify-center p-4 sm:p-6 lg:p-8 order-2 lg:order-1">
            <div className="relative">
              <img
                src="/images/Doctor-login.png"
                alt="Doctor with clipboard"
                width={400}
                height={500}
                className="object-contain w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px] h-auto"
              />
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8 relative order-1 lg:order-2">
            <div className="w-full max-w-md">
              <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-green-700 mb-2">
                  Welcome
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-600">
                  Login admin Now
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 sm:space-y-6"
                >
                  <BaseInput
                    name="email"
                    placeholder="User name or email"
                    icon={<User className="size-4" />}
                    classname="bg-[#F8FBF9]"
                  />
                  <BaseInput
                    name="password"
                    type="password"
                    placeholder="Password"
                    icon={<Lock className="size-4" />}
                    classname="bg-[#F8FBF9]"
                  />
                  <Button
                    type="submit"
                    className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200 text-base sm:text-lg cursor-pointer"
                  >
                    LOGIN
                  </Button>
                </form>
              </Form>
              <Link to={"/staff-login"} className="text-xs mt-4">
                Need to login Staff{" "}
                <span className="text-blue-400 font-semibold underline cursor-pointer">
                  {" "}
                  Account
                </span>{" "}
              </Link>
            </div>

            {/* Decorative elements - Hidden on small screens for better UX */}
            <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full -translate-x-0 translate-y-6 sm:translate-y-0 lg:translate-y-10 hidden md:block">
              <img
                src="/images/Ellipse 1.png"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Small doctor image in bottom right - Hidden on mobile for cleaner look */}
            <div className="absolute bottom-0 right-0 overflow-hidden hidden md:block">
              <img
                src="/images/image 6.png"
                alt="Doctor"
                width={64}
                height={64}
                className="object-cover scale-100 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 translate-y-1 sm:translate-y-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
