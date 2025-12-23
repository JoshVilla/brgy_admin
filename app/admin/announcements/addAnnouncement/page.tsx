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
import { useMutation } from "@tanstack/react-query";
import { addAnnouncement } from "@/services/api";
import { toast } from "sonner";
import TitlePage from "@/components/titlePage";
import withAuth from "@/lib/withAuth";

const formSchema = z.object({
  announcement: z.string().min(1, "Announcement is required"),
  isViewed: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

const AddAnnouncementPage = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      announcement: "",
      isViewed: true,
    },
  });

  const addMutation = useMutation({
    mutationFn: addAnnouncement,
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
    addMutation.mutate(data);
  };

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
            disabled={addMutation.isPending}
            className="cursor-pointer"
          >
            {addMutation.isPending ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default withAuth(AddAnnouncementPage);
