"use client";
import TitlePage from "@/components/titlePage";
import { Button } from "@/components/ui/button";
import withAuth from "@/lib/withAuth";
import { getAdmin } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { IResAdmin } from "@/utils/types";
import { usePagination } from "@/hooks/usePagination";
import { searchProps } from "./searchprops";
import SearchForm from "@/components/searchForm";
import { PaginationControls } from "@/components/paginationControl";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { motion } from "framer-motion";
import DeleteAdmin from "./deleteAdmin";
import EditAdminStatus from "./updateStatus";
import { IAdmin } from "@/models/adminModel";
import Container from "@/components/container";

const page = () => {
  const router = useRouter();
  const adminInfo = useSelector(
    (state: RootState) => state.admin.adminInfo
  ) as IAdmin;
  const [searchParams, setSearchParams] = useState({});
  const {
    currentPage,
    totalPages,
    setTotalPages,
    handlePageChange,
    setCurrentPage,
  } = usePagination();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin", currentPage, searchParams],
    queryFn: () => getAdmin({ page: currentPage, ...searchParams }),
  });

  const tableHeaders = ["Name", "Role", "Actions"];
  const adminData = data?.data || [];

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
    return adminData.map((data: IResAdmin) => (
      <TableRow key={data._id}>
        <TableCell>
          <span>{`${data.username}`}</span>
          {data.username === adminInfo.username && (
            <span className="text-blue-400 ml-4">(Me)</span>
          )}
        </TableCell>
        <TableCell>{`${
          data.isSuperAdmin ? "Super Admin" : "Admin"
        }`}</TableCell>
        <TableCell>
          <div className="flex gap-4">
            {adminInfo.isSuperAdmin && (
              <DeleteAdmin
                id={data._id}
                refetch={refetch}
                setCurrentPage={setCurrentPage}
              />
            )}

            {adminInfo.isSuperAdmin && (
              <EditAdminStatus
                id={data._id}
                initialStatus={data.isSuperAdmin}
                refetch={refetch}
              />
            )}
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

  // if (isLoading) return <p>Loading...</p>;
  return (
    <Container>
      <TitlePage title="Admins" />
      <div className="my-6">
        {adminInfo.isSuperAdmin && (
          <Button
            className="cursor-pointer"
            size="sm"
            onClick={() => router.push("/admin/admins/addAdmin")}
          >
            <Plus />
            Add Admin
          </Button>
        )}
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
          <div className="block md:hidden space-y-3">
            {isLoading && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <Loader2 className="animate-spin" />{" "}
                <span>Loading Data...</span>
              </div>
            )}

            {!isLoading && adminData.length === 0 && (
              <div className="text-center mt-4 text-gray-500">No Data</div>
            )}

            {!isLoading &&
              adminData.length > 0 &&
              adminData.map((data: IResAdmin, index: number) => (
                <motion.div
                  key={data._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                    delay: index * 0.1,
                  }}
                >
                  <Card key={data._id} className="p-4 shadow-sm border">
                    <CardHeader>
                      <CardTitle>
                        {" "}
                        <span>{`${data.username}`}</span>
                        {data.username === adminInfo.username && (
                          <span className="text-blue-400 ml-4">(Me)</span>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {data.isSuperAdmin ? "Super Admin" : "Admin"}
                      </CardDescription>
                    </CardHeader>
                    {adminInfo.isSuperAdmin && (
                      <CardContent className="flex gap-2">
                        <DeleteAdmin
                          id={data._id}
                          refetch={refetch}
                          setCurrentPage={setCurrentPage}
                        />
                        <EditAdminStatus
                          id={data._id}
                          initialStatus={data.isSuperAdmin}
                          refetch={refetch}
                        />
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              ))}
          </div>

          {adminData.length > 0 && (
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
