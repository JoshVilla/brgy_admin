"use client";
import Container from "@/components/container";
import TitlePage from "@/components/titlePage";
import { getActivity } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect } from "react";
import { usePagination } from "@/hooks/usePagination";
import { IResActivityLog } from "@/utils/types";
import { formattedDate } from "@/utils/nonAsyncHelpers";
import { PaginationControls } from "@/components/paginationControl";
import { Calendar, User, FileText } from "lucide-react";

const page = () => {
  const {
    currentPage,
    totalPages,
    setTotalPages,
    handlePageChange,
    setCurrentPage,
    limit,
    handleLimitChange,
  } = usePagination();
  const { data, isLoading } = useQuery({
    queryKey: ["activity", currentPage, limit],
    queryFn: () => getActivity({ page: currentPage, limit }),
  });

  useEffect(() => {
    setTotalPages(data?.totalPages);
  }, [data]);

  const activityLog = data?.data || [];
  const tableHeaders = ["Activity", "Action", "Page", "Modified By", "Date"];

  // Get badge variant and color based on action
  const getActionBadge = (action: string) => {
    switch (action) {
      case "Add":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white">
            Add
          </Badge>
        );
      case "Edit":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
            Edit
          </Badge>
        );
      case "Delete":
        return (
          <Badge className="bg-red-500 hover:bg-red-600 text-white">
            Delete
          </Badge>
        );
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

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
    if (activityLog.length === 0) {
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

    return activityLog.map((activity: IResActivityLog) => (
      <TableRow key={activity._id}>
        <TableCell className="max-w-64 truncate">{activity.activity}</TableCell>
        <TableCell>{getActionBadge(activity.action)}</TableCell>
        <TableCell>{activity.page}</TableCell>
        <TableCell>{activity.name}</TableCell>
        <TableCell>{formattedDate(activity.createdAt)}</TableCell>
      </TableRow>
    ));
  };

  const renderMobileCards = () => {
    if (isLoading) {
      return (
        <div className="text-center text-md text-gray-500 py-10">
          Loading...
        </div>
      );
    }
    if (activityLog.length === 0) {
      return (
        <div className="text-center text-lg text-gray-500 py-10">No data</div>
      );
    }

    return activityLog.map((activity: IResActivityLog) => (
      <Card key={activity._id} className="mb-3">
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Activity & Action */}
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium flex-1">{activity.activity}</p>
              {getActionBadge(activity.action)}
            </div>

            {/* Page */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              <span>{activity.page}</span>
            </div>

            {/* Modified By */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{activity.name}</span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate(activity.createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <Container>
      <TitlePage title="Activity Logs" />

      <div className="my-6">
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table className="mt-6">
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

        {/* Mobile Card View */}
        <div className="md:hidden">{renderMobileCards()}</div>

        {activityLog.length > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            limit={limit}
            onLimitChange={handleLimitChange}
          />
        )}
      </div>
    </Container>
  );
};

export default page;
