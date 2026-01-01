import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { STATUS } from "@/utils/constant";

interface RequestStatusProps {
  status: string;
}

const RequestStatus: React.FC<RequestStatusProps> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case STATUS.PENDING:
        return {
          variant: "secondary" as const,
          className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
          label: "Pending",
          icon: <Clock className="w-3 h-3 mr-1" />,
        };
      case STATUS.PROCESSING:
        return {
          variant: "secondary" as const,
          className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
          label: "Processing",
          icon: <Loader2 className="w-3 h-3 mr-1" />,
        };
      case STATUS.APPROVED:
        return {
          variant: "secondary" as const,
          className: "bg-green-100 text-green-800 hover:bg-green-200",
          label: "Approved",
          icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
        };
      case STATUS.CANCELLED:
        return {
          variant: "destructive" as const,
          className: "",
          label: "Cancelled",
          icon: <XCircle className="w-3 h-3 mr-1" />,
        };
      default:
        return {
          variant: "secondary" as const,
          className: "",
          label: status,
          icon: null,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className={config.className}>
      <span className="flex items-center">
        {config.icon}
        {config.label}
      </span>
    </Badge>
  );
};

export default RequestStatus;
