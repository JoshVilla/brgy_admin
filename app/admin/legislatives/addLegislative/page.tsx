"use client";

import Container from "@/components/container";
import TitlePage from "@/components/titlePage";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { addLegislative } from "@/services/api";
import { Spinner } from "@/components/ui/spinner";
import { Plus } from "lucide-react";
import { toastError, toastSuccess } from "@/utils/helpers";
import withAuth from "@/lib/withAuth";

const AddLegislativePage = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    legislativeType: "Ordinance",
    orderNumber: "",
    description: "",
    dateApproved: "",
    effectiveDate: "",
    status: "Draft",
    author: "",
    category: "",
  });

  const addMutation = useMutation({
    mutationFn: addLegislative,
    onSuccess: (data) => {
      if (data.isSuccess) {
        toastSuccess(data.message);
        router.push("/admin/legislatives");
      } else {
        toastError(data.message);
      }
    },
    onError: (err: any) => {
      console.log(err);
      toastError(err?.message || "An error occurred");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toastError("Please upload a document");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("legislativeType", formData.legislativeType);
    data.append("orderNumber", formData.orderNumber);
    data.append("description", formData.description);
    data.append("dateApproved", formData.dateApproved);
    data.append("effectiveDate", formData.effectiveDate);
    data.append("status", formData.status);
    data.append("author", formData.author);
    data.append("category", formData.category);

    if (file) {
      data.append("file", file);
    }

    addMutation.mutate(data);
  };

  return (
    <Container>
      <TitlePage title="Add Legislative" hasBack />

      <Card className="mt-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter legislative title"
              />
            </div>

            {/* Legislative Type and Order Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="legislativeType">
                  Legislative Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.legislativeType}
                  onValueChange={(value) =>
                    handleSelectChange("legislativeType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ordinance">Ordinance</SelectItem>
                    <SelectItem value="Resolution">Resolution</SelectItem>
                    <SelectItem value="Executive Order">
                      Executive Order
                    </SelectItem>
                    <SelectItem value="Memorandum">Memorandum</SelectItem>
                    <SelectItem value="Proclamation">Proclamation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orderNumber">
                  Order Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="orderNumber"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleChange}
                  required
                  placeholder="e.g., ORD-2025-001"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Brief description of the legislative document"
              />
            </div>

            {/* Date Approved and Effective Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateApproved">
                  Date Approved <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dateApproved"
                  type="date"
                  name="dateApproved"
                  value={formData.dateApproved}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="effectiveDate">Effective Date</Label>
                <Input
                  id="effectiveDate"
                  type="date"
                  name="effectiveDate"
                  value={formData.effectiveDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Status and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Implemented">Implemented</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category || undefined}
                  onValueChange={(value) =>
                    handleSelectChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Governance">Governance</SelectItem>
                    <SelectItem value="Public Safety">Public Safety</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Infrastructure">
                      Infrastructure
                    </SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Environment">Environment</SelectItem>
                    <SelectItem value="Social Services">
                      Social Services
                    </SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Author */}
            <div className="space-y-2">
              <Label htmlFor="author">Author/Sponsor</Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Name of author or sponsor"
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="file">
                Upload Document <span className="text-red-500">*</span>
              </Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                required
                accept=".pdf"
              />
              <p className="text-sm text-muted-foreground">
                Accepted formats: PDF
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="submit"
                disabled={addMutation.isPending}
                className="cursor-pointer"
              >
                {addMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Spinner />
                    Adding...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Plus />
                    Add Legislative Document
                  </span>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={addMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default withAuth(AddLegislativePage);
