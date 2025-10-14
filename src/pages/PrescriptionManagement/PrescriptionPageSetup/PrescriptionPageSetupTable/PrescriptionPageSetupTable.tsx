import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCurrentToken } from "@/redux/api/features/authSlice";
import { useGetPrescriptionPageSetupsQuery } from "@/redux/api/PreManagement/PrescriptionPageSetupApi";
import { useAppSelector } from "@/redux/hooks";
import { jwtDecode } from "jwt-decode";
import { SquarePen, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrescriptionPageSetupTable = () => {
  const navigate = useNavigate();
  const token = useAppSelector(useCurrentToken);
  const decoded: { id: string } = jwtDecode(token);
  const { data: prescriptionPageSetupData, isLoading } =
    useGetPrescriptionPageSetupsQuery({ doctorId: decoded.id });

  const handleUpdatePrescriptionSetup = (id: string) => {
    navigate("/dashboard/pre-management/create-prescription-page-setup/page-setup", {
      state: { id },
    });
  };
  return (
    <div>
      <Table>
        <TableCaption>
          {isLoading
            ? "Loading..."
            : `Showing ${prescriptionPageSetupData?.data?.length || 0} entries`}
        </TableCaption>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>SN</TableHead>
            <TableHead>Chamber</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prescriptionPageSetupData?.data?.map(
            (
              item: {
                id: string;
                chamber: { name: string };
                createdAt: string;
                status: boolean;
              },
              index: number
            ) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{item?.chamber?.name}</TableCell>
                <TableCell>
                  {new Date(item.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell className="space-x-3">
                  <Button
                    variant={"outline"}
                    onClick={() => handleUpdatePrescriptionSetup(item.id)}
                    size={"icon"}
                    className="bg-green-400 border-0 hover:bg-green-500 cursor-pointer"
                  >
                    <SquarePen className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={"destructive"}
                    size={"icon"}
                    className="cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PrescriptionPageSetupTable;
