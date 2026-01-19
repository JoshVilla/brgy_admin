"use client";
import Container from "@/components/container";
import TitlePage from "@/components/titlePage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePagination } from "@/hooks/usePagination";
import { getLegislative } from "@/services/api";
import { formattedDate } from "@/utils/nonAsyncHelpers";
import { IResLegislative } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { Download, Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import DeleteLegislative from "./deleteLegislative";
import withAuth from "@/lib/withAuth";
import { toast } from "sonner";

const LegislativePage = () => {
  const route = useRouter();
  const {
    currentPage,
    totalPages,
    setTotalPages,
    handlePageChange,
    setCurrentPage,
  } = usePagination();
  const [searchParams, setSearchParams] = useState({});
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["legislative", currentPage, searchParams],
    queryFn: () => getLegislative({ page: currentPage, ...searchParams }),
  });

  const goToAdd = () => {
    route.push("/admin/legislatives/addLegislative");
  };

  const handleDownload = async (legislative: IResLegislative) => {
    try {
      toast.loading("Downloading...");

      const response = await fetch(legislative.file);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${legislative.title} (${legislative.orderNumber}).pdf`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.dismiss();
      toast.success("Downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.dismiss();
      toast.error("Failed to download PDF");
    }
  };

  const legislativeData = data?.data || [];

  const tableHeaders = [
    "Title",
    "Order Number",
    "Type",
    "Status",
    "Date Approved",
    "Effective Date",
    "Actions",
  ];

  const renderTableRows = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell
            className="text-center text-md text-gray-500 my-10"
            colSpan={tableHeaders.length}
          >
            Loading...
          </TableCell>
        </TableRow>
      );
    }
    if (legislativeData.length === 0) {
      return (
        <TableRow>
          <TableCell
            className="text-center text-lg text-gray-500 my-10"
            colSpan={tableHeaders.length}
          >
            No data
          </TableCell>
        </TableRow>
      );
    }

    return legislativeData.map((data: IResLegislative) => (
      <TableRow key={data._id}>
        <TableCell>{data.title}</TableCell>
        <TableCell>{data.orderNumber}</TableCell>
        <TableCell>{data.legislativeType}</TableCell>
        <TableCell>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              data.status === "Approved"
                ? "bg-green-100 text-green-800"
                : data.status === "Implemented"
                  ? "bg-blue-100 text-blue-800"
                  : data.status === "Draft"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {data.status}
          </span>
        </TableCell>
        <TableCell>{formattedDate(data.dateApproved)}</TableCell>
        <TableCell>{formattedDate(data.effectiveDate)}</TableCell>
        <TableCell>
          <div className="flex gap-3">
            <Download
              className="w-4 h-4 text-purple-500 cursor-pointer hover:scale-110"
              onClick={() => handleDownload(data)}
            />
            <Pencil
              className="w-4 h-4 text-blue-500 cursor-pointer hover:scale-110"
              onClick={() =>
                route.push(`/admin/legislatives/editLegislative/${data._id}`)
              }
            />
            <DeleteLegislative
              id={data._id}
              refetch={refetch}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  const renderMobileCards = () => {
    if (isLoading) {
      return (
        <div className="text-center text-md text-gray-500 my-10">
          Loading...
        </div>
      );
    }

    if (legislativeData.length === 0) {
      return (
        <div className="text-center text-lg text-gray-500 my-10">No data</div>
      );
    }

    return legislativeData.map((legislative: IResLegislative) => (
      <Card key={legislative._id} className="mb-4">
        <CardContent className="pt-6">
          <div className="space-y-3">
            {/* Title and Order Number */}
            <div>
              <h3 className="font-semibold text-lg mb-1">
                {legislative.title}
              </h3>
              <p className="text-sm text-gray-600">{legislative.orderNumber}</p>
            </div>

            {/* Type and Status */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Type</p>
                <p className="text-sm font-medium">
                  {legislative.legislativeType}
                </p>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    legislative.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : legislative.status === "Implemented"
                        ? "bg-blue-100 text-blue-800"
                        : legislative.status === "Draft"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {legislative.status}
                </span>
              </div>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Date Approved</p>
                <p className="text-sm">
                  {formattedDate(legislative.dateApproved)}
                </p>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Effective Date</p>
                <p className="text-sm">
                  {formattedDate(legislative.effectiveDate)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleDownload(legislative)}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() =>
                  route.push(
                    `/admin/legislatives/editLegislative/${legislative._id}`,
                  )
                }
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <div className="flex-1 border rounded-lg flex justify-center items-center gap-2">
                <DeleteLegislative
                  id={legislative._id}
                  refetch={refetch}
                  setCurrentPage={setCurrentPage}
                />
                <span>Delete</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <Container>
      <TitlePage title="Legislatives" />
      <Button size="sm" className="my-6" onClick={goToAdd}>
        <Plus /> Add Legislative
      </Button>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table>
          <TableHeader className="bg-slate-800">
            <TableRow>
              {tableHeaders.map((header, index) => (
                <TableHead key={index} className="text-white">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>{renderTableRows()}</TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">{renderMobileCards()}</div>
    </Container>
  );
};

export default withAuth(LegislativePage);
