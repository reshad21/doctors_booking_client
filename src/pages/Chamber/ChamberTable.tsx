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

interface ChamberTableProps {
  chambersData: Chamber[];
  deleteStaff: (id: string) => void;
}

const ChamberTable = ({ chambersData, deleteStaff }: ChamberTableProps) => {
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
    <Table className="no-border">
      <TableHeader className="no-border">
        <TableRow className="bg-[#f7f7f7] no-border">
          {[
            "SN",
            "Chamber Name",
            "Start Date",
            "End Date",
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
            <TableCell className="text-[#5C727D]">{member.startTime || "N/A"}</TableCell>
            <TableCell className="text-[#5C727D]">{member.endTime || "N/A"}</TableCell>
            <TableCell className="text-[#5C727D] space-x-2">
              <Badge variant="outline" className="rounded">New {member.newPatientFee}</Badge>
              <Badge variant="outline" className="rounded">Old {member.oldPatientFee}</Badge>
              <Badge variant="outline" className="rounded">Report {member.reportFee}</Badge>
            </TableCell>
            <TableCell>
              <Switch checked={member.status === "ACTIVE"} className="data-[state=checked]:bg-green-600" />
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-center gap-2 h-full">
                <div className=" hover:bg-green-50 no-border">
                  <SquarePen className="h-5 w-5 text-[#14400D]" />
                </div>
                <div>
                  <ConfirmAlert id={member?.id} onDeleted={deleteStaff} person={"Staff"} />
                </div>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ChamberTable;