import Breadcrumb from "@/components/shared/BreadCrumb";
import { Input } from "@/components/ui/input";
import { ClipboardList, RepeatIcon } from "lucide-react";
import MedicineTable from "./MedicineTable/MedicineTable";
import { useGetMedicinesQuery } from "@/redux/api/medicine/medicine";
import { useState } from "react";
import CreateMedicine from "./CreateMedicine/CreateMedicine";

const MedicineManagement = () => {
  const [search, setSearch] = useState("");
  const breadcrumbItems = [
    {
      label: "Pre Management",
      icon: <RepeatIcon className="h-4 w-4" />,
      to: "/dashboard/pre-management",
    },
    {
      label: "Medicine Management",
      icon: <ClipboardList className="h-4 w-4" />,
    },
  ];
  const query: Record<string, string>[] = [
    {
      key: "searchTerm",
      value: search,
    },
    {
      key: "limit",
      value: "100",
    }
    // {
    //   key: "page",
    //   value: page.toString()
    // }
  ];
  const { data: medicines } = useGetMedicinesQuery(query);
  console.log(medicines);
  return (
    <div>
      <div className="p-5">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <div className="custom-container">
        <div className="flex items-center justify-between py-4">
          <CreateMedicine />
          <div>
            <Input
              className="w-72 rounded"
              placeholder="search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div>
          <MedicineTable medicines={medicines?.data?.data} />
        </div>
      </div>
    </div>
  );
};

export default MedicineManagement;
