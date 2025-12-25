"use client";

import CardCount from "@/components/cardCount";
import Container from "@/components/container";
import TitlePage from "@/components/titlePage";
import { getTotals } from "@/services/api";
import { formatDateTime } from "@/utils/nonAsyncHelpers";
import { useQuery } from "@tanstack/react-query";
import { Users, FileText, ShieldUser } from "lucide-react";
import { useEffect, useState } from "react";
import PopulationGraph from "./graphs/population";
import Graphs from "./graphs";

const page = () => {
  const [dateTime, setDateTime] = useState("");
  const { data, isLoading } = useQuery({
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
        <TitlePage title="Dashboard" />
        <div className="mt-6">Loading...</div>
      </Container>
    );
  }

  const events = data?.events || {};

  return (
    <Container>
      <TitlePage title="Dashboard" />

      {/* Philippine Time Display - Mobile */}
      <div className="font-bold text-lg text-center mt-4 lg:hidden">
        {dateTime}
        <span className="block text-sm font-normal text-gray-600">
          Philippine Time
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-6">
        {/* Left Section - Stats Cards */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex justify-center md:justify-start gap-2 md:gap-4 flex-wrap">
            <CardCount
              icon={Users}
              label="Total Residents"
              value={data?.totals.totalResidents}
            />

            <CardCount
              icon={ShieldUser}
              label="Total Admins"
              value={data?.totals.totalAdmins}
            />

            <CardCount
              icon={FileText}
              label="Requests This Month"
              value={data?.totals.totalRequestsThisMonth}
            />
          </div>

          <Graphs />

          {/* Events Section - Mobile (below cards) */}
          <div className="lg:hidden space-y-4">
            <div className="border rounded-lg p-4">
              <div className="font-bold text-lg mb-2">Today's Event</div>
              <div className="space-y-2">
                {events.currentEvents && events.currentEvents.length > 0 ? (
                  events.currentEvents.map((curr: any, index: number) => (
                    <div key={index} className="text-sm text-gray-500">
                      <p className="font-bold text-gray-800">{curr.title}</p>
                      <p>{curr.venue}</p>
                      <p>{formatDateTime(curr.datetime)}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">No Event</div>
                )}
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="font-bold text-lg mb-2">Next Event</div>
              <div className="space-y-2">
                {events.nextEvent ? (
                  <div className="text-sm text-gray-500">
                    <p className="font-bold text-gray-800">
                      {events.nextEvent.title}
                    </p>
                    <p>{events.nextEvent.venue}</p>
                    <p>{formatDateTime(events.nextEvent.datetime)}</p>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No Event</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Desktop Only */}
        <div className="hidden lg:block lg:col-start-5 space-y-6">
          {/* Philippine Time Display - Desktop */}
          <div className="font-bold text-lg text-center">
            {dateTime}
            <span className="block text-sm font-normal text-gray-600">
              Philippine Time
            </span>
          </div>

          {/* Events Section - Desktop */}
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="font-bold text-lg mb-2">Today's Event</div>
              <div className="space-y-2">
                {events.currentEvents && events.currentEvents.length > 0 ? (
                  events.currentEvents.map((curr: any, index: number) => (
                    <div key={index} className="text-sm text-gray-500">
                      <p className="font-bold text-gray-800">{curr.title}</p>
                      <p>{curr.venue}</p>
                      <p>{formatDateTime(curr.datetime)}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">No Event</div>
                )}
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="font-bold text-lg mb-2">Next Event</div>
              <div className="space-y-2">
                {events.nextEvent ? (
                  <div className="text-sm text-gray-500">
                    <p className="font-bold text-gray-800">
                      {events.nextEvent.title}
                    </p>
                    <p>{events.nextEvent.venue}</p>
                    <p>{formatDateTime(events.nextEvent.datetime)}</p>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No Event</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default page;
