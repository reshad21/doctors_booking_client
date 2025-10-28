import { useState } from "react";
import DeletePrescriptionPageSetupTemplate from "@/components/shared/DeletePrescriptionPageSetupTemplate";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { useCurrentToken } from "@/redux/api/features/authSlice";
// import { useAppSelector } from "@/redux/hooks";
// import { jwtDecode } from "jwt-decode";
import {
  useGetPrescriptionPageSetupsQuery,
  useUpdateStatusMutation,
} from "@/redux/api/PreManagement/PrescriptionPageSetupApi";
import { SquarePen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrescriptionPageSetupTable = () => {
  const navigate = useNavigate();
  // const token = useAppSelector(useCurrentToken);
  // const decoded: { id: string } = jwtDecode(token);
  const { data: prescriptionPageSetupData, isLoading } = useGetPrescriptionPageSetupsQuery({});

  // Local state to manage switch values
  const [switchStates, setSwitchStates] = useState<Record<string, boolean>>({});
  const [updateStatus] = useUpdateStatusMutation();

  const handleUpdatePrescriptionSetup = (id: string) => {
    navigate(
      "/dashboard/pre-management/create-prescription-page-setup/page-setup",
      {
        state: { id },
      }
    );
  };

  const handleSwitchChange = async (id: string, checked: boolean) => {
    // Update local state
    setSwitchStates((prev) => ({
      ...prev,
      [id]: checked,
    }));

    await updateStatus(id);
  };

  console.log(prescriptionPageSetupData);

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
                isActive: boolean;
                status: boolean;
              },
              index: number
            ) => {
              // Use local state if it exists, otherwise use the value from API
              const isActive = switchStates[item.id] ?? item.isActive;

              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{item?.chamber?.name}</TableCell>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={isActive}
                        onCheckedChange={(checked) =>
                          handleSwitchChange(item.id, checked)
                        }
                      />
                      <span className="text-sm text-gray-600">
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="flex gap-2 items-center">
                    <Button
                      variant={"outline"}
                      onClick={() => handleUpdatePrescriptionSetup(item.id)}
                      size={"icon"}
                      className="bg-green-400 border-0 hover:bg-green-500 cursor-pointer"
                    >
                      <SquarePen className="h-4 w-4" />
                    </Button>
                    <DeletePrescriptionPageSetupTemplate deleteId={item?.id} />
                  </TableCell>
                </TableRow>
              );
            }
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PrescriptionPageSetupTable;
