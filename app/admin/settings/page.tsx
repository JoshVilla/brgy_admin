"use client";
import Container from "@/components/container";
import TitlePage from "@/components/titlePage";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, FileText } from "lucide-react";
import RequestSettings from "./requestSettings";
import GeneralSettings from "./generalSettings";

const page = () => {
  return (
    <Container>
      <TitlePage title="Settings" />

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="request" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Request
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="request" className="mt-6">
          <RequestSettings />
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default page;
