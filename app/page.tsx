"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import InputPassword from "@/components/inputpassword";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setAdminInfo } from "@/redux/slice/adminSlice";
import { Loader2, LogIn, Shield } from "lucide-react";

const schema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters"),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters")
    .max(20, "Password must be at most 20 characters"),
});

type FormData = z.infer<typeof schema>;

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.isSuccess) {
        router.push("/admin/dashboard");
        dispatch(setAdminInfo(data.data));
        localStorage.setItem("token", data.token);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    },
    onError: (err) => {
      console.log(err);
      toast.error("An error occurred. Please try again.");
    },
  });

  const onSubmit = (data: FormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="w-full flex h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Left Side - Image with Overlay */}
      <div className="flex-1 hidden lg:flex relative overflow-hidden">
        <div className="relative w-full h-full">
          <Image
            src={require("@/public/laurel.png")}
            className="w-full h-full object-cover"
            alt="laurel"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-90 mix-blend-multiply"></div>

          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12">
            <div className="max-w-md text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-4">
                <Shield className="w-10 h-10" />
              </div>
              <h1 className="text-4xl font-bold">Welcome to Laurel</h1>
              <p className="text-lg text-blue-100">
                Barangay Management System
              </p>
              <p className="text-sm text-blue-200">
                Streamlining community services and resident management for a
                better tomorrow
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo and Title - Mobile */}
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <div className="relative w-24 h-24 mb-4">
              <Image
                src={require("@/public/laurel-logo.png")}
                fill
                alt="logo"
                className="object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              Laurel Management System
            </h2>
          </div>

          <Card className="border-0 shadow-2xl">
            <CardHeader className="space-y-1 pb-6">
              {/* Logo - Desktop */}
              <div className="hidden lg:flex flex-col items-center mb-4">
                <div className="relative w-20 h-20 mb-4">
                  <Image
                    src={require("@/public/laurel-logo.png")}
                    fill
                    alt="logo"
                    className="object-contain"
                  />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">
                Admin Login
              </CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username
                  </Label>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    className="h-11"
                    {...register("username")}
                    disabled={loginMutation.isPending}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <span className="text-xs">⚠</span>
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <InputPassword
                    register={register}
                    errors={errors}
                    name="password"
                    placeholder="Enter your password"
                    disabled={loginMutation.isPending}
                  />
                </div>

                <Button
                  className="w-full h-11 text-base font-medium"
                  type="submit"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </>
                  )}
                </Button>
              </form>

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  Protected by security protocols
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Need help? Contact your system administrator
          </p>
        </div>
      </div>
    </div>
  );
}
