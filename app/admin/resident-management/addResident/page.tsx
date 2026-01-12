"use client";

import TitlePage from "@/components/titlePage";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Import shadcn/ui components
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
import { CalendarIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { addResident } from "@/services/api";
import { ImportResidentExcel } from "@/components/importResidentExcel";
import withAuth from "@/lib/withAuth";
import { toastError, toastSuccess } from "@/utils/helpers";

const page = () => {
  const formSchema = z.object({
    firstname: z.string().min(2, "First name must be at least 2 characters"),
    middlename: z.string().min(2, "Middle name must be at least 2 characters"),
    lastname: z.string().min(2, "Last name must be at least 2 characters"),
    suffix: z.string().optional().nullable(),
    birthdate: z.date({
      required_error: "A birth date is required.",
    }),

    gender: z.union([z.literal("Male"), z.literal("Female"), z.literal("")]),
    purok: z.string().refine((val) => val.length > 0, {
      message: "Purok is required.",
    }),
    isSeniorCitizen: z.boolean().default(false).optional(),
    isPwd: z.boolean().default(false).optional(),
  });

  // Initialize react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      middlename: "",
      lastname: "",
      suffix: "",
      birthdate: undefined,
      gender: "",
      purok: "",
      isSeniorCitizen: false,
      isPwd: false,
    },
  });

  const addMutation = useMutation({
    mutationFn: addResident,
    onSuccess: (data) => {
      if (data.isSuccess) {
        toastSuccess(data.message);
        form.reset(); // This should now work correctly for all fields
      } else {
        toastError(data.message);
      }
    },
    onError: (error: any) => {
      toastError(error.message || "An unexpected error occurred.");
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formattedBirthdate = values.birthdate
      ? format(values.birthdate, "MMMM d,yyyy")
      : undefined;

    const dataToSend = {
      ...values,
      birthdate: formattedBirthdate,
    };

    addMutation.mutate(dataToSend);
  }

  const handleParsedExcel = (data: any[]) => {
    console.log("Parsed Excel Data:", data);
    // Call API/mutation here
  };

  return (
    <div>
      <TitlePage title="Add Resident" hasBack />
      <div className="flex items-center gap-4">
        <ImportResidentExcel />
        <a href="/file/Laurel Resident Data.xlsx" download>
          <Button
            size="sm"
            variant="default"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Excel File
          </Button>
        </a>
      </div>
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
                  <FormLabel>Suffix (e.g., Jr., Sr., III)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter suffix (optional)"
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
                  <FormLabel>Date of Birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP") // Display format
                          ) : (
                            <span>Pick a date</span>
                          )}
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
                        initialFocus
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
                      onValueChange={field.onChange}
                      value={field.value} // Use value prop directly, Zod allows ""
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Male" />
                        </FormControl>
                        <FormLabel className="font-normal">Male</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
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
                  <Select
                    onValueChange={field.onChange}
                    value={field.value} // Use value prop directly, Zod allows ""
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a purok" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* Optional: Add an "empty" option for Purok if you want it explicitly in the dropdown */}
                      {/* <SelectItem value="">(Select One)</SelectItem> */}
                      <SelectItem value="Purok 1">Purok 1</SelectItem>
                      <SelectItem value="Purok 2">Purok 2</SelectItem>
                      <SelectItem value="Purok 3">Purok 3</SelectItem>
                      <SelectItem value="Purok 4">Purok 4</SelectItem>
                      <SelectItem value="Purok 5">Purok 5</SelectItem>
                      {/* You'd likely load actual puroks/barangays for Mabalacat City here */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Senior Citizen Checkbox */}
            <FormField
              control={form.control}
              name="isSeniorCitizen"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Is Senior Citizen?</FormLabel>
                    <FormDescription>
                      Check this box if the resident is a senior citizen.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* PWD Checkbox */}
            <FormField
              control={form.control}
              name="isPwd"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Is PWD (Person With Disability)?</FormLabel>
                    <FormDescription>
                      Check this box if the resident is a person with
                      disability.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="cursor-pointer"
              disabled={addMutation.isPending}
            >
              {addMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </span>
              ) : (
                "Submit Resident"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default withAuth(page);
