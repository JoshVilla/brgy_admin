"use client";

import Container from "@/components/container";
import TitlePage from "@/components/titlePage";
import { getIncidentReport } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { format } from "date-fns";
import EditStatus from "../../editStatus";
import {
  MapPin,
  Calendar,
  User,
  Phone,
  FileText,
  AlertCircle,
  ImageIcon,
} from "lucide-react";

const Page = () => {
  const params = useParams();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["report", params.id],
    queryFn: () => getIncidentReport({ _id: params.id }),
  });

  const report = data?.data?.[0];

  if (isLoading) {
    return (
      <Container>
        <TitlePage title="View Incident Report" hasBack />
        <div className="space-y-4 mt-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </Container>
    );
  }

  if (!report) {
    return (
      <Container>
        <TitlePage title="View Incident Report" hasBack />
        <p className="text-center text-muted-foreground mt-10">
          Incident report not found
        </p>
      </Container>
    );
  }

  const colorStatus: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    investigating: "bg-blue-100 text-blue-800 border-blue-300",
    resolved: "bg-green-100 text-green-800 border-green-300",
  };

  const incidentTypeColors: Record<string, string> = {
    crime: "bg-red-50 border-red-200 text-red-700",
    accident: "bg-orange-50 border-orange-200 text-orange-700",
    dispute: "bg-yellow-50 border-yellow-200 text-yellow-700",
    noise: "bg-purple-50 border-purple-200 text-purple-700",
    fire: "bg-red-50 border-red-200 text-red-700",
    health: "bg-green-50 border-green-200 text-green-700",
    environmental: "bg-teal-50 border-teal-200 text-teal-700",
    other: "bg-gray-50 border-gray-200 text-gray-700",
  };

  return (
    <Container>
      <TitlePage title="View Incident Report" hasBack />

      <div className="mt-6 space-y-6">
        {/* Header Info */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FileText className="w-6 h-6 text-primary" />
                  {report.referenceNumber}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Reported on{" "}
                  {format(new Date(report.createdAt), "MMMM dd, yyyy")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`${colorStatus[report.status]} capitalize`}>
                  {report.status}
                </Badge>
                <EditStatus records={report} refetch={refetch} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Incident Type
              </h3>
              <div
                className={`inline-block px-4 py-2 rounded-lg border capitalize font-medium ${incidentTypeColors[report.incidentType] || incidentTypeColors.other}`}
              >
                {report.incidentType}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Description
              </h3>
              <p className="whitespace-pre-wrap bg-muted/50 p-4 rounded-lg">
                {report.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Location & Date */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <MapPin className="w-5 h-5" />
              Location & Date
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-sm text-blue-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </h3>
              <p className="text-blue-900">{report.location}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-sm text-blue-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date Occurred
              </h3>
              <p className="text-blue-900">
                {format(new Date(report.dateOccurred), "MMMM dd, yyyy")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Reporter Information */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <User className="w-5 h-5" />
              Reporter Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-sm text-green-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Name
              </h3>
              <p className="text-green-900">{report.reporterName}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-sm text-green-700 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Contact Number
              </h3>
              <p className="text-green-900">{report.reporterContact}</p>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        {report.images && report.images.length > 0 && (
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <ImageIcon className="w-5 h-5" />
                Evidence Images ({report.images.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {report.images.map((image: string, index: number) => (
                  <div
                    key={index}
                    className="relative group cursor-pointer overflow-hidden rounded-lg border-2 border-purple-200 hover:border-purple-400 transition-all"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image}
                      alt={`Evidence ${index + 1}`}
                      className="w-full h-48 object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Image Zoom Dialog */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Zoomed evidence"
              className="w-full h-full object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Page;
