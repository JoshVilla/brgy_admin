export const searchProps: any = [
  {
    label: "Search",
    name: "search",
    type: "input",
    placeholder: "Search Name",
  },

  {
    label: "Status",
    name: "status",
    type: "select",
    placeholder: "Choose Status",
    options: [
      { label: "Ongoing", value: "ONGOING" },
      { label: "For Hearing", value: "FOR_HEARING" },
      { label: "Settled", value: "SETTLED" },
      { label: "Referred", value: "REFERRED" },
    ],
  },
];
