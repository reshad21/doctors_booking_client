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

const Patient = () => {
  const [deletePatient] = useDeletePatientMutation();
  const { data: chambersData } = useGetChambersQuery(undefined);
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
    }),
  });

  if (isLoading) return <div>Loading</div>;

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
          <div className="flex items-center gap-3 justify-center"></div>
          <Input
            className="w-80 rounded"
            placeholder="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        {/* Table Section */}
        <div className="rounded-b-sm overflow-hidden shadow-sm">
          <PatientTable
            patientsData={patientsData?.data?.data}
            deletePatient={deletePatient}
          />
        </div>
        {/* Pagination Section */}
        <div className="mt-4">
          <Pagination
            active={patientsData?.data?.meta?.currentPage || 1}
            totalPages={patientsData?.data?.meta?.totalPages || 1}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Patient;
