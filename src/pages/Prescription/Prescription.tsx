/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetPatientQuery } from "@/redux/api/patient/patient";
import { Info, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ExportDropdown from "@/components/shared/ExportDropdown";
import { useState } from "react";
import PrescriptionTable from "./_components/PrescriptionTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { useGetChambersQuery } from "@/redux/api/chamber/chamber";
import BaseSelect from "@/components/shared/BaseSelect";
import type { Chamber } from "@/types/chamber.types";
import LoadingSpinner from "@/loading/LoadingSpinner";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setChamber } from "@/redux/slices/chamberSlice";

const Prescription = () => {
  const pageKey = "prescription";
  const { data: chambersData, isLoading } = useGetChambersQuery({});
  const today = new Date().toISOString().split("T")[0];
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit] = useState(10);
  const chamber = useAppSelector(
    (state) => state.chamber.selectedByPage[pageKey] || ""
  );
  const dispatch = useAppDispatch();

  const methods = useForm({
    defaultValues: {
      chamber: chamber || "",
      date: today,
    },
  });

  // 🔑 Watch chamber & date from form
  const headerSelect = useWatch({ control: methods.control });

  const { data: patients, isLoading: patientsLoading } = useGetPatientQuery({
    page,
    limit,
    searchTerm,
    filter: JSON.stringify({
      chamberId: chamber || undefined,
      createdAt: headerSelect?.date || today,
      timezoneOffset: new Date().getTimezoneOffset(),
    }),
    orderBy: JSON.stringify({ createdAt: "asc" }),
  });

  if (isLoading || patientsLoading) return <LoadingSpinner />;

  const chamberOptions = (chambersData?.data || []).map((chamber: Chamber) => ({
    name: chamber.name,
    val: chamber.id,
  }));

  return (
    <div className="custom-container">
      <div className="grid grid-cols-1 w-full">
        <div className="flex items-center justify-between p-4 bg-white mb-4">
          <div className="flex gap-4">
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

            {/* Filters */}
            <FormProvider {...methods}>
              <div className="flex items-center gap-4">
                {/* Chamber Filter */}
                <div className="flex-1 min-w-0">
                  <BaseSelect
                    name="chamber"
                    options={chamberOptions.map((chamber: any) => ({
                      name: chamber.name,
                      value: chamber.val,
                    }))}
                    onChange={(val) =>
                      dispatch(setChamber({ page: pageKey, chamberId: val }))
                    }
                    className="w-full border-[#A0B19E] rounded-[4px] !h-9 border text-[#5F597480]"
                  />
                </div>
              </div>
            </FormProvider>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">Search:</span>
            <div className="relative">
              <Input
                type="text"
                placeholder="Phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Table Section */}
        {patients?.data?.data && patients?.data?.data?.length > 0 ? (
          <PrescriptionTable
            patients={patients?.data?.data}
            active={patients?.data?.meta?.currentPage || 1}
            totalPages={patients.data.meta.totalPages || 1}
            onPageChange={setPage}
            meta={patients?.data?.meta}
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
