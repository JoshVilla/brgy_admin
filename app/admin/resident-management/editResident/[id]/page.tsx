"use client";

import TitlePage from "@/components/titlePage";
import { Button } from "@/components/ui/button";
import { Loader2, CalendarIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addResident, editResident, getResident } from "@/services/api";
import { IResResident } from "@/utils/types";
import { toastError, toastSuccess } from "@/utils/helpers";

// Zod schema
const formSchema = z.object({
  firstname: z.string().min(2, "First name must be at least 2 characters"),
  middlename: z.string().min(2, "Middle name must be at least 2 characters"),
  lastname: z.string().min(2, "Last name must be at least 2 characters"),
  suffix: z.string().optional().nullable(),
  birthdate: z.date({
    required_error: "A birth date is required.",
  }),
  gender: z.union([z.literal("Male"), z.literal("Female"), z.literal("")]),
  purok: z.string().min(1, "Purok is required."),
  isSeniorCitizen: z.boolean().optional(),
  isPwd: z.boolean().optional(),
});

// Infer TypeScript type from Zod schema
type ResidentFormValues = z.infer<typeof formSchema>;

const Page = () => {
  const params = useParams();
  const [record, setRecord] = useState<IResResident | null>(null);

  const form = useForm<ResidentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      middlename: "",
      lastname: "",
      suffix: null,
      birthdate: undefined,
      gender: "",
      purok: "",
      isSeniorCitizen: false,
      isPwd: false,
    },
  });

  // Fetch resident by ID
  const { data, isLoading } = useQuery({
    queryKey: ["resident", params.id],
    queryFn: () => getResident({ _id: params.id }),
    enabled: !!params.id,
  });

  // Set record and update form when data is loaded
  useEffect(() => {
    if (data?.data?.[0]) {
      const res = data.data[0];
      setRecord(res);
      form.reset({
        firstname: res.firstname || "",
        middlename: res.middlename || "",
        lastname: res.lastname || "",
        suffix: res.suffix ?? null,
        birthdate: res.birthdate ? new Date(res.birthdate) : undefined,
        gender: res.gender || "",
        purok: res.purok || "",
        isSeniorCitizen: res.isSeniorCitizen || false,
        isPwd: res.isPwd || false,
      });
    }
  }, [data, form]);

  // Mutation for submission
  const editMutation = useMutation({
    mutationFn: editResident,
    onSuccess: (data) => {
      if (data.isSuccess) {
        toastSuccess(data.message);
      } else {
        toastError(data.message);
      }
    },
    onError: (error: any) => {
      toastError(error.message || "An unexpected error occurred.");
    },
  });

  const onSubmit = (values: ResidentFormValues) => {
    const formattedBirthdate = values.birthdate
      ? format(values.birthdate, "MMMM d, yyyy")
      : undefined;

    const dataToSend = {
      ...values,
      birthdate: formattedBirthdate,
    };

    const payload = {
      _id: params.id,
      ...dataToSend,
    };

    editMutation.mutate(payload);
  };

  return (
    <div>
      <TitlePage title="Edit Resident" hasBack />

      <div className="mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* First Name */}
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Middle Name */}
            <FormField
              control={form.control}
              name="middlename"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter middle name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Suffix */}
            <FormField
              control={form.control}
              name="suffix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Suffix</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Jr., Sr., III (optional)"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Birthdate */}
            <FormField
              control={form.control}
              name="birthdate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Birthdate</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? format(field.value, "PPP")
                            : "Pick a date"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown"
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3">
                        <FormControl>
                          <RadioGroupItem value="Male" />
                        </FormControl>
                        <FormLabel className="font-normal">Male</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3">
                        <FormControl>
                          <RadioGroupItem value="Female" />
                        </FormControl>
                        <FormLabel className="font-normal">Female</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Purok */}
            <FormField
              control={form.control}
              name="purok"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purok</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a purok" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Purok 1">Purok 1</SelectItem>
                      <SelectItem value="Purok 2">Purok 2</SelectItem>
                      <SelectItem value="Purok 3">Purok 3</SelectItem>
                      <SelectItem value="Purok 4">Purok 4</SelectItem>
                      <SelectItem value="Purok 5">Purok 5</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Senior Citizen */}
            <FormField
              control={form.control}
              name="isSeniorCitizen"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4 shadow-sm">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Is Senior Citizen?</FormLabel>
                    <FormDescription>
                      Check this if the resident is a senior citizen.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* PWD */}
            <FormField
              control={form.control}
              name="isPwd"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4 shadow-sm">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Is PWD?</FormLabel>
                    <FormDescription>
                      Check this if the resident is a person with disability.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="cursor-pointer"
              disabled={editMutation.isPending}
            >
              {editMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </span>
              ) : (
                "Update Resident"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
