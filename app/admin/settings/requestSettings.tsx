"use client";

import Container from "@/components/container";
import { getSettings, updateRequestSettings } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Save, FileText, Plus, X, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const RequestSettings = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => getSettings({}),
  });

  const [editingRequest, setEditingRequest] = useState<number | null>(null);
  const [newRequirement, setNewRequirement] = useState("");
  const [localSettings, setLocalSettings] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (requestData: any[]) =>
      updateRequestSettings({ request: requestData }),
    onSuccess: (response) => {
      if (response.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["settings"] });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        toast.success("Settings updated successfully");
      } else {
        toast.error(response.message || "Failed to update settings");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update settings");
    },
  });

  // Update local settings when data is loaded
  React.useEffect(() => {
    if (data?.data?.request) {
      setLocalSettings(data.data.request);
    }
  }, [data]);

  const handleToggleEnabled = (requestId: number) => {
    setLocalSettings((prev: any) =>
      prev.map((req: any) =>
        req.id === requestId ? { ...req, enabled: !req.enabled } : req
      )
    );
  };

  const handleServiceFeeChange = (requestId: number, value: string) => {
    setLocalSettings((prev: any) =>
      prev.map((req: any) =>
        req.id === requestId
          ? { ...req, serviceFee: parseFloat(value) || 0 }
          : req
      )
    );
  };

  const handleAddRequirement = (requestId: number) => {
    if (!newRequirement.trim()) return;

    setLocalSettings((prev: any) =>
      prev.map((req: any) =>
        req.id === requestId
          ? {
              ...req,
              requirements: [...req.requirements, newRequirement.trim()],
            }
          : req
      )
    );
    setNewRequirement("");
  };

  const handleRemoveRequirement = (requestId: number, index: number) => {
    setLocalSettings((prev: any) =>
      prev.map((req: any) =>
        req.id === requestId
          ? {
              ...req,
              requirements: req.requirements.filter(
                (_: any, i: number) => i !== index
              ),
            }
          : req
      )
    );
  };

  const handleSave = async () => {
    await updateMutation.mutateAsync(localSettings);
  };

  if (isLoading) {
    return (
      <Container>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    );
  }

  if (!localSettings) {
    return (
      <Container>
        <Alert>
          <AlertDescription>No settings found</AlertDescription>
        </Alert>
      </Container>
    );
  }

  const enabledCount = localSettings.filter((req: any) => req.enabled).length;
  const disabledCount = localSettings.length - enabledCount;

  return (
    <Container>
      <div className="space-y-6">
        {/* Success Alert */}
        {saved && (
          <Alert className="bg-green-50 text-green-900 border-green-200">
            <AlertDescription className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Settings saved successfully
            </AlertDescription>
          </Alert>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Request Types</CardDescription>
              <CardTitle className="text-3xl">{localSettings.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Available</CardDescription>
              <CardTitle className="text-3xl text-green-600">
                {enabledCount}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Disabled</CardDescription>
              <CardTitle className="text-3xl text-muted-foreground">
                {disabledCount}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Request Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {localSettings.map((request: any) => (
            <Card
              key={request.id}
              className={`flex flex-col ${
                !request.enabled ? "opacity-60" : ""
              }`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 min-w-0">
                    <FileText
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        request.enabled
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                    <div className="min-w-0">
                      <CardTitle className="text-base leading-tight">
                        {request.name}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">
                        ID: {request.id}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <Badge
                      variant={request.enabled ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {request.enabled ? "Available" : "Disabled"}
                    </Badge>
                    <Switch
                      checked={request.enabled}
                      onCheckedChange={() => handleToggleEnabled(request.id)}
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 flex-1">
                {/* Service Fee */}
                <div className="space-y-2">
                  <Label htmlFor={`fee-${request.id}`} className="text-sm">
                    Service Fee (₱)
                  </Label>
                  <Input
                    id={`fee-${request.id}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={request.serviceFee}
                    onChange={(e) =>
                      handleServiceFeeChange(request.id, e.target.value)
                    }
                    disabled={!request.enabled}
                    className="w-full"
                  />
                </div>

                {/* Requirements */}
                <div className="space-y-2">
                  <Label className="text-sm">Requirements</Label>

                  {request.requirements.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {request.requirements.map(
                        (req: string, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="gap-1.5 py-1 px-2 text-xs"
                          >
                            <span className="truncate max-w-[150px]">
                              {req}
                            </span>
                            {request.enabled && (
                              <button
                                onClick={() =>
                                  handleRemoveRequirement(request.id, index)
                                }
                                className="hover:text-destructive transition-colors flex-shrink-0"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </Badge>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      No requirements yet
                    </p>
                  )}

                  {request.enabled && editingRequest === request.id && (
                    <div className="flex gap-2 mt-2">
                      <Input
                        type="text"
                        value={newRequirement}
                        onChange={(e) => setNewRequirement(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleAddRequirement(request.id);
                          }
                        }}
                        placeholder="e.g., Valid ID"
                        className="flex-1 h-8 text-sm"
                      />
                      <Button
                        onClick={() => handleAddRequirement(request.id)}
                        size="sm"
                        className="h-8 px-3"
                      >
                        Add
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingRequest(null);
                          setNewRequirement("");
                        }}
                        variant="outline"
                        size="sm"
                        className="h-8 px-3"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                  {request.enabled && editingRequest !== request.id && (
                    <Button
                      onClick={() => setEditingRequest(request.id)}
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 h-8 text-xs mt-2 w-full"
                    >
                      <Plus className="w-3 h-3" />
                      Add Requirement
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            size="lg"
            className="gap-2"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default RequestSettings;
