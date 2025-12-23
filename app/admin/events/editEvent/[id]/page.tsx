"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import TitlePage from "@/components/titlePage";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { editEvent, getEvent } from "@/services/api";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { IResEvent } from "@/utils/types";
import withAuth from "@/lib/withAuth";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  datetime: z.string().min(1, "Date and time is required"),
  venue: z.string().min(1, "Venue is required"),
});

type FormData = z.infer<typeof formSchema>;

const Page = () => {
  const params = useParams();
  const [record, setRecord] = useState<IResEvent | null>(null);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      datetime: "",
      venue: "",
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["event"],
    queryFn: () => getEvent({ _id: params.id }),
    enabled: !!params.id,
  });

  const editMutation = useMutation({
    mutationFn: editEvent,
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success(data.message);
        form.reset();
      } else {
        toast.error(data.message);
      }
    },
  });

  const onSubmit = (data: FormData) => {
    const payload = {
      _id: params.id,
      ...data,
    };
    editMutation.mutate(payload);
  };

  useEffect(() => {
    if (data?.data?.[0]) {
      const res = data.data[0];
      setRecord(res);
      form.reset({
        title: res.title || "",
        description: res.description || "",
        datetime: res.datetime || "",
        venue: res.venue || "",
      });
    }
  }, [data, form]);

  return (
    <div className="max-w p-4 space-y-6">
      <TitlePage title="Edit Event" hasBack />

      {isLoading ? (
        <div className="text-gray-500 text-md my-10">Fetching Data...</div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Barangay Assembly" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a detailed event description"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date and Time */}
            <FormField
              control={form.control}
              name="datetime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date & Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Venue */}
            <FormField
              control={form.control}
              name="venue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Barangay Hall" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={editMutation.isPending}
            >
              {editMutation.isPending ? "Adding..." : "Add Event"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default withAuth(Page);
