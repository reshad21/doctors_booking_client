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
import ConfirmAlert from "@/components/shared/ConfirmAlert";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import type { Chamber } from "@/types/chamber.types";
import { UpdateChamberModal } from "./UpdateChamberModal";
import { useState } from "react";
import { useUpdateChamberMutation } from "@/redux/api/chamber/chamber";

interface ChamberTableProps {
  chambersData: Chamber[];
  deleteChamber: (id: string) => void;
}

const ChamberTable = ({ chambersData, deleteChamber }: ChamberTableProps) => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [modalDataToUpdate, setModalDataToUpdate] = useState<any>(null);
  const [updateChamber] = useUpdateChamberMutation();

  const handleUpdateClick = (exam: any) => {
    setModalDataToUpdate(exam);
    setOpenEditModal(true);
  };

  const handleStatusToggle = async (member: Chamber) => {
    const updatedStatus = member.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      await updateChamber({
        id: member.id,
        data: {
          ...member,
          status: updatedStatus,
        },
      }).unwrap();
    } catch (error) {
      console.error("Failed to toggle status:", error);
    }
  };

  if (!chambersData?.length) {
    return (
      <div className="flex justify-center items-center h-[80vh] font-semibold text-xs">
        <div className="flex flex-col justify-center space-y-2 items-center text-yellow-900">
          <Info />
          <span>Chamber not created yet!</span>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Table className="no-border">
        <TableHeader className="no-border">
          <TableRow className="bg-[#f7f7f7] no-border">
            {[
              "SN",
              "Chamber Name",
              "Start Time",
              "End Time",
              "Patient (Tk)",
              "Status",
              "Action",
            ].map((header, ind) => (
              <TableHead
                key={ind}
                className={`${ind === 0 ? "pl-4" : ""} ${ind == 6 && "text-center"}`}
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {chambersData?.map((member: Chamber, index: number) => (
            <TableRow
              key={member.id}
              className={`no-border ${index % 2 === 0 ? "bg-white" : "bg-[#f7f7f7]"}`}
            >
              <TableCell className="font-medium pl-4">{index + 1}</TableCell>
              <TableCell className="text-[#5C727D]">{member.name}</TableCell>
              <TableCell className="text-[#5C727D]">
                {member.startTime || "N/A"}
              </TableCell>
              <TableCell className="text-[#5C727D]">
                {member.endTime || "N/A"}
              </TableCell>
              <TableCell className="text-[#5C727D] space-x-2">
                <Badge variant="outline" className="rounded">
                  New {member.newPatientFee}
                </Badge>
                <Badge variant="outline" className="rounded">
                  Old {member.oldPatientFee}
                </Badge>
                <Badge variant="outline" className="rounded">
                  Report {member.reportFee}
                </Badge>
              </TableCell>
              <TableCell>
                <Switch
                  checked={member.status === "ACTIVE"}
                  onCheckedChange={() => handleStatusToggle(member)}
                  className="data-[state=checked]:bg-green-600"
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2 h-full">
                  <div className=" hover:bg-green-50 no-border cursor-pointer">
                    <SquarePen
                      className="h-5 w-5 text-[#14400D]"
                      onClick={() => handleUpdateClick(member)}
                    />
                  </div>
                  <div>
                    <ConfirmAlert
                      id={member?.id}
                      onDeleted={deleteChamber}
                      person={"Chamber"}
                    />
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
          <div className="hidden">
            <UpdateChamberModal
              open={openEditModal}
              setOpen={setOpenEditModal}
              data={modalDataToUpdate}
            />
          </div>
        </TableBody>
      </Table>
    </div>
  );
};

export default ChamberTable;
