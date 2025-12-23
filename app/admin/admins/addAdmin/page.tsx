"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMutation } from "@tanstack/react-query";
import { addAdmin } from "@/services/api";
import { toast } from "sonner";
import withAuth from "@/lib/withAuth";
import TitlePage from "@/components/titlePage";

const formSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[a-z]/, "Must include a lowercase letter")
      .regex(/[A-Z]/, "Must include an uppercase letter")
      .regex(/[0-9]/, "Must include a number")
      .regex(/[^a-zA-Z0-9]/, "Must include a special character"),
    confirmPassword: z.string(),
    isSuperAdmin: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

const AdminForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      isSuperAdmin: false,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    addMutation.mutate(data);
  };

  const addMutation = useMutation({
    mutationFn: addAdmin,
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success(data.message);
        form.reset();
      } else {
        toast.error(data.message);
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <>
    <TitlePage title="Add New Admin" hasBack />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </FormControl>
                <FormDescription>
                  At least 6 characters, 1 uppercase, 1 lowercase, 1 number, 1
                  special character
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* isSuperAdmin as boolean */}
          <FormField
            control={form.control}
            name="isSuperAdmin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Is Super Admin?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value === "true")}
                    defaultValue={field.value.toString()}
                    className="flex space-x-4"
                  >
                    <FormItem>
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="ml-1">Yes</FormLabel>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="ml-1">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="sm"
            className="cursor-pointer"
            disabled={addMutation.isPending}
          >
            {addMutation.isPending ? "Submiting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default withAuth(AdminForm);
