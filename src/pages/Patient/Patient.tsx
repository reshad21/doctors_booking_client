import { useGetChambersQuery } from "@/redux/api/chamber/chamber";
import {
  useDeletePatientMutation,
  useGetPatientQuery,
} from "@/redux/api/patient/patient";
import { useState, useEffect } from "react";
import Pagination from "@/components/shared/Pagination";
import { Input } from "@/components/ui/input";
import PatientHeaderSelect from "./_components/PatientHeaderSelect";
import PatientTable from "./_components/PaitentTable";
import ExportDropdown from "@/components/shared/ExportDropdown";
import LoadingSpinner from "@/loading/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Info } from "lucide-react";

const Patient = () => {
  const [deletePatient] = useDeletePatientMutation();
  const { data: chambersData, isLoading: isChamberLoading } =
    useGetChambersQuery({ searchTerm: "" });
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [headerSelect, setHeaderSelect] = useState({
    startDate: "",
    endDate: "",
    chamber: "",
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const { data: patientsData, isLoading } = useGetPatientQuery({
    page,
    limit,
    searchTerm,
    filter: JSON.stringify({
      chamberId: headerSelect.chamber || undefined,
      startDate: headerSelect.startDate || undefined,
      endDate: headerSelect.endDate || undefined,
      timezoneOffset: new Date().getTimezoneOffset()
    }),
    orderBy: JSON.stringify({ createdAt: "asc" }),
  });

  if (isLoading || isChamberLoading) return <LoadingSpinner />;


  return (
    <div className="custom-container">
      <div className="w-full">
        <div className="mb-4">
          <PatientHeaderSelect
            chambersData={chambersData?.data}
            selected={headerSelect}
            onChange={(val) => {
              setHeaderSelect(val);
              setPage(1);
            }}
          />
        </div>
        {/* Header Section */}
        <div className="flex items-center justify-between py-4 px-4 bg-white">
          <div className="flex items-center gap-3 justify-center">
            <ExportDropdown
              data={patientsData?.data?.data || []}
              columns={[
                { label: "Name", key: "name" },
                { label: "Phone", key: "phoneNumber" },
                { label: "Gender", key: "gender" },
                { label: "Status", key: "status" },
                { label: "Date", key: "createdAt" },
              ]}
            />
          </div>
          <div className="bg-gray-100 text-xs px-2 py-1 text-black rounded-sm">
            {" "}
            <span className="text-xs">Total-present :</span>{" "}
            {patientsData?.data?.meta?.totalItems}
          </div>
          <Input
            className="w-80 rounded"
            placeholder="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        {/* Table Section */}
        <div className="rounded-b-sm overflow-hidden shadow-sm">
          {patientsData?.data?.data && patientsData.data.data.length > 0 ? (
            <PatientTable
              patients={patientsData.data.data}
              meta={patientsData?.data?.meta}
              deletePatient={deletePatient}
            />
          ) : (
            <EmptyState
              icon={<Info className="w-full h-full" />}
              title="No patients booked yet"
              description="Get started by booking your first patient appointment. You can manage all patient information and appointments from the appointment management."
              size="sm"
            />
          )}
        </div>
        {/* Pagination Section */}
        {patientsData?.data?.data?.length > 0 &&
          patientsData?.data?.meta?.totalPages > 1 && (
            <div className="mt-4">
              <Pagination
                active={patientsData.data.meta.currentPage || 1}
                totalPages={patientsData.data.meta.totalPages || 1}
                onPageChange={setPage}
              />
            </div>
          )}
      </div>
    </div>
  );
};

export default Patient;
