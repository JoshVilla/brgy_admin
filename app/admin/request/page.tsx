"use client";
import TitlePage from "@/components/titlePage";
import { usePagination } from "@/hooks/usePagination";
import { getRequest } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { IResRequest } from "@/utils/types";
import { formattedDate, requestTypeText } from "@/utils/nonAsyncHelpers";
import SearchForm from "@/components/searchForm";
import { searchProps } from "./searchProps";
import UpdateRequest from "./updateRequest";
import { motion } from "framer-motion";
import { STATUS } from "@/utils/constant";
import { PaginationControls } from "@/components/paginationControl";
import withAuth from "@/lib/withAuth";
import { Loader2 } from "lucide-react";
import Container from "@/components/container";
import RequestStatus from "@/components/requestStatus";

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

  const [searchParams, setSearchParams] = useState({});
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["request", currentPage, searchParams, limit],
    queryFn: () => getRequest({ page: currentPage, limit, ...searchParams }),
  });

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
    if (requestData.length === 0) {
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
    return requestData.map((data: IResRequest) => (
      <TableRow key={data._id}>
        <TableCell>{`${data.name}`}</TableCell>
        <TableCell>{`${requestTypeText(data.type)}`}</TableCell>
        <TableCell>
          <RequestStatus status={data.status} />
        </TableCell>
        <TableCell>{formattedDate(data.createdAt)}</TableCell>
        <TableCell>
          <div className="flex gap-4">
            {(data.status === STATUS.PENDING ||
              data.status === STATUS.PROCESSING) && (
              <UpdateRequest record={data} refetch={refetch} />
            )}
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  const tableHeaders = [
    "Name",
    "Request for",
    "Status",
    "Requested last",
    "Actions",
  ];
  const requestData = data?.data || [];

  const handleSearch = (params: any) => {
    setSearchParams(params);
    setCurrentPage(1);
  };

  useEffect(() => {
    setTotalPages(data?.totalPages);
  }, [data]);

  return (
    <Container>
      <TitlePage title="Requests" />
      <div>
        <SearchForm searchProps={searchProps} onSearch={handleSearch} />

        {/* Desktop View */}
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

        {/* Mobile View */}
        <div className="block md:hidden space-y-6 mt-6">
          {/* Loader */}
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-4">
              <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
              <span>Loading Data...</span>
            </div>
          )}

          {/* No Data */}
          {!isLoading && requestData.length === 0 && (
            <div className="text-center mt-6 text-gray-500">No Data</div>
          )}

          {/* Request Cards */}
          {!isLoading &&
            requestData.length > 0 &&
            requestData.map((data: IResRequest, index: number) => (
              <motion.div
                key={data._id} // stable key
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                  delay: index * 0.1, // stagger fade-in
                }}
              >
                <Card>
                  <CardContent>
                    <div className="text-sm space-y-1">
                      <div>
                        <span className="font-bold">Name: </span>
                        <span>{data.name}</span>
                      </div>
                      <div>
                        <span className="font-bold">Request for: </span>
                        <span>{requestTypeText(data.type)}</span>
                      </div>

                      <div>
                        <span className="font-bold">Requested last: </span>
                        <span>{formattedDate(data.createdAt)}</span>
                      </div>
                      <div>
                        <span className="font-bold">Status: </span>
                        <span>
                          <RequestStatus status={data.status} />
                        </span>
                      </div>
                      <div className="flex gap-4 mt-2">
                        {(data.status === STATUS.PENDING ||
                          data.status === STATUS.PROCESSING) && (
                          <UpdateRequest record={data} refetch={refetch} />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </div>

        {requestData.length > 0 && (
          <PaginationControls
            limit={limit}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        )}
      </div>
    </Container>
  );
};

export default withAuth(page);
