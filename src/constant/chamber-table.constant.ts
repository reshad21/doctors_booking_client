export const chamberInputFields = [
  { label: "Name", name: "name", type: "text" },
  { label: "Address", name: "address", type: "text" },
  { label: "Old Patient", name: "oldPatientFee", type: "number" },
  { label: "New Patient", name: "newPatientFee", type: "number" },
  { label: "Report", name: "reportFee", type: "number" },
  { label: "Start Time", name: "startTime", type: "time" },
  { label: "End Time", name: "endTime", type: "time" },
  { label: "Day", name: "day", type: "text" },
];

export const selectFields = [
  {
    label: "Status",
    name: "status",
    options: [
      { name: "Active", val: "ACTIVE" },
      { name: "Inactive", val: "INACTIVE" },
    ],
  },
];
