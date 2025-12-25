"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { importResidents } from "@/services/api";
import { toast } from "sonner";

export const ImportResidentExcel: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return await importResidents(formData);
    },
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success(data.message);
        resetForm();
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      console.error("Failed to import residents:", error);
      toast.error("Residents not imported successfully.");
    },
  });

  const resetForm = () => {
    setFile(null);
    setOpen(false);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const handleAddClick = () => {
    if (file) {
      mutation.mutate(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="flex gap-2 items-center my-6"
        >
          <UploadCloud className="w-4 h-4" />
          Import from Excel
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Excel File</DialogTitle>
        </DialogHeader>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-500 font-medium">Drop the file here ...</p>
          ) : (
            <>
              <p className="text-sm text-gray-500">
                Drag and drop your Excel file here, or click to select
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                (.xlsx or .xls only)
              </p>
            </>
          )}
        </div>

        {file && (
          <p className="text-sm text-center text-green-600 mt-4">
            ✅ {file.name} ready. Click "Add" to import.
          </p>
        )}

        <div className="flex justify-end mt-4">
          <Button
            onClick={handleAddClick}
            disabled={!file || mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? "Importing..." : "Add"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
