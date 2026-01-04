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
      // ✅ existing (unchanged)
      { label: "Barangay Clearance", value: REQUEST_TYPE.BRGYCLEARANCE },
      { label: "Barangay Indigency", value: REQUEST_TYPE.BRGYINDIGENCY },
      { label: "Cedula", value: REQUEST_TYPE.BRGYCEDULA },

      // ➕ added common requests
      { label: "Certificate of Residency", value: REQUEST_TYPE.BRGYRESIDENCY },
      {
        label: "Barangay Business Clearance",
        value: REQUEST_TYPE.BRGYBUSINESSCLEARANCE,
      },
      { label: "Certificate of Good Moral", value: REQUEST_TYPE.BRGYGOODMORAL },
      { label: "Certificate of No Income", value: REQUEST_TYPE.BRGYNOINCOME },
      {
        label: "Certificate of Solo Parent",
        value: REQUEST_TYPE.BRGYSOLOPARENT,
      },
      {
        label: "Certificate of Senior Citizen",
        value: REQUEST_TYPE.BRGYSENIORCITIZEN,
      },
      { label: "Certificate of PWD", value: REQUEST_TYPE.BRGYPWD },
      { label: "Barangay ID", value: REQUEST_TYPE.BRGYID },
      { label: "Travel Certificate", value: REQUEST_TYPE.BRGYTRAVELCERT },
      { label: "Barangay Event Permit", value: REQUEST_TYPE.BRGYEVENTPERMIT },
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
