"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { IResAdmin } from "@/utils/types";
import withAuth from "@/lib/withAuth";
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "@/services/api";
import { setAdminInfo } from "@/redux/slice/adminSlice";
import { toastError, toastSuccess } from "@/utils/helpers";

// Password strength regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;

const formSchema = z
  .object({
    id: z.string(),
    username: z.string().min(3, "Username must be at least 3 characters"),
    currentPassword: z.string().optional().or(z.literal("")),
    newPassword: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine((val) => !val || passwordRegex.test(val), {
        message:
          "Password must be at least 6 characters, include uppercase, lowercase, number, and special character",
      }),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.newPassword || data.confirmPassword) {
        return data.newPassword === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

type FormValues = z.infer<typeof formSchema>;

const EditAccountForm = () => {
  const dispatch = useDispatch();
  const adminInfo = useSelector(
    (state: RootState) => state.admin.adminInfo as IResAdmin
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: adminInfo._id,
      username: adminInfo.username,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      if (data.isSuccess) {
        toastSuccess(data.message);
        dispatch(setAdminInfo(data.data));
      }
    },
    onError: (error: any) => {
      toastError(error.message || "Failed to update profile");
    },
  });

  const handleSubmit = async (values: FormValues) => {
    const payload = {
      id: values.id,
      username: values.username,
      ...(values.currentPassword
        ? { currentPassword: values.currentPassword }
        : {}),
      ...(values.newPassword ? { newPassword: values.newPassword } : {}),
    };

    updateMutation.mutate(payload);
  };

  useEffect(() => {
    form.reset({
      id: adminInfo._id,
      username: adminInfo.username,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [adminInfo]);

  return (
    <Card className="mt-10">
      <CardHeader>
        <CardTitle>Edit Account</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter current password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="w-full cursor-pointer"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default withAuth(EditAccountForm);
