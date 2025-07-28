/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomModal from "@/components/shared/CustomModal";
import { useGetChambersQuery } from "@/redux/api/chamber/chamber";
import {
  useCreatePatientMutation,
  useDeletePatientMutation,
  useGetPatientQuery,
} from "@/redux/api/patient/patient";
import { useAppSelector } from "@/redux/hooks";
import { useState, useEffect } from "react";
import Pagination from "@/components/shared/Pagination";
import toast from "react-hot-toast";
import HeaderSelect from "./_components/HeaderSelect";
import { useSendSingleMessageMutation } from "@/redux/api/message/message";
import { Input } from "@/components/ui/input";
import { createPatientInputs } from "@/constant/appointment-table.constant";
import ExportDropdown from "@/components/shared/ExportDropdown";
import AppointmentTable from "./_components/AppointementTable";

const AppointmentManagement = () => {
  const [deletePatient] = useDeletePatientMutation();
  const [sendSingleMessage] = useSendSingleMessageMutation();
  const [createPatient] = useCreatePatientMutation();
  const { data: chambersData } = useGetChambersQuery({});
  const [modalOpen, setModalOpen] = useState(false);
  const doctorId = useAppSelector((state) => state.admin.id);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [headerSelect, setHeaderSelect] = useState({ date: "", chamber: "" });

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
      createdAt: headerSelect.date || undefined,
    }),
    orderBy: JSON.stringify({ createdAt: "desc" }),
  });

  if (isLoading) return <div>Loading</div>;

  const selectFields = [
    {
      label: "Gender",
      name: "gender",
      options: [
        { name: "Male", val: "MALE" },
        { name: "Female", val: "FEMALE" },
        { name: "Other", val: "OTHER" },
      ],
    },
    {
      label: "Chamber",
      name: "chamberId",
      options: (chambersData?.data || []).map((chamber: any) => ({
        name: chamber.name,
        val: chamber.id,
      })),
    },
    {
      label: "Status",
      name: "status",
      options: [
        { name: "New", val: "NEW" },
        { name: "Old", val: "OLD" },
        { name: "Report", val: "REPORT" },
      ],
    },
  ];

  const handleFormSubmit = async (
    data: Record<string, any>,
    helpers: { reset: () => void; close: () => void }
  ) => {
    const res = (await createPatient({
      ...data,
      doctorId,
    })) as any;

    console.log(res, "create patient response");

    if (res?.data?.success) {
      const response = await sendSingleMessage({
        number: data?.phoneNumber,
        message: "Mr. Shifat, your booking with Dr. Mahabur Rahman has been confirmed.",
      });
console.log(response);

      helpers.reset();
      helpers.close();

      if (response?.data?.data?.success_message) {
        toast.success(
          `${res?.data?.message} & ${response?.data?.data?.success_message}`
        );
      } else {
        toast.success(`${res?.data?.message}`);
      }
    } else {
      console.error(res?.error);
      toast.error(res?.error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="custom-container">
      <div className="w-full">
        <div className="mb-4">
          <HeaderSelect
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

            <CustomModal
              open={modalOpen}
              setOpen={setModalOpen}
              title="Create Patient"
              description="Fill in the form below."
              handleFormSubmit={handleFormSubmit}
              input={createPatientInputs}
              select={selectFields}
              buttonProperty={{ type: "create", text: "Add New Patient" }}
            />
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
          <AppointmentTable
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

export default AppointmentManagement;
