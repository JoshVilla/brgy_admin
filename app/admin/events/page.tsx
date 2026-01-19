"use client";
import TitlePage from "@/components/titlePage";
import { Button } from "@/components/ui/button";
import { getEvent } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { motion } from "framer-motion";
import { IResEvent } from "@/utils/types";
import { formatDateTime } from "@/utils/nonAsyncHelpers";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/paginationControl";
import SearchForm from "@/components/searchForm";
import { searchProps } from "./searchProps";
import DeleteEvent from "./deleteResident";
import withAuth from "@/lib/withAuth";
import { IEvent } from "@/models/eventModel";
import Container from "@/components/container";
const page = () => {
  const router = useRouter();
  const {
    currentPage,
    totalPages,
    setTotalPages,
    handlePageChange,
    setCurrentPage,
  } = usePagination();
  const [searchParams, setSearchParams] = useState({});

  const gotToAddEvent = () => {
    router.push("/admin/events/addEvent");
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["event", currentPage, searchParams],
    queryFn: () => getEvent({ page: currentPage, ...searchParams }),
  });

  const eventData = data?.data || [];

  const tableHeaders = ["Title", "Venue", "Date", "Actions"];

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
    return eventData.map((data: IResEvent) => (
      <TableRow key={data._id}>
        <TableCell>{`${data.title}`}</TableCell>
        <TableCell>{`${data.venue}`}</TableCell>
        <TableCell>{`${formatDateTime(data.datetime)}`}</TableCell>
        <TableCell>
          <div className="flex gap-4">
            <DeleteEvent
              id={data._id}
              refetch={refetch}
              setCurrentPage={setCurrentPage}
            />
            <Pencil
              className="w-4 h-4 text-blue-500 cursor-pointer hover:scale-110"
              onClick={() => router.push(`/admin/events/editEvent/${data._id}`)}
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
    setTotalPages(data?.totalPages);
  }, [data]);
  return (
    <Container>
      <TitlePage title="Events" />
      <div className="my-6">
        <Button className="cursor-pointer" size="sm" onClick={gotToAddEvent}>
          {" "}
          <Plus />
          Add Event
        </Button>

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
            {!isLoading && eventData.length === 0 && (
              <div className="text-center mt-6 text-gray-500">No Data</div>
            )}

            {/* Event Cards */}
            {!isLoading &&
              eventData.length > 0 &&
              eventData.map((event: IResEvent, index: number) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                    delay: index * 0.1,
                  }}
                >
                  <Card>
                    <CardContent>
                      <div className="text-sm space-y-2">
                        <div>
                          <span className="font-semibold">Title: </span>
                          <span>{event.title}</span>
                        </div>
                        <div>
                          <span className="font-semibold">Venue: </span>
                          <span>{event.venue}</span>
                        </div>
                        <div>
                          <span className="font-semibold">Date: </span>
                          <span>{formatDateTime(event.datetime)}</span>
                        </div>
                        <div className="flex gap-4 mt-4">
                          <DeleteEvent
                            id={event._id}
                            refetch={refetch}
                            setCurrentPage={setCurrentPage}
                          />
                          <Pencil
                            className="w-4 h-4 text-blue-500 cursor-pointer hover:scale-110"
                            onClick={() =>
                              router.push(
                                `/admin/events/editEvent/${event._id}`,
                              )
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>

          {eventData.length > 0 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </Container>
  );
};

export default withAuth(page);
