/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomModal from "@/components/shared/CustomModal";
import {
  useGetDisplayNoticeQuery,
  useSendMultipleMessageMutation,
} from "@/redux/api/message/message";
import { useState } from "react";
import toast from "react-hot-toast";
import DisplayNotice from "./_components/DisplayNotice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/shared/Pagination";
import Actions from "./_components/Actions";
import { Input } from "@/components/ui/input";
import { Info, Search } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
const createPatientInputs = [
  { label: "Write your message", name: "message", type: "text" },
];

const Notice = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit] = useState(4);
  const { data: displayNotice } = useGetDisplayNoticeQuery({
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
        <div className="flex items-center justify-between mb-4 w-full bg-white px-4 py-4">
          <div className="flex justify-between items-center gap-3 w-full">
            <div className="flex justify-start items-center gap-2">
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
        </div>

        {/* Table Section */}
        <div className="rounded-b-sm overflow-hidden shadow-sm w-full">
          {displayNotice?.data?.length > 0 ? (
            <Table className="no-border">
              <TableHeader className="no-border">
                <TableRow className="bg-[#f7f7f7] no-border">
                  {["SL", "Sms status", "Status", "Action"].map(
                    (header, ind) => (
                      <TableHead
                        key={ind}
                        className={`${ind == 7 && "text-center"} pl-4`}
                      >
                        {header}
                      </TableHead>
                    )
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayNotice.data.map((notice: any, index: number) => (
                  <TableRow
                    key={notice.id}
                    className={`no-border ${index % 2 === 0 ? "bg-white" : "bg-[#f7f7f7]"}`}
                  >
                    <TableCell className="font-medium pl-4">
                      {index + 1}
                    </TableCell>
                    <TableCell
                      className="text-[#5C727D] max-w-xs break-words whitespace-normal"
                      title={notice.description} // Full text on hover
                    >
                      {notice.description
                        ? notice.description.split(" ").length > 24
                          ? notice.description
                              .split(" ")
                              .slice(0, 24)
                              .join(" ") + "......"
                          : notice.description
                        : "N/A"}
                    </TableCell>

                    <Actions
                      id={notice?.id}
                      description={notice.description}
                      status={notice.status}
                    />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={<Info className="w-full h-full" />}
              title="No notice records found"
              description="There are currently no notices to display. Add a new notice to get started."
              size="sm"
            />
          )}
        </div>

        {/* Pagination Section */}
        {displayNotice?.data?.data?.length > 0 &&
          displayNotice?.data?.meta?.totalPages > 1 && (
            <div className="mt-4">
              <Pagination
                active={displayNotice.data.meta.currentPage || 1}
                totalPages={displayNotice.data.meta.totalPages || 1}
                onPageChange={setPage}
              />
            </div>
          )}
      </div>
    </div>
  );
};

export default Notice;
