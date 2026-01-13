"use client";

import CardCount from "@/components/cardCount";
import Container from "@/components/container";
import TitlePage from "@/components/titlePage";
import { getTotals } from "@/services/api";
import { formatDateTime } from "@/utils/nonAsyncHelpers";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  FileText,
  ShieldUser,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import Graphs from "./graphs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import NewRequest from "./newRequest";
import { IResRequest } from "@/utils/types";

const Page = () => {
  const [dateTime, setDateTime] = useState("");
  const [newRequest, setNewRequest] = useState<IResRequest[]>([]);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["counts"],
    queryFn: () => getTotals({}),
  });

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const formatted = now.toLocaleString("en-PH", {
        timeZone: "Asia/Manila",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      setDateTime(formatted);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-500">Loading dashboard...</p>
          </div>
        </div>
      </Container>
    );
  }

  const events = data?.events || {};
  const requests = data?.requests || [];

  return (
    <Container>
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <TitlePage title="Dashboard" />
          <p className="text-gray-500 mt-1">
            Welcome back! Here's your overview
          </p>
        </div>

        {/* Time Badge */}
        <Card className="lg:w-auto">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">{dateTime}</p>
                <p className="text-xs text-gray-500">Philippine Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-8 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Residents
                </CardTitle>
                <Users className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {data?.totals.totalResidents || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Registered residents
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Admins
                </CardTitle>
                <ShieldUser className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {data?.totals.totalAdmins || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Active administrators
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Requests This Month
                </CardTitle>
                <FileText className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {data?.totals.totalRequestsThisMonth || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Certificate requests
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Graphs Section */}
          <Card>
            <CardHeader>
              <CardTitle>New Request</CardTitle>
              <CardDescription>Check new request</CardDescription>
            </CardHeader>
            <CardContent>
              <NewRequest request={requests} refetch={refetch} />
            </CardContent>
          </Card>
        </div>

        {/* Events Sidebar - Right Side */}
        <div className="lg:col-span-4 space-y-6">
          {/* Today's Events */}
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-blue-900">Today's Events</CardTitle>
              </div>
              <CardDescription>Current events happening today</CardDescription>
            </CardHeader>
            <CardContent>
              {events.currentEvents && events.currentEvents.length > 0 ? (
                <div className="space-y-4">
                  {events.currentEvents.map((curr: any, index: number) => (
                    <div
                      key={index}
                      className="p-4 bg-white rounded-lg border border-blue-100 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {curr.title}
                          </h4>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{curr.venue}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="h-3 w-3" />
                              <span>{formatDateTime(curr.datetime)}</span>
                            </div>
                          </div>
                          <Badge className="mt-2 bg-blue-500">Active</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No events today</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Check back later for updates
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-purple-900">Next Event</CardTitle>
              </div>
              <CardDescription>Upcoming scheduled event</CardDescription>
            </CardHeader>
            <CardContent>
              {events.nextEvent ? (
                <div className="p-4 bg-white rounded-lg border border-purple-100 hover:border-purple-300 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {events.nextEvent.title}
                      </h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">
                            {events.nextEvent.venue}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-3 w-3" />
                          <span>
                            {formatDateTime(events.nextEvent.datetime)}
                          </span>
                        </div>
                      </div>
                      <Badge className="mt-2 bg-purple-500">Upcoming</Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">
                    No upcoming events
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Stay tuned for announcements
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default Page;
