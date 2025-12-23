"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addAnnouncement,
  editAnnouncement,
  getAnnouncement,
} from "@/services/api";
import { toast } from "sonner";
import TitlePage from "@/components/titlePage";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import withAuth from "@/lib/withAuth";

const formSchema = z.object({
  announcement: z.string().min(1, "Announcement is required"),
  isViewed: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

const Page = () => {
  const params = useParams();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      announcement: "",
      isViewed: true,
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["resident", params.id],
    queryFn: () => getAnnouncement({ _id: params.id }),
    enabled: !!params.id,
  });

  const editMutation = useMutation({
    mutationFn: editAnnouncement,
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
        form.reset();
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
      form.reset({
        announcement: res.announcement || "",
        isViewed: res.isViewed || false,
      });
    }
  }, [data, form]);

  return (
    <div className="max-w-md  py-8">
      <TitlePage title="Add Announcement" hasBack />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="announcement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Announcement</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Type your announcement here..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isViewed"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                </FormControl>
                <FormLabel className="font-normal">Is Viewed</FormLabel>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={editMutation.isPending}
            className="cursor-pointer"
          >
            {editMutation.isPending ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default withAuth(Page);
