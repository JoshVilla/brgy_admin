"use client";
import Container from "@/components/container";
import TitlePage from "@/components/titlePage";
import withAuth from "@/lib/withAuth";
import React from "react";

const page = () => {
  return (
    <Container>
      <TitlePage title="Lost and Found" />
    </Container>
  );
};

export default withAuth(page);
