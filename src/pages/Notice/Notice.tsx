/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomModal from "@/components/shared/CustomModal";
import { useGetDisplayNoticeQuery, useSendMultipleMessageMutation } from "@/redux/api/message/message";
import { useState } from "react";
import toast from "react-hot-toast";
import DisplayNotice from "./_components/DisplayNotice";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import Pagination from "@/components/shared/Pagination";
const createPatientInputs = [
  { label: "Write your message", name: "message", type: "text" },
];

const Notice = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [limit] = useState(4);
  const {data:displayNotice} = useGetDisplayNoticeQuery({
    page,
    limit,
    searchTerm,
  });
  const [sendMultipleMsg] = useSendMultipleMessageMutation();
  const handleFormSubmit = async (
    data: Record<string, any>,
    helpers: { reset: () => void; close: () => void }
  ) => {
    try {
      const res = (await sendMultipleMsg({ message: data?.message })) as any;

      if (res?.data?.success) {
        helpers.reset();
        helpers.close();
        toast.success(res?.data?.message);
      } else {
        console.error();
        toast.error(res?.error?.data?.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="custom-container">
      <div className="w-full">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {/* <Button className="bg-brand hover:bg-green-800 cursor-pointer text-white">
              <Plus className="ml-2 h-4 w-4" />
              Add display notice
            </Button> */}
            <DisplayNotice />
            <CustomModal
              open={modalOpen}
              setOpen={setModalOpen}
              title="Display notice"
              description="Fill in the form below."
              handleFormSubmit={handleFormSubmit}
              input={createPatientInputs}
              buttonProperty={{ type: "create", text: "Add SMS notice" }}
            />
          </div>
        </div>

        {/* Table Section */}
       <div className="rounded-b-sm overflow-hidden shadow-sm w-full">
        <Table className="no-border">
          <TableHeader className="no-border">
             <TableRow className="bg-[#f7f7f7] no-border">
                  {[
                    "SN",
                    "Display notice",
                    "Sms notice",
                    "Sms status",
                    "Status",
                    "Action",
                  ].map((header, ind) => (
                    <TableHead
                      key={ind}
                      className={`${ind == 7 && "text-center"}`}
                    >
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
          </TableHeader>
          <TableBody>
            {displayNotice?.data?.data?.map((patient: any, index: number) => (
              <TableRow
                key={patient.id}
                className={`no-border ${index % 2 === 0 ? "bg-white" : "bg-[#f7f7f7]"}`}
              >
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="text-[#5C727D]">{patient.name}</TableCell>
                <TableCell className="text-[#5C727D]">
                  {patient.name || "N/A"}
                </TableCell>
                <TableCell className="text-[#5C727D] space-x-2">
                  {patient.phoneNumber}
                </TableCell>
                <TableCell className="text-[#5C727D] space-x-2">
                  {patient.status || "N/A"}
                </TableCell>
                <TableCell className="text-[#5C727D] space-x-2">Paid</TableCell>
                <TableCell>
                  <Switch
                    checked={
                      patient.visitStatus !==
                      ("NOT_VISITED" as typeof patient.visitStatus)
                    }
                    className="data-[state=checked]:bg-green-600"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
      </div>
        {/* Pagination Section */}
        <div className="mt-4">
          <Pagination
          active={displayNotice?.data?.meta?.currentPage || 1}
          totalPages={displayNotice?.data?.meta?.totalPages || 1}
          onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Notice;
