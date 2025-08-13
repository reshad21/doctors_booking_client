import { useGetPatientQuery } from "@/redux/api/patient/patient";
import { Info, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ExportDropdown from "@/components/shared/ExportDropdown";
import { useState } from "react";
import PrescriptionTable from "./_components/PrescriptionTable";
import { EmptyState } from "@/components/shared/EmptyState";

const Prescription = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit] = useState(10);
  const { data: patients } = useGetPatientQuery({
    page,
    limit,
    searchTerm,
  });

  console.log(patients, "patients")

  return (
    <div className="custom-container">
      <div className="grid grid-cols-1 w-full">
        <div className="flex items-center justify-between p-4 bg-white mb-4">
          <ExportDropdown
            data={patients?.data?.data || []}
            columns={[
              { label: "Name", key: "name" },
              { label: "Phone", key: "phoneNumber" },
              { label: "Gender", key: "gender" },
              { label: "Status", key: "status" },
              { label: "Date", key: "createdAt" },
            ]}
          />
          {/* Search Bar */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">Search:</span>
            <div className="relative">
              <Input
                type="text rounded"
                placeholder="Phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
        {patients?.data?.data && patients?.data?.data?.length > 0 ? (
          <PrescriptionTable
            patients={patients?.data?.data}
            active={patients?.data?.meta?.currentPage || 1}
            totalPages={patients.data.meta.totalPages || 1}
            onPageChange={setPage}
          />
        ) : (
          <EmptyState
            icon={<Info className="w-full h-full" />}
            title="No prescriptions found"
            description="There are no patient prescriptions available. Add new prescriptions to get started."
            size="sm"
          />
        )}
      </div>
    </div>
  );
};

export default Prescription;
