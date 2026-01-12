"use client";

import React from "react";
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
import { useMutation } from "@tanstack/react-query";
import { addEvent } from "@/services/api";
import withAuth from "@/lib/withAuth";
import { toastError, toastSuccess } from "@/utils/helpers";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  datetime: z.string().min(1, "Date and time is required"),
  venue: z.string().min(1, "Venue is required"),
});

type FormData = z.infer<typeof formSchema>;

const Page = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      datetime: "",
      venue: "",
    },
  });

  const addMutation = useMutation({
    mutationFn: addEvent,
    onSuccess: (data) => {
      if (data.isSuccess) {
        toastSuccess(data.message);
        form.reset();
      } else {
        toastError(data.message);
      }
    },
  });

  const onSubmit = (data: FormData) => {
    addMutation.mutate(data);
  };

  return (
    <div className="max-w p-4 space-y-6">
      <TitlePage title="Add Event" hasBack />

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
            disabled={addMutation.isPending}
          >
            {addMutation.isPending ? "Adding..." : "Add Event"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default withAuth(Page);
