export const searchProps: any = [
  {
    label: "Incident Type",
    name: "incidentType",
    type: "select",
    placeholder: "Choose Incident Type",
    options: [
      { label: "Crime", value: "crime" },
      { label: "Accident", value: "accident" },
      { label: "Dispute", value: "dispute" },
      { label: "Noise", value: "noise" },
      { label: "Fire", value: "fire" },
      { label: "Health", value: "health" },
      { label: "Environmental", value: "environmental" },
      { label: "Other", value: "other" },
    ],
  },
  {
    label: "Status",
    name: "status",
    type: "select",
    placeholder: "Choose Status",
    options: [
      { label: "Pending", value: "pending" },
      { label: "Investigating", value: "invetigating" },
      { label: "Resolve", value: "resolve" },
    ],
  },
];
