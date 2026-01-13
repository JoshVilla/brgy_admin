import { IResRequest } from "@/utils/types";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formattedDate, requestTypeText } from "@/utils/nonAsyncHelpers";
import RequestStatus from "@/components/requestStatus";
import { STATUS } from "@/utils/constant";
import UpdateRequest from "../request/updateRequest";

interface Props {
  request: IResRequest[];
  refetch: () => void;
}
const NewRequest = ({ request, refetch }: Props) => {
  console.log(request);
  const tableHeaders = [
    "Name",
    "Request for",
    "Status",
    "Requested last",
    "Actions",
  ];

  const renderTableRows = () => {
    if (request.length === 0) {
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
    return request.map((data: IResRequest) => (
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
  return (
    <div>
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
  );
};

export default NewRequest;
