"use client";
import TitlePage from "@/components/titlePage";
import { Button } from "@/components/ui/button";
import { getResident } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheckIcon, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
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
import { IResResident } from "@/utils/types";
import DeleteResident from "./deleteResident";
import { PaginationControls } from "@/components/paginationControl";
import { usePagination } from "@/hooks/usePagination";
import SearchForm from "@/components/searchForm";
import { motion } from "framer-motion";
import { searchProps } from "./searchProps";
import { calculateAge } from "@/utils/helpers";
import withAuth from "@/lib/withAuth";
import { useAuthGuard } from "@/hooks/authGuard";
import Container from "@/components/container";
import { Badge } from "@/components/ui/badge";
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
  const [searchParams, setSearchParams] = useState({});
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["residents", currentPage, searchParams, limit],
    queryFn: () => getResident({ page: currentPage, limit, ...searchParams }),
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
    return residentData.map((data: IResResident) => (
      <TableRow key={data._id}>
        <TableCell>{`${data.firstname} ${data.middlename} ${data.lastname} ${
          data.suffix || ""
        }`}</TableCell>
        <TableCell>{`${data.gender}`}</TableCell>
        <TableCell>{calculateAge(data.birthdate)}</TableCell>
        <TableCell>{`${data.purok}`}</TableCell>
        <TableCell>
          {data.isVerified ? (
            <Badge
              variant="secondary"
              className="bg-blue-500 text-white dark:bg-blue-600"
            >
              <BadgeCheckIcon /> Verified
            </Badge>
          ) : (
            <Badge variant="secondary">Not Verified</Badge>
          )}
        </TableCell>
        <TableCell>
          <div className="flex gap-4">
            <DeleteResident
              id={data._id}
              refetch={refetch}
              setCurrentPage={setCurrentPage}
            />
            <Pencil
              className="w-4 h-4 text-blue-500 cursor-pointer hover:scale-110"
              onClick={() =>
                router.push(
                  `/admin/resident-management/editResident/${data._id}`
                )
              }
            />
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  const tableHeaders = [
    "Name",
    "Gender",
    "Age",
    "Purok",
    "Is Verified",
    "Actions",
  ];
  const residentData = data?.data || [];

  const handleSearch = (params: any) => {
    setSearchParams(params);
    setCurrentPage(1);
  };

  useEffect(() => {
    setTotalPages(data?.totalPages);
  }, [data]);

  return (
    <Container>
      <TitlePage title="Resident Management" />
      <Button
        size="sm"
        className="cursor-pointer my-4"
        onClick={() => router.push("/admin/resident-management/addResident")}
      >
        <Plus />
        Add Resident
      </Button>
      <div>
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

        {/* Mobile View */}
        <div className="block md:hidden space-y-6">
          {/* Loader */}
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-4">
              <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
              <span>Loading Data...</span>
            </div>
          )}

          {/* No Data */}
          {!isLoading && residentData.length === 0 && (
            <div className="text-center mt-6 text-gray-500">No Data</div>
          )}

          {/* Resident Cards */}
          {!isLoading &&
            residentData.length > 0 &&
            residentData.map((resident: IResResident, index: number) => (
              <motion.div
                key={resident._id}
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
                    <div className="space-y-2 text-sm">
                      <div>
                        {resident.isVerified ? (
                          <Badge
                            variant="secondary"
                            className="bg-blue-500 text-white dark:bg-blue-600"
                          >
                            <BadgeCheckIcon /> Verified
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Not Verified</Badge>
                        )}
                      </div>
                      <div>
                        <span className="font-semibold">Name: </span>
                        <span>{`${resident.firstname} ${resident.middlename} ${resident.lastname}`}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Gender: </span>
                        <span>{resident.gender}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Age: </span>
                        <span>{calculateAge(resident.birthdate)}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Purok: </span>
                        <span>{resident.purok}</span>
                      </div>
                      <div className="flex gap-4 mt-4">
                        <DeleteResident
                          id={resident._id}
                          refetch={refetch}
                          setCurrentPage={setCurrentPage}
                        />
                        <Pencil
                          className="w-4 h-4 text-blue-500 cursor-pointer hover:scale-110"
                          onClick={() =>
                            router.push(
                              `/admin/resident-management/editResident/${resident._id}`
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

        {residentData.length > 0 && (
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

export default withAuth(page);
