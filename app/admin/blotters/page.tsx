"use client";

import Container from "@/components/container";
import TitlePage from "@/components/titlePage";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Loader2,
  Pencil,
  EyeIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBlotters } from "@/services/api";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/paginationControl";
import SearchForm from "@/components/searchForm";
import { searchProps } from "./searchProps";

export interface Blotter {
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
  const router = useRouter();
  const [searchParams, setSearchParams] = useState({});

  const {
    currentPage,
    totalPages,
    setTotalPages,
    handlePageChange,
    setCurrentPage,
  } = usePagination();

  // Fetch blotters with TanStack Query
  const { data, isLoading } = useQuery({
    queryKey: ["blotters", searchParams],
    queryFn: () => getBlotters({ page: currentPage, ...searchParams }),
  });

  const total = data?.pagination?.total || 0;

  const goToAdd = () => {
    router.push("blotters/addBlotter");
  };

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
      month: "short",
      day: "numeric",
    });
  };

  const tableHeaders = [
    "Blotter No.",
    "Complainant",
    "Respondent",
    "Incident Type",
    "Incident Date",
    "Status",
    "Action",
  ];
  const blotterData = data?.data || [];

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
    if (data.length === 0) {
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
    return blotterData.map((data: Blotter) => (
      <TableRow key={data._id}>
        <TableCell>{data.blotterNo}</TableCell>
        <TableCell>{data.complainantName}</TableCell>
        <TableCell>{data.respondentName}</TableCell>
        <TableCell>{data.incidentType}</TableCell>
        <TableCell>{formatDate(data.incidentDate)}</TableCell>
        <TableCell>
          <Badge variant={getStatusVariant(data.status)}>{data.status}</Badge>
        </TableCell>
        <TableCell>
          <div className="flex gap-4">
            <EyeIcon
              className="w-4 h-4 text-blue-500 cursor-pointer hover:scale-110"
              onClick={() =>
                router.push(`/admin/blotters/viewBlotter/${data._id}`)
              }
            />
            <Pencil
              className="w-4 h-4 text-blue-500 cursor-pointer hover:scale-110"
              onClick={() =>
                router.push(`/admin/blotters/editBlotter/${data._id}`)
              }
            />
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  const handleSearch = (params: any) => {
    setSearchParams(params);
    setCurrentPage(1);
  };

  useEffect(() => {
    setTotalPages(data?.pagination.total);
  }, [data]);

  return (
    <Container>
      <TitlePage title="Blotters" />

      {/* Actions and Filters */}
      <div className="mt-6 space-y-4">
        <div className="flex justify-between items-center">
          <Button onClick={goToAdd} size="sm" className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Add Blotter
          </Button>

          <div className="text-sm text-muted-foreground">
            Total: {total} entries
          </div>
        </div>

        {/* Filters */}
        <SearchForm searchProps={searchProps} onSearch={handleSearch} />
        <div>
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

        {blotterData.length > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </Container>
  );
};

export default Page;
