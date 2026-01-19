"use client";
import Container from "@/components/container";
import TitlePage from "@/components/titlePage";
import React, { useState } from "react";
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
import { X, ImagePlus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { addIncidentReport } from "@/services/api";
import { toastError, toastSuccess } from "@/utils/helpers";

import { IResResident } from "@/utils/types";
import ResidentCombobox from "@/components/searchResidents";
import withAuth from "@/lib/withAuth";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    incidentType: "",
    description: "",
    location: "",
    dateOccurred: "",
    reporterName: "",
    reporterContact: "",
    residentId: "" as string, // Changed from null to empty string for better TypeScript handling
  });
  const [isManualInput, setIsManualInput] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const addMutation = useMutation({
    mutationFn: addIncidentReport,
    onSuccess: (data) => {
      if (data.isSuccess) {
        toastSuccess(data.message);
        setFormData({
          incidentType: "",
          description: "",
          location: "",
          dateOccurred: "",
          reporterName: "",
          reporterContact: "",
          residentId: "",
        });
        setImages([]);
        setImagePreviews([]);
        setIsManualInput(false);
      } else {
        toastError(data.message);
      }
      setLoading(false);
    },
    onError: (err) => {
      console.log(err);
      toastError("Failed to submit incident report");
      setLoading(false);
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle resident selection from combobox
  const handleResidentSelect = (resident: IResResident) => {
    const fullName =
      `${resident.firstname} ${resident.middlename || ""} ${resident.lastname}`.trim();
    setFormData((prev) => ({
      ...prev,
      reporterName: fullName,
      reporterContact: resident.contactNumber || "",
      residentId: resident.userAppId || "",
    }));
  };

  // Clear resident data
  const handleClearResident = () => {
    setFormData((prev) => ({
      ...prev,
      reporterName: "",
      reporterContact: "",
      residentId: "", // Clear residentId too
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 5 - images.length;

    if (files.length > remainingSlots) {
      alert(`You can only upload ${remainingSlots} more image(s)`);
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("incidentType", formData.incidentType);
      submitData.append("description", formData.description);
      submitData.append("location", formData.location);
      submitData.append("dateOccurred", formData.dateOccurred);
      submitData.append("reporterName", formData.reporterName);
      submitData.append("reporterContact", formData.reporterContact);

      // Append residentId if it exists (from combobox selection)
      if (formData.residentId) {
        submitData.append("residentId", formData.residentId);
      }

      // Append images
      images.forEach((image) => {
        submitData.append("images", image);
      });

      addMutation.mutate(submitData);
    } catch (error) {
      console.error("Error:", error);
      toastError("An error occurred");
      setLoading(false);
    }
  };

  return (
    <Container>
      <TitlePage title="Add Report" hasBack />
      <div className="my-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Incident Type */}
          <div className="space-y-2">
            <Label htmlFor="incidentType">Incident Type</Label>
            <Select
              value={formData.incidentType}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, incidentType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select incident type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="crime">Crime</SelectItem>
                <SelectItem value="accident">Accident</SelectItem>
                <SelectItem value="dispute">Dispute</SelectItem>
                <SelectItem value="noise">Noise Complaint</SelectItem>
                <SelectItem value="fire">Fire</SelectItem>
                <SelectItem value="health">Health Issue</SelectItem>
                <SelectItem value="environmental">Environmental</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the incident in detail"
              rows={4}
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter location/address"
              required
            />
          </div>

          {/* Date Occurred */}
          <div className="space-y-2">
            <Label htmlFor="dateOccurred">Date Occurred</Label>
            <Input
              id="dateOccurred"
              name="dateOccurred"
              type="datetime-local"
              value={formData.dateOccurred}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Reporter Name - WITH COMBOBOX */}
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <Label>Reporter Name</Label>
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={() => {
                  setIsManualInput(!isManualInput);
                  handleClearResident();
                }}
                className="text-xs h-8 cursor-pointer"
              >
                {isManualInput ? "Search Resident" : "Manual Input"}
              </Button>
            </div>

            {!isManualInput ? (
              <ResidentCombobox
                value={formData.reporterName}
                onSelect={handleResidentSelect}
              />
            ) : (
              <Input
                id="reporterName"
                name="reporterName"
                value={formData.reporterName}
                onChange={handleInputChange}
                placeholder="Enter full name"
                required
              />
            )}
          </div>

          {/* Reporter Contact */}
          <div className="space-y-2">
            <Label htmlFor="reporterContact">Contact Number</Label>
            <Input
              id="reporterContact"
              name="reporterContact"
              value={formData.reporterContact}
              onChange={handleInputChange}
              placeholder="09XXXXXXXXX"
              required
            />
          </div>

          {/* Images Upload */}
          <div className="space-y-2">
            <Label>Images (Optional, Max 5)</Label>
            <div className="space-y-4">
              {images.length < 5 && (
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="images"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImagePlus className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload images
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {images.length}/5 images uploaded
                      </p>
                    </div>
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="w-full flex justify-end">
            <Button type="submit" className="cursor-pointer" disabled={loading}>
              {loading ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default withAuth(Page);
