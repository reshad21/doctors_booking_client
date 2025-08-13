/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Info, SquarePen } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import ConfirmAlert from "@/components/shared/ConfirmAlert";
import {
  useCreateWatchVideoMutation,
  useDeleteWatchVideoMutation,
  useGetWatchVideoQuery,
  useUpdateWatchVideoMutation,
} from "@/redux/api/watchVideoApi/watchVideoApi";

import toast from "react-hot-toast";

import CustomModal from "@/components/shared/CustomModal";
import { useState } from "react";
import type { WatchVideoTypes } from "./watchVideotypes";
import { getISODateMonthYear } from "@/utils/getISODateMonthYear";
import { UpdateWatchVideoModal } from "./UpdateWatchVideoModal";
import { EmptyState } from "@/components/shared/EmptyState";

const WatchVideo = () => {
  const { data: watchVideoData } = useGetWatchVideoQuery(undefined);
  const [deleteWatchVideo] = useDeleteWatchVideoMutation();
  const [createWatchVideo] = useCreateWatchVideoMutation();
  const [updateWatchVideo] = useUpdateWatchVideoMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [modalDataToUpdate, setModalDataToUpdate] = useState<any>(null);

  const handleUpdateClick = (exam: any) => {
    setModalDataToUpdate(exam);
    setOpenEditModal(true);
  };

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

  // handle status updates
  const handleStatusUpdate = async (id: string, checked: boolean) => {
    try {
      const updatedStatus = checked ? "ACTIVE" : "INACTIVE";
      const res = (await updateWatchVideo({
        id,
        payload: { status: updatedStatus },
      })) as any;

      if (res?.data?.success) {
        toast.success(`Status changed to ${updatedStatus}`);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="custom-container">
      <div className="w-full">
        <div className="flex items-center justify-between"></div>
        <div className="flex items-center gap-3 py-4 px-4 bg-white mb-4 rounded">
          <CustomModal
            open={modalOpen}
            setOpen={setModalOpen}
            title="Create New Video"
            description="Fill in the form below."
            handleFormSubmit={handleFormSubmit}
            input={[
              { label: "Video Title", name: "title", type: "text" },
              { label: "Video Full Link", name: "videoFile", type: "text" },
            ]}
            select={[
              {
                label: "Status",
                name: "status",
                type: "select",
                options: [
                  { name: "Active", val: "ACTIVE" },
                  { name: "Inactive", val: "INACTIVE" },
                ],
              },
            ]}
            buttonProperty={{ type: "create", text: "Add New Video" }}
          />
        </div>

        {/* Table Section */}
        <div className="overflow-hidden shadow-sm w-full">
          {watchVideoData?.data?.length > 0 ? (
            <div className="overflow-x-auto shadow-sm">
              <Table className="no-border">
                <TableHeader className="no-border">
                  <TableRow className="bg-[#f7f7f7] no-border">
                    {["SN", "Title", "Video", "Date", "Status", "Action"].map(
                      (header, ind) => (
                        <TableHead
                          key={ind}
                          className={`${ind === 7 ? "text-center" : ""} pl-4`}
                        >
                          {header}
                        </TableHead>
                      )
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {watchVideoData.data.map(
                    (video: WatchVideoTypes, index: number) => (
                      <TableRow
                        key={video.id}
                        className={`no-border ${index % 2 === 0 ? "bg-white" : "bg-[#f7f7f7]"}`}
                      >
                        <TableCell className="font-medium pl-4">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-[#5C727D]">
                          {video.title}
                        </TableCell>
                        <TableCell className="text-[#5C727D]">
                          {video.videoFile.slice(0, 20)}...
                        </TableCell>
                        <TableCell className="text-[#5C727D]">
                          {getISODateMonthYear(video.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={video.status === "ACTIVE"}
                            onCheckedChange={(checked) =>
                              handleStatusUpdate(video.id, checked)
                            }
                            className="data-[state=checked]:bg-green-600"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="hover:bg-green-50 no-border cursor-pointer">
                              <SquarePen
                                onClick={() => handleUpdateClick(video)}
                                className="h-5 w-5 text-[#14400D]"
                              />
                            </div>
                            <div>
                              <ConfirmAlert
                                id={video?.id}
                                onDeleted={deleteWatchVideo}
                                person={"Watch Video"}
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
          ) : (
            <EmptyState
              icon={<Info className="w-full h-full" />}
              title="No videos found"
              description="No watch videos have been created yet. Add a new video to get started."
              size="sm"
            />
          )}
        </div>
      </div>
      <div className="hidden">
        <UpdateWatchVideoModal
          open={openEditModal}
          setOpen={setOpenEditModal}
          data={modalDataToUpdate}
        />
      </div>
    </div>
  );
};

export default WatchVideo;
