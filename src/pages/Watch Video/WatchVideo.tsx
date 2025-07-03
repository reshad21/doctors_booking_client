/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, SquarePen, SquarePlus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import ConfirmAlert from "@/components/shared/ConfirmAlert";
import {
  useCreateWatchVideoMutation,
  useDeleteWatchVideoMutation,
  useGetWatchVideoQuery,
} from "@/redux/api/watchVideoApi/watchVideoApi";
import toast from "react-hot-toast";
import type { WatchVideoTypes } from "./watchVideo";
import CustomModal from "@/components/shared/CustomModal";
import { useState } from "react";
const WatchVideo = () => {
  const { data: watchVideoData } = useGetWatchVideoQuery(undefined);
  const [deleteWatchVideo] = useDeleteWatchVideoMutation();

  const [createWatchVideo] = useCreateWatchVideoMutation();
  const [modalOpen, setModalOpen] = useState(false);

  const handleFormSubmit = async (
    data: Record<string, any>,
    helpers: { reset: () => void; close: () => void }
  ) => {
    const res = (await createWatchVideo({
      ...data,
    })) as any;
    if (res?.data?.success) {
      helpers.reset();
      helpers.close();
      toast.success(res?.data?.message);
    } else {
      console.error();
      toast.error(res?.error?.data?.message || "something went wrong");
    }
  };

  return (
    <div className="customContainer">
      <div className="w-full">
        <div className="flex items-center justify-between mb-6"></div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-brand hover:bg-green-800 text-white">
                Export
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem>Export as PDF</DropdownMenuItem>
              <DropdownMenuItem>Export as Excel</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>


          {watchVideoData?.data?.length == 0 && (
            <CustomModal
              open={modalOpen}
              setOpen={setModalOpen}
              title="Create New Video"
              description="Fill in the form below."
              handleFormSubmit={handleFormSubmit}
              input={[
                { label: "Video Full Link", name: "videoFile" },
                { label: "Email", name: "email" },
                { label: "Phone", name: "phone" },
                { label: "Password", name: "password" },
              ]}

              buttonProperty={{ type: "create", text: "AddNew Staff" }}
            />
          )}

        </div>

        {/* Table Section */}
        <div className="rounded-lg overflow-hidden shadow-sm">
          <Table className="no-border">
            <TableHeader className="no-border">
              <TableRow className="bg-[#f7f7f7] no-border">
                {["SN", "Video", "Date", "Status", "Action"].map(
                  (header, ind) => (
                    <TableHead
                      key={ind}
                      className={`${ind == 7 && "text-center"}`}
                    >
                      {header}
                    </TableHead>
                  )
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {watchVideoData?.data?.map(
                (video: WatchVideoTypes, index: number) => (
                  <TableRow
                    key={video.id}
                    className={`no-border ${index % 2 === 0 ? "bg-white" : "bg-[#f7f7f7]"}`}
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>

                    <TableCell className="text-[#5C727D]">
                      {video.videoFile}
                    </TableCell>

                    <TableCell className="text-[#5C727D]">
                      {video.createdAt}
                    </TableCell>

                    <TableCell>
                      <Switch
                        checked={video.status === "ACTIVE"}
                        className="data-[state=checked]:bg-green-600"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2 h-full">
                        <div className=" hover:bg-green-50 no-border">
                          <SquarePlus className="h-5 w-5 text-[#14400D]" />
                        </div>
                        <div className=" hover:bg-green-50 no-border">
                          <SquarePen className="h-5 w-5 text-[#14400D]" />
                        </div>

                        <div>
                          <ConfirmAlert
                            id={video?.id}
                            onDeleted={deleteWatchVideo}
                            person={"WatchVideo"}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default WatchVideo;
