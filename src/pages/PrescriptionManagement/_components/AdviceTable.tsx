/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Info, SquarePen } from "lucide-react";
import { useState } from "react";
import type { Advice } from "@/types/advice.types";
import { getParagraphCount } from "@/utils/getParagraphCount";
import { Badge } from "@/components/ui/badge";
import { useDeleteAdviceMutation } from "@/redux/api/advice/advice";
import ConfirmAlert from "@/components/shared/ConfirmAlert";
import { UpdateAdviceModal } from "./UpdateAdviceModal";

const AdviceTable = ({ advices }: any) => {
  const [deleteAdvice] = useDeleteAdviceMutation();
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [modalDataToUpdate, setModalDataToUpdate] = useState<Advice | null>(
    null
  );

  const handleUpdateClick = (patient: Advice) => {
    setModalDataToUpdate(patient);
    setUpdateModalOpen(true);
  };

  if (!advices?.length) {
    return (
      <div className="flex justify-center items-center min-h-[91vh] font-semibold text-xs">
        <div className="flex flex-col justify-center space-y-2 items-center text-yellow-900">
          <Info />
          <span>No Advice yet!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="rounded-b-sm overflow-hidden shadow-sm w-full">
        <Table className="no-border">
          <TableHeader className="no-border">
            <TableRow className="bg-[#f7f7f7] no-border">
              {["SN", "Disease Name", "Advice List", "Status", "Action"].map(
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
            {advices?.map((advice: Advice, index: number) => (
              <TableRow
                key={advice.id}
                className={`no-border ${index % 2 === 0 ? "bg-white" : "bg-[#f7f7f7]"}`}
              >
                <TableCell className="font-medium pl-4">{index + 1}</TableCell>
                <TableCell className="text-[#5C727D]">{advice.title}</TableCell>
                <TableCell className="text-[#5C727D] space-x-2">
                  <Badge className="bg-gray-700">
                    {getParagraphCount(advice.content)} Advices
                  </Badge>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={
                      advice.status !== ("NOT_VISITED" as typeof advice.status)
                    }
                    className="data-[state=checked]:bg-green-600"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 h-full">
                    <div className="hover:bg-green-50 no-border cursor-pointer">
                      <SquarePen
                        onClick={() => handleUpdateClick(advice)}
                        className="h-5 w-5 text-[#14400D]"
                      />
                    </div>
                    <div>
                      <ConfirmAlert
                        id={advice?.id}
                        onDeleted={deleteAdvice}
                        person={"Advice"}
                      />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            <div className="hidden">
              <UpdateAdviceModal
                open={updateModalOpen}
                setOpen={setUpdateModalOpen}
                data={modalDataToUpdate}
              />
            </div>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdviceTable;
