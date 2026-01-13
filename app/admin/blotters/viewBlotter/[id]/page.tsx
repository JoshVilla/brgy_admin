"use client";

import Container from "@/components/container";
import TitlePage from "@/components/titlePage";
import { getBlotters } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  User,
  Users,
  FileText,
  Shield,
  Clock,
  Loader2,
  Edit,
} from "lucide-react";
import withAuth from "@/lib/withAuth";

interface Blotter {
  _id: string;
  blotterNo: string;
  incidentType: string;
  incidentDate: string;
  location: string;
  complainantName: string;
  respondentName: string;
  narrative: string;
  status: "ONGOING" | "FOR_HEARING" | "SETTLED" | "REFERRED";
  officerInCharge: string;
  createdAt: string;
  updatedAt: string;
}

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const blotterId = params.id as string;

  // Fetch blotter by ID
  const { data, isLoading } = useQuery({
    queryKey: ["blotter", blotterId],
    queryFn: () => getBlotters({ id: blotterId }),
    enabled: !!blotterId,
  });

  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      ONGOING: "default",
      FOR_HEARING: "secondary",
      SETTLED: "outline",
      REFERRED: "destructive",
    };
    return variants[status] || "default";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <Container>
        <TitlePage title="View Blotter" hasBack />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Container>
    );
  }

  if (!data?.success || !data?.data) {
    return (
      <Container>
        <TitlePage title="View Blotter" hasBack />
        <Card className="mt-6">
          <CardContent className="py-12 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              Blotter not found
            </p>
          </CardContent>
        </Card>
      </Container>
    );
  }

  const blotter: Blotter = data.data[0];

  return (
    <Container>
      <TitlePage title="View Blotter" hasBack />

      <div className="mt-6 space-y-6">
        {/* Header Card with Actions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">Blotter Details</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Case Number: {blotter.blotterNo}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={getStatusVariant(blotter.status)}
                  className="text-sm py-2 px-4"
                >
                  {blotter.status}
                </Badge>
                <Button
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/admin/blotters/editBlotter/${blotterId}`)
                  }
                  size="sm"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Incident Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Incident Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span className="font-medium">Incident Type</span>
                </div>
                <p className="text-base pl-6">{blotter.incidentType}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Incident Date</span>
                </div>
                <p className="text-base pl-6">
                  {formatDate(blotter.incidentDate)}
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">Location</span>
                </div>
                <p className="text-base pl-6">{blotter.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parties Involved */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Parties Involved</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Complainant */}
              <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <User className="w-4 h-4" />
                  <span>Complainant</span>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="text-base font-medium mt-1">
                    {blotter.complainantName}
                  </p>
                </div>
              </div>

              {/* Respondent */}
              <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Users className="w-4 h-4" />
                  <span>Respondent</span>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="text-base font-medium mt-1">
                    {blotter.respondentName}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Narrative */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Incident Narrative</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="text-base leading-relaxed whitespace-pre-wrap">
                {blotter.narrative}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Case Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Case Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Officer in Charge</span>
                </div>
                <p className="text-base pl-6">{blotter.officerInCharge}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">Case Status</span>
                </div>
                <div className="pl-6">
                  <Badge variant={getStatusVariant(blotter.status)}>
                    {blotter.status}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timestamps */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  Created: {formatDate(blotter.createdAt)} at{" "}
                  {formatTime(blotter.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  Last Updated: {formatDate(blotter.updatedAt)} at{" "}
                  {formatTime(blotter.updatedAt)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default withAuth(Page);
