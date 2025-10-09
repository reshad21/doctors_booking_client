import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import UpdateMedicine from "../UpdateMedicine/UpdateMedicine";
import DeleteMedicine from "../DeleteMedicine/DeleteMedicine";

const MedicineTable = ({
  medicines,
}: {
  medicines: {
    id: string;
    nameManufacturer: string;
    brandName: string;
    genericName: string;
    strength: string;
    dosageDescription: string;
    price: number;
    useFor: string;
  }[];
}) => {
  return (
    <div className="bg-white w-[940px]">
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>SN</TableHead>
            <TableHead>Medicine Name</TableHead>
            <TableHead>Generic Name</TableHead>
            <TableHead>Strength</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Dosage</TableHead>
            <TableHead>Use For</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {medicines?.map((medicine, _idx) => (
            <TableRow key={medicine.id}>
              <TableCell className="font-medium">{_idx + 1}</TableCell>
              <TableCell>{medicine.brandName}</TableCell>
              <TableCell>{medicine.genericName}</TableCell>
              <TableCell>{medicine.strength}</TableCell>
              <TableCell>{medicine.price}</TableCell>
              <TableCell>{medicine.dosageDescription}</TableCell>
              <TableCell>{medicine.useFor}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
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
