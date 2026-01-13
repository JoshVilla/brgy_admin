"use client";

import Container from "@/components/container";
import TitlePage from "@/components/titlePage";
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
import { editLegislative, getLegislative } from "@/services/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IResLegislative } from "@/utils/types";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { toastError, toastLoading, toastSuccess } from "@/utils/helpers";
import withAuth from "@/lib/withAuth";

const EditLegislativePage = () => {
  const params = useParams();
  const router = useRouter();
  const legislativeId = Array.isArray(params.id) ? params.id[0] : params.id;
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

  const { data, isLoading } = useQuery({
    queryKey: ["legislative", legislativeId],
    queryFn: () => getLegislative({ filters: { _id: legislativeId } }),
    enabled: !!legislativeId,
  });

  const legislativeData = data?.data?.[0] as IResLegislative;

  // Populate form when data is loaded
  useEffect(() => {
    if (legislativeData) {
      setFormData({
        title: legislativeData.title || "",
        legislativeType: legislativeData.legislativeType || "Ordinance",
        orderNumber: legislativeData.orderNumber || "",
        description: legislativeData.description || "",
        dateApproved: legislativeData.dateApproved
          ? new Date(legislativeData.dateApproved).toISOString().split("T")[0]
          : "",
        effectiveDate: legislativeData.effectiveDate
          ? new Date(legislativeData.effectiveDate).toISOString().split("T")[0]
          : "",
        status: legislativeData.status || "Draft",
        author: legislativeData.author || "",
        category: legislativeData.category || "",
      });
    }
  }, [legislativeData]);

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

  const handleDownload = async () => {
    try {
      toastLoading("Downloading...");

      const response = await fetch(legislativeData.file);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${legislativeData.orderNumber}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.dismiss();
      toastSuccess("Downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.dismiss();
      toastError("Failed to download PDF");
    }
  };

  const editMutation = useMutation({
    mutationFn: editLegislative,
    onSuccess: (data) => {
      if (data.isSuccess) {
        toastSuccess(data.message);
        router.push("/admin/legislatives");
      } else {
        toastError(data.message);
      }
    },
    onError: (err: any) => {
      toastError(err?.message || "An error occurred");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("id", legislativeId as string);
    data.append("title", formData.title);
    data.append("legislativeType", formData.legislativeType);
    data.append("orderNumber", formData.orderNumber);
    data.append("description", formData.description);
    data.append("dateApproved", formData.dateApproved);
    data.append("effectiveDate", formData.effectiveDate);
    data.append("status", formData.status);
    data.append("author", formData.author);
    // Only append category if it has a value
    if (formData.category) {
      data.append("category", formData.category);
    }

    if (file) {
      data.append("file", file);
    }

    editMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Container>
        <TitlePage title="Edit Legislative" hasBack />
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="text-center py-10">Loading...</div>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (!legislativeData) {
    return (
      <Container>
        <TitlePage title="Edit Legislative" hasBack />
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="text-center py-10 text-red-500">
              Legislative document not found
            </div>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <TitlePage title="Edit Legislative" hasBack />

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

            {/* Current File Display */}
            <div className="space-y-2">
              <Label>Current Document</Label>
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">📄</span>
                    <span className="text-sm text-gray-600">
                      {legislativeData.orderNumber}.pdf
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </div>

            {/* Upload New File (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="file">Upload New Document (Optional)</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                accept=".pdf"
              />
              <p className="text-sm text-muted-foreground">
                Leave empty to keep current document. Accepted format: PDF only
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <Button type="submit" disabled={editMutation.isPending}>
                {editMutation.isPending
                  ? "Updating..."
                  : "Update Legislative Document"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={editMutation.isPending}
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

export default withAuth(EditLegislativePage);
