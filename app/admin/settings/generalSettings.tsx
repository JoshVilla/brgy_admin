"use client";

import Container from "@/components/container";
import { getGeneralSettings, updateGeneralSettings } from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Upload, X, Check, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDispatch } from "react-redux";
import { setSettingsInfo } from "@/redux/slice/settingsSlice";

const GeneralSettings = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [adminTitle, setAdminTitle] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["general"],
    queryFn: () => getGeneralSettings({}),
  });

  const updateMutation = useMutation({
    mutationFn: updateGeneralSettings,
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success(data.message || "Settings updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["general"] });
        dispatch(setSettingsInfo(data.general));
        setLogoFile(null);
        setLogoPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        toast.error(data.message || "Failed to update settings");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update settings");
    },
  });

  useEffect(() => {
    if (data?.isSuccess && data.general) {
      setAdminTitle(data.general.adminTitle || "");
    }
  }, [data]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setLogoFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("adminTitle", adminTitle);

    if (logoFile) {
      formData.append("adminLogo", logoFile);
    }

    updateMutation.mutate(formData);
  };

  const handleReset = () => {
    if (data?.isSuccess && data.general) {
      setAdminTitle(data.general.adminTitle || "");
      setLogoFile(null);
      setLogoPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 text-purple-600 animate-spin" />
            <p className="text-sm text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-bold tracking-tight">General Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure your admin panel branding and appearance
          </p>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Configuration</CardTitle>
            <CardDescription>
              Customize the branding and appearance of your admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Admin Title */}
              <div className="space-y-2">
                <Label htmlFor="adminTitle">Admin Title</Label>
                <Input
                  id="adminTitle"
                  type="text"
                  value={adminTitle}
                  onChange={(e) => setAdminTitle(e.target.value)}
                  placeholder="Barangay Management System"
                  className="max-w-xl"
                />
                <p className="text-sm text-muted-foreground">
                  The title displayed in your admin panel header
                </p>
              </div>

              {/* Admin Logo Upload */}
              <div className="space-y-2">
                <Label>Admin Logo</Label>

                {/* File Upload Area */}
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer hover:border-primary/50 ${
                    logoFile
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    id="logoFile"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  {!logoFile && !logoPreview ? (
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-sm font-medium mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, GIF, WEBP up to 5MB
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {logoPreview && (
                          <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-background border">
                            <Image
                              src={logoPreview}
                              alt="Logo Preview"
                              width={80}
                              height={80}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {logoFile?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {logoFile && (logoFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleRemoveFile}
                        className="flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Current Logo Display */}
                {!logoFile && data?.general?.adminLogo && (
                  <Card className="mt-4">
                    <CardContent className="pt-6">
                      <p className="text-sm font-medium mb-3">Current Logo:</p>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted border">
                          <Image
                            src={data.general.adminLogo}
                            alt="Current Admin Logo"
                            width={80}
                            height={80}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground font-mono break-all">
                          {data.general.adminLogo}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="flex-1 sm:flex-none"
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Save Settings
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={updateMutation.isPending}
                  className="sm:w-auto"
                >
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Current Settings Info Card */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Current Configuration</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start justify-between gap-4 p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Admin Title:</span>
              <span className="text-sm font-mono text-right">
                {data?.general?.adminTitle || (
                  <Badge variant="secondary" className="font-normal">
                    Not set
                  </Badge>
                )}
              </span>
            </div>
            <div className="flex items-start justify-between gap-4 p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Logo URL:</span>
              <span className="text-sm font-mono text-right break-all max-w-md">
                {data?.general?.adminLogo || (
                  <Badge variant="secondary" className="font-normal">
                    Not set
                  </Badge>
                )}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default GeneralSettings;
