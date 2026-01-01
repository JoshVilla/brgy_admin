"use client";

import Container from "@/components/container";
import TitlePage from "@/components/titlePage";
import { getAnalytics } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, FileText } from "lucide-react";
import React, { useEffect, useState } from "react";
import ResidentsPage from "./residents";
import RequestPage from "./request";

const page = () => {
  return (
    <Container>
      <Tabs defaultValue="residents" className="w-full mt-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger
            value="residents"
            className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white cursor-pointer"
          >
            <Users className="w-4 h-4" />
            Residents
          </TabsTrigger>
          <TabsTrigger
            value="requests"
            className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            Requests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="residents" className="mt-6">
          <ResidentsPage />
        </TabsContent>
        <TabsContent value="requests" className="mt-6">
          <RequestPage />
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default page;
