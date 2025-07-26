
// /* eslint-disable @typescript-eslint/no-explicit-any */

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import CustomModal from "@/components/shared/CustomModal";
// import {
//   useCreatePreManagementMutation,
//   useDeletePreManagementMutation,
//   useGetPreManagementQuery,
// } from "@/redux/api/PreManagement/PreManagementApi";
// import { useState } from "react";
// import toast from "react-hot-toast";
// import { Info } from "lucide-react";
// import ConfirmAlert from "@/components/shared/ConfirmAlert";

// const PrescriptionManagement = () => {
//   const { data: preManagementData } = useGetPreManagementQuery(undefined);
//   const [deletePreManagement] = useDeletePreManagementMutation();
//   const [createPreManagement] = useCreatePreManagementMutation();

//   const [modalOpen, setModalOpen] = useState(false);


//   const handleFormSubmit = async (
//     data: Record<string, any>,
//     helpers: { reset: () => void; close: () => void }
//   ) => {
//     const formData = new FormData();

//     Object.entries(data).forEach(([key, value]) => {
//       if (key === "headerImage" && value instanceof File) {
//         formData.append("headerImage", value);
//       } else if (key === "footerImage" && value instanceof File) {
//         formData.append("footerImage", value);
//       } else {
//         formData.append(key, value);
//       }
//     });

//     const res = (await createPreManagement(formData)) as any;
//     if (res?.data?.success) {
//       helpers.reset();
//       helpers.close();
//       toast.success(res?.data?.message);
//     } else {
//       console.error();
//       toast.error(res?.error?.data?.message || "something went wrong");
//     }
//   };

//   return (
//     <div className="custom-container">
//       <div className="w-full">
//         <div className="flex items-center justify-between mb-6"></div>
//         <div className="flex items-center gap-3">

//           {preManagementData?.data?.length == 0 && (
//             <CustomModal
//               open={modalOpen}
//               setOpen={setModalOpen}
//               title="Create Prescription Video"
//               description="Fill in the form below."
//               handleFormSubmit={handleFormSubmit}
//               file={[
//                 { label: "Header Image", name: "headerImage" },
//                 { label: "Footer Image ", name: "footerImage" },
//               ]}
//               buttonProperty={{ type: "create", text: "Add Prescription" }}
//             />
//           )}
//         </div>

//         <div className="rounded-b-sm overflow-hidden shadow-sm">


//           {preManagementData?.data?.length == 0 ? (
//             <div className="flex justify-center items-center h-[80vh] font-semibold text-xs">
//               <div className="flex flex-col justify-center items-center text-yellow-900">
//                 <Info />
//                 <span>Prescription not created yet!</span>
//               </div>
//             </div>
//           ) : (<Table className="no-border">
//             <TableHeader className="no-border">
//               <TableRow className="bg-[#f7f7f7] no-border">
//                 {["SN", "Header Image", "Footer Image", "Action"].map(
//                   (header, ind) => (
//                     <TableHead
//                       key={ind}
//                       className={`${ind == 3 && "text-center"}`}
//                     >
//                       {header}
//                     </TableHead>
//                   )
//                 )}
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {preManagementData?.data?.map((item: any, index: number) => (
//                 <TableRow key={index}>
//                   <TableCell>{index + 1}</TableCell>
//                   <TableCell>
//                     <img
//                       src={item?.headerImage}
//                       alt=""
//                       className=" h-48"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <img
//                       src={item?.footerImage}
//                       alt=""
//                       className="h-48"
//                     />
//                   </TableCell>
//                   <TableCell className="text-center">
//                     <div className="flex items-center justify-center gap-2">
//                       <ConfirmAlert
//                         id={item?.id}
//                         onDeleted={deletePreManagement}
//                         person={"preManagement"}
//                       />
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PrescriptionManagement;



/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomModal from "@/components/shared/CustomModal";
import {
  useCreatePreManagementMutation,
  useDeletePreManagementMutation,
  useGetPreManagementQuery,
} from "@/redux/api/PreManagement/PreManagementApi";
import { useState } from "react";
import toast from "react-hot-toast";
import ConfirmAlert from "@/components/shared/ConfirmAlert";

const PrescriptionManagement = () => {
  const { data: preManagementData, refetch } = useGetPreManagementQuery(undefined);
  const [deletePreManagement] = useDeletePreManagementMutation();
  const [createPreManagement] = useCreatePreManagementMutation();
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const hasPrescription = preManagementData?.data?.data?.length > 0;

  console.log("preManagementData", preManagementData)

  const handleFormSubmit = async (
    data: Record<string, any>,
    helpers: { reset: () => void; close: () => void }
  ) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value);
      }
    });

    const res = (await createPreManagement(formData)) as any;
    if (res?.data?.success) {
      helpers.reset();
      helpers.close();
      toast.success(res?.data?.message);
      refetch();
    } else {
      console.error();
      toast.error(res?.error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="custom-container">
      <div className="w-full">
        <div className="flex items-center justify-between mb-6" />

        <div className="flex items-center gap-3 mb-6">
          {!hasPrescription ? (
            <CustomModal
              open={modalOpen}
              setOpen={setModalOpen}
              title="Create Prescription"
              description="Fill in the form below."
              handleFormSubmit={handleFormSubmit}
              file={[
                { label: "Header Image", name: "headerImage" },
                { label: "Footer Image", name: "footerImage" },
              ]}
              buttonProperty={{ type: "create", text: "Add Prescription UI" }}
            />
          ) : (
            <CustomModal
              open={viewModalOpen}
              setOpen={setViewModalOpen}
              title="Uploaded Prescription"
              description="You can only delete the uploaded prescription."
              buttonProperty={{ type: "create", text: "Uploaded Prescription UI" }}
              hideForm
            >
              {preManagementData?.data?.data?.map((item: any) => (
                <div key={item?.id} className="mb-6">
                  <div className="grid grid-cols-1 gap-4 mb-2">
                    <img
                      src={item?.headerImage}
                      alt="Header Image"
                      className="h-24 rounded"
                    />
                    <img
                      src={item?.footerImage}
                      alt="Footer Image"
                      className="h-24 rounded"
                    />
                  </div>
                  <div className="flex justify-end">
                    <ConfirmAlert
                      id={item?.id}
                      onDeleted={deletePreManagement}
                      person={"preManagement"}
                    />
                  </div>
                </div>
              ))}
            </CustomModal>
          )}
        </div>

      </div>
    </div>
  );
};

export default PrescriptionManagement;
