import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UpdateMedicine from "../UpdateMedicine/UpdateMedicine";
import DeleteMedicine from "../DeleteMedicine/DeleteMedicine";

// helper function to break line every 50 characters
const breakLine = (text: string, limit = 50) => {
  if (!text) return "";
  const regex = new RegExp(`(.{1,${limit}})`, "g");
  return text.match(regex)?.join("\n") || text;
};

export interface TMedicine {
  id: string;
  nameManufacturer: string;
  brandName: string;
  genericName: string;
  strength: string;
  dosageDescription: string;
  price: number;
  useFor: string;
}

const MedicineTable = ({
  medicines,
}: {
  medicines: TMedicine[];
}) => {
  return (
    <div className="bg-white w-full max-w-[950px] rounded-lg 2xl:max-w-[1400px] overflow-x-auto">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="whitespace-nowrap">SN</TableHead>
            <TableHead className="whitespace-nowrap">Medicine Name</TableHead>
            <TableHead className="min-w-[200px] whitespace-break-spaces">Generic Name</TableHead>
            <TableHead className="whitespace-nowrap">Strength</TableHead>
            <TableHead className="whitespace-nowrap">Price</TableHead>
            <TableHead className="whitespace-nowrap">Dosage</TableHead>
            <TableHead className="whitespace-nowrap">Use For</TableHead>
            <TableHead className="text-right whitespace-nowrap">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {medicines?.map((medicine, _idx) => (
            <TableRow key={medicine.id}>
              <TableCell className="font-medium">{_idx + 1}</TableCell>
              <TableCell className="min-w-[150px] max-w-[200px]">
                {medicine.brandName}
              </TableCell>
              <TableCell className="whitespace-pre-wrap break-words">
                {breakLine(medicine.genericName, 25)}
              </TableCell>
              <TableCell className="whitespace-nowrap">{medicine.strength}</TableCell>
              <TableCell className="whitespace-nowrap">{medicine.price}</TableCell>
              <TableCell className="max-w-[200px] truncate">{medicine.dosageDescription}</TableCell>
              <TableCell className="max-w-[200px] truncate">{medicine.useFor}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end whitespace-nowrap">
                  <UpdateMedicine
                    medicineId={medicine.id}
                    defaultValues={{
                      nameManufacturer: medicine.nameManufacturer,
                      brandName: medicine.brandName,
                      genericName: medicine.genericName,
                      strength: medicine.strength,
                      dosageDescription: medicine.dosageDescription,
                      price: medicine.price,
                      useFor: medicine.useFor,
                    }}
                    trigger={
                      <span className="text-blue-600 cursor-pointer">Edit</span>
                    }
                  />
                  <DeleteMedicine
                    medicineId={medicine.id}
                    medicineName={medicine.brandName}
                    trigger={
                      <span className="text-red-600 cursor-pointer">
                        Delete
                      </span>
                    }
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MedicineTable;
