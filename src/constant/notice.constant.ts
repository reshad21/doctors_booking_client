export const createNoticeInputs = [
  { label: "Display notice ", name: "description", type: "text" },
];

export const selectNoticeFields = [
  {
    label: "Status",
    name: "status",
    options: [
      { name: "ACTIVE", val: "ACTIVE" },
      { name: "INACTIVE", val: "INACTIVE" },
    ],
  },
];
