import { REQUEST_TYPE, STATUS } from "@/utils/constant";

export const searchProps: any = [
  {
    label: "Name",
    name: "name",
    type: "input",
    placeholder: "Enter Name",
  },
  {
    label: "Request Type",
    name: "type",
    placeholder: "Choose Request Type",
    type: "select",
    options: [
      { label: "Barangay Certificate", value: REQUEST_TYPE.BRGYCERT },
      { label: "Barangay Indigency", value: REQUEST_TYPE.BRGYINDIGENCY },
      { label: "Sedula", value: REQUEST_TYPE.BRGYCEDULA },
    ],
  },
  {
    label: "Status",
    name: "status",
    placeholder: "Choose Status",
    type: "select",
    options: [
      { label: "Pending", value: STATUS.PENDING },
      { label: "Processing", value: STATUS.PROCESSING },
      { label: "Approved", value: STATUS.APPROVED },
      { label: "Cancelled", value: STATUS.CANCELLED },
    ],
  },
];
