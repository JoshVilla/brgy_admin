"use client";
import TitlePage from "@/components/titlePage";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import withAuth from "@/lib/withAuth";
import React from "react";

const page = () => {
  return (
    <div>
      <TitlePage title="Dashboard" />
      <Avatar>
        <AvatarImage src={"/public/admin_avatar.avif"} alt={"username"} />
      </Avatar>
    </div>
  );
};

export default withAuth(page);
