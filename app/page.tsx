"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import InputPassword from "@/components/inputpassword";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setAdminInfo } from "@/redux/slice/adminSlice";

const schema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters"),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters")
    .max(20, "Password must be at most 8 characters"),
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
    },
  });

  const onSubmit = (data: FormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="w-full flex h-screen">
      <div className="flex-1 hidden md:block">
        <div className="relative w-full h-full ">
          <Image
            src={require("@/public/laurel.png")}
            className="w-full h-full object-cover"
            alt="laurel"
          />
          <div className="absolute inset-0 bg-blue-500 opacity-100 mix-blend-multiply"></div>
        </div>
      </div>
      <div className="flex-1 p-4">
        <div className="h-full w-full flex-col flex justify-center items-center">
          <Image
            src={require("@/public/laurel-logo.png")}
            width={150}
            height={150}
            alt="logo"
          />
          <div className="font-semibold text-2xl text-center mt-6">
            Laurel Management System
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-1/2 mt-10"
          >
            <div>
              <Input
                className="h-8"
                placeholder="Enter Username"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div>
              <InputPassword
                register={register}
                errors={errors}
                name="password"
                placeholder="Enter Password"
              />
            </div>
            <Button
              size="sm"
              className="cursor-pointer"
              variant="default"
              type="submit"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
