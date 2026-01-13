"use client";

import Container from "@/components/container";
import TitlePage from "@/components/titlePage";
import { editOfficial, getOfficials } from "@/services/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Camera } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import withAuth from "@/lib/withAuth";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  position: z.enum(
    [
      "Captain",
      "Kagawad",
      "SK Chairman",
      "SK Kagawad",
      "Secretary",
      "Treasurer",
      "Tanod",
    ],
    {
      required_error: "Please select a position",
    }
  ),
  committee: z.string().optional(),
  contactNumber: z
    .string()
    .min(11, "Contact number must be at least 11 digits")
    .regex(/^[0-9]+$/, "Contact number must contain only numbers"),
  status: z.enum(["Active", "Inactive"]),
});

type FormValues = z.infer<typeof formSchema>;

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const officialId = params.id as string;

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isFormReady, setIsFormReady] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      committee: "",
      contactNumber: "",
      status: "Active",
    },
  });

  // Fetch official data
  const { data: officialData, isLoading } = useQuery({
    queryKey: ["official", officialId],
    queryFn: () => getOfficials({ id: officialId }),
    enabled: !!officialId,
  });

  // Populate form when data is loaded
  useEffect(() => {
    if (officialData?.data && officialData.data.length > 0) {
      const official = officialData.data[0];

      form.reset({
        firstName: official.firstName || "",
        middleName: official.middleName || "",
        lastName: official.lastName || "",
        position: official.position,
        committee: official.committee || "",
        contactNumber: official.contactNumber || "",
        status: official.status || "Active",
      });

      // Set existing photo preview
      if (official.photo) {
        setPhotoPreview(official.photo);
      }

      // Mark form as ready after data is loaded
      setTimeout(() => setIsFormReady(true), 100);
    }
  }, [officialData]);

  const editMutation = useMutation({
    mutationFn: (data: FormData) => editOfficial(data),
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success(data.message);
        router.push("/admin/officials");
      } else {
        toast.error(data.message);
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update official");
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    const formData = new FormData();
    formData.append("id", officialId);
    formData.append("firstName", values.firstName);
    formData.append("middleName", values.middleName || "");
    formData.append("lastName", values.lastName);
    formData.append("position", values.position);
    formData.append("committee", values.committee || "");
    formData.append("contactNumber", values.contactNumber);
    formData.append("status", values.status);
    if (photoFile) {
      formData.append("photo", photoFile);
    }

    editMutation.mutate(formData);
  };

  const positions = [
    "Captain",
    "Kagawad",
    "SK Chairman",
    "SK Kagawad",
    "Secretary",
    "Treasurer",
    "Tanod",
  ] as const;
  const committees = [
    "Health and Sanitation",
    "Peace and Order",
    "Education",
    "Infrastructure",
    "Agriculture",
    "Environment",
    "Sports and Recreation",
    "Social Services",
    "Budget and Finance",
    "Youth Development",
    "Livelihood",
  ];

  if (isLoading || !isFormReady) {
    return (
      <Container>
        <TitlePage title="Edit Official" hasBack />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
        </div>
      </Container>
    );
  }

  if (
    !officialData?.isSuccess ||
    !officialData.data ||
    officialData.data.length === 0
  ) {
    return (
      <Container>
        <TitlePage title="Edit Official" hasBack />
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-red-500">Failed to load official data</p>
            <Button
              onClick={() => router.push("/admin/officials")}
              className="mt-4"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <TitlePage title="Edit Official" hasBack />

      <div className="max-w-4xl mx-auto mt-6 space-y-6">
        {/* Photo Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Official Photo
            </CardTitle>
            <CardDescription>
              Upload a new photo or keep the existing one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-40 h-40 rounded-full overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 border-4 border-blue-200 flex items-center justify-center shadow-lg">
                {photoPreview ? (
                  <Image
                    src={photoPreview}
                    alt="Preview"
                    width={160}
                    height={160}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <Camera className="w-16 h-16 text-blue-400 mb-2" />
                    <span className="text-sm text-gray-500">No photo yet</span>
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => document.getElementById("photo-upload")?.click()}
              >
                <Camera className="w-4 h-4" />
                Change Photo
              </Button>
              <Input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Official Information</CardTitle>
            <CardDescription>
              Update the details of the barangay official
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* First Name */}
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Middle Name */}
                  <FormField
                    control={form.control}
                    name="middleName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Middle Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Last Name */}
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Position */}
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Position" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {positions.map((pos) => (
                              <SelectItem key={pos} value={pos}>
                                {pos}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Committee */}
                  <FormField
                    control={form.control}
                    name="committee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Committee / Zone</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Committee" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {committees.map((com) => (
                              <SelectItem key={com} value={com}>
                                {com}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Contact Number */}
                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="09171234567" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Status */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push("/admin/officials")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={editMutation.isPending}
                    className="flex-1"
                  >
                    {editMutation.isPending ? "Updating..." : "Update Official"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default withAuth(Page);
