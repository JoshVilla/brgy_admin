"use client";

import Container from "@/components/container";
import TitlePage from "@/components/titlePage";
import { getBlotters, updateBlotter } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { toastError, toastSuccess } from "@/utils/helpers";
import withAuth from "@/lib/withAuth";

// Form validation schema
const blotterFormSchema = z.object({
  incidentType: z.string().min(1, "Incident type is required"),
  incidentDate: z.string().min(1, "Incident date is required"),
  location: z.string().min(1, "Location is required"),
  complainantName: z
    .string()
    .min(2, "Complainant name must be at least 2 characters"),
  respondentName: z
    .string()
    .min(2, "Respondent name must be at least 2 characters"),
  narrative: z.string().min(10, "Narrative must be at least 10 characters"),
  status: z.enum(["ONGOING", "FOR_HEARING", "SETTLED", "REFERRED"]),
  officerInCharge: z.string().min(1, "Officer in charge is required"),
});

type BlotterFormValues = z.infer<typeof blotterFormSchema>;

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const blotterId = params.id as string;

  const form = useForm<BlotterFormValues>({
    resolver: zodResolver(blotterFormSchema),
    defaultValues: {
      incidentType: "",
      incidentDate: "",
      location: "",
      complainantName: "",
      respondentName: "",
      narrative: "",
      status: "ONGOING",
      officerInCharge: "",
    },
  });

  // Fetch blotter by ID
  const { data, isLoading } = useQuery({
    queryKey: ["blotter", blotterId],
    queryFn: () => getBlotters({ id: blotterId }),
    enabled: !!blotterId,
  });

  // Populate form when data is loaded
  useEffect(() => {
    if (data?.success && data?.data) {
      console.log(data.data);
      const blotter = data.data[0];
      form.reset({
        incidentType: blotter.incidentType,
        incidentDate: blotter.incidentDate, // Format date for input
        location: blotter.location,
        complainantName: blotter.complainantName,
        respondentName: blotter.respondentName,
        narrative: blotter.narrative,
        status: blotter.status,
        officerInCharge: blotter.officerInCharge,
      });
    }
  }, [data, form, blotterId]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (formData: BlotterFormValues) =>
      updateBlotter({ blotterId, ...formData }),
    onSuccess: () => {
      toastSuccess("Blotter entry updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["blotters"] });
      queryClient.invalidateQueries({ queryKey: ["blotter", blotterId] });
      router.push("/admin/blotters");
    },
    onError: (error: Error) => {
      toastError(error.message || "Failed to update blotter entry");
    },
  });

  const onSubmit = (formData: BlotterFormValues) => {
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <Container>
        <TitlePage title="Edit Blotter" hasBack />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Container>
    );
  }

  if (!data?.success || !data?.data) {
    return (
      <Container>
        <TitlePage title="Edit Blotter" hasBack />
        <Card className="mt-6">
          <CardContent className="py-12 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              Blotter not found
            </p>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <TitlePage title="Edit Blotter" hasBack />

      <Card className="mt-6">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Blotter Number Display */}
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium">
                  Blotter No: {data.data.blotterNo}
                </p>
              </div>

              {/* Incident Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Incident Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="incidentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Incident Type *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Theft, Noise Complaint"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="incidentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Incident Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Purok 5, Near Barangay Hall"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Parties Involved Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Parties Involved</h3>

                <FormField
                  control={form.control}
                  name="complainantName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complainant Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Full name of complainant"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="respondentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Respondent Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Full name of respondent"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Narrative Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Description</h3>

                <FormField
                  control={form.control}
                  name="narrative"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Narrative *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide a detailed description of the incident..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include important details such as what happened, when,
                        and any witnesses
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Case Management Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Case Management</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ONGOING">Ongoing</SelectItem>
                            <SelectItem value="FOR_HEARING">
                              For Hearing
                            </SelectItem>
                            <SelectItem value="SETTLED">Settled</SelectItem>
                            <SelectItem value="REFERRED">Referred</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="officerInCharge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Officer in Charge *</FormLabel>
                        <FormControl>
                          <Input placeholder="Officer's full name" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the name of the officer handling this case
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/blotters")}
                  disabled={updateMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Blotter Entry"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default withAuth(Page);
