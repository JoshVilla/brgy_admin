"use client";
import Container from "@/components/container";
import TitlePage from "@/components/titlePage";
import { Button } from "@/components/ui/button";
import withAuth from "@/lib/withAuth";
import { getLostAndFound } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
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
import { IResLostFound } from "@/utils/types";
import { formattedDate } from "@/utils/nonAsyncHelpers";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/paginationControl";
import { PenIcon } from "lucide-react";
import UpdateStatus from "./updateStatus";

const page = () => {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState({});
  const {currentPage, setCurrentPage, handlePageChange, totalPages} = usePagination()

  const goToAddItem = () => router.push("/admin/lostandfound/addItem");

  const {data, isLoading} = useQuery({
    queryKey: ["lostandfound", currentPage, searchParams],
    queryFn: () => getLostAndFound({ page: currentPage, limit: 10, filters: searchParams }),
  })

  const lostAndFoundData = data?.data || [];

  const tableHeaders = [
    "Item Name",
    "Item Type",
    "Status",
    "Date Lost",
    "Date Reported",
    "Actions",
  ]
  
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
        if (lostAndFoundData.length === 0) {
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
      
        return lostAndFoundData.map((data: IResLostFound) => (
            <TableRow key={data._id}>
                <TableCell>{data.item}</TableCell>
                <TableCell>{data.type}</TableCell>
                <TableCell>{data.status}</TableCell>
                <TableCell>{formattedDate(data.dateFound)}</TableCell>
                <TableCell>{formattedDate(data.createdAt)}</TableCell>
                <TableCell>
                  <div>
                   <UpdateStatus/>
                  </div>
                </TableCell>
            </TableRow>
        ))
  }
  return (
    <Container>
      <TitlePage
        title="Lost and Found"
        description="Manage lost and found items"
      />

      <div className="mt-6">
        <Button className="cursor-pointer mb-4" size={"sm"} onClick={goToAddItem}>
          Add Item
        </Button>

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

        {lostAndFoundData > 0 && (
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
