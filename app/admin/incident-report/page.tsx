"use client";
import Container from "@/components/container";
import TitlePage from "@/components/titlePage";
import { Button } from "@/components/ui/button";
import { getIncidentReport } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { Eye, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useState } from "react";
import { IResIncidentReport } from "@/utils/types";
import { Badge } from "@/components/ui/badge";
import SearchForm from "@/components/searchForm";
import { searchProps } from "./searchProps";
import { usePagination } from "@/hooks/usePagination";
import EditStatus from "./editStatus";
import { formattedDate } from "@/utils/nonAsyncHelpers";

const page = () => {
  const router = useRouter();
  const {
    currentPage,
    totalPages,
    setTotalPages,
    handlePageChange,
    setCurrentPage,
    limit,
    handleLimitChange,
  } = usePagination();
  const [searchParams, setSearchParams] = useState([]);
  const gotToAdd = () => {
    router.push("/admin/incident-report/addIncidentReport");
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["incident", searchParams, currentPage],
    queryFn: () =>
      getIncidentReport({ page: currentPage, limit, ...searchParams }),
  });
  const colorStatus: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    investigating: "bg-blue-100 text-blue-800 border-blue-300",
    resolved: "bg-green-100 text-green-800 border-green-300",
  };

  const handleSearch = (params: any) => {
    setSearchParams(params);
    setCurrentPage(1);
  };

  const incidentData = data?.data || [];

  const tableHeaders = [
    "Incident Id",
    "Reporter Name",
    "Reporter Contact",
    "Incident Type",
    "Status",
    "Date Happened",
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
    if (!isLoading && incidentData.length === 0) {
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

    return incidentData.map((data: IResIncidentReport) => (
      <TableRow key={data._id}>
        <TableCell>{data.referenceNumber}</TableCell>
        <TableCell>{data.reporterName}</TableCell>
        <TableCell>{data.reporterContact}</TableCell>
        <TableCell>{data.incidentType}</TableCell>
        <TableCell>
          <Badge className={`${colorStatus[data.status]} capitalize`}>
            {data.status}
          </Badge>
        </TableCell>
        <TableCell>{formattedDate(data.createdAt)}</TableCell>
        <TableCell className="flex gap-4">
          <EditStatus records={data} refetch={refetch} />
          <Eye
            className="w-4 h-4 text-blue-500 cursor-pointer hover:scale-110"
            onClick={() =>
              router.push(
                `/admin/incident-report/viewIncidentReport/${data._id}`,
              )
            }
          />
        </TableCell>
      </TableRow>
    ));
  };
  return (
    <Container>
      <TitlePage
        title="Incident Reports"
        description="Manage and review reported incidents within the barangay for proper documentation and action."
      />

      <div className="mt-6">
        <Button size="sm" className="cursor-pointer mb-6" onClick={gotToAdd}>
          <Plus />
          Add Report
        </Button>

        <SearchForm searchProps={searchProps} onSearch={handleSearch} />

        {/* Desktop View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                {tableHeaders.map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>{renderTableRows()}</TableBody>
          </Table>
        </div>
      </div>
    </Container>
  );
};

export default page;
