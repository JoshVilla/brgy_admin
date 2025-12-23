"use client";
import TitlePage from "@/components/titlePage";
import { Button } from "@/components/ui/button";
import { getAnnouncement } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { IResAnnouncement } from "@/utils/types";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/paginationControl";
import { motion } from "framer-motion";
import DeleteEvent from "./deleteAnnouncement";
import withAuth from "@/lib/withAuth";
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
  const gotToAddAnnouncement = () => {
    router.push("/admin/announcements/addAnnouncement");
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["announcement", currentPage],
    queryFn: () => getAnnouncement({ page: currentPage }),
  });

  const announcementData = data?.data || [];

  const tableHeaders = ["Announcement", "Showing"];

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
    return announcementData.map((data: IResAnnouncement) => (
      <TableRow key={data._id}>
        <TableCell>{`${data.announcement}`}</TableCell>
        <TableCell>{`${data.isViewed ? "✓" : "✗"}`}</TableCell>
        <TableCell>
          <div className="flex gap-4">
            <DeleteEvent
              id={data._id}
              refetch={refetch}
              setCurrentPage={setCurrentPage}
            />
            <Pencil
              className="w-4 h-4 text-blue-500 cursor-pointer hover:scale-110"
              onClick={() =>
                router.push(`/admin/announcements/editAnnouncement/${data._id}`)
              }
            />
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  useEffect(() => {
    setTotalPages(data?.totalPages);
  }, [data]);
  return (
    <Container>
      <TitlePage title="Announcements" />
      <div className="my-6">
        <Button
          className="cursor-pointer"
          size="sm"
          onClick={gotToAddAnnouncement}
        >
          {" "}
          <Plus />
          Add Announcement
        </Button>

        {/* Desktop View */}
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
          {!isLoading && announcementData.length === 0 && (
            <div className="text-center mt-6 text-gray-500">No Data</div>
          )}

          {/* Announcement Cards */}
          {!isLoading &&
            announcementData.length > 0 &&
            announcementData.map(
              (announcement: IResAnnouncement, index: number) => (
                <motion.div
                  key={announcement._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                    delay: index * 0.1, // staggered fade-in
                  }}
                >
                  <Card>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-semibold">Title: </span>
                          <span>{announcement.announcement}</span>
                        </div>
                        <div>
                          <span className="font-semibold">Showing: </span>
                          <span>{announcement.isViewed ? "✓" : "✗"}</span>
                        </div>
                        <div className="flex gap-4 mt-4">
                          <DeleteEvent
                            id={announcement._id}
                            refetch={refetch}
                            setCurrentPage={setCurrentPage}
                          />
                          <Pencil
                            className="w-4 h-4 text-blue-500 cursor-pointer hover:scale-110"
                            onClick={() =>
                              router.push(
                                `/admin/announcements/editAnnouncement/${announcement._id}`
                              )
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            )}
        </div>
        {announcementData.length > 0 && (
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

export default withAuth(page);
