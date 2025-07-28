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
import SerialControlPage from "./_components/SerialNavigator";

const PrescriptionManagement = () => {
  const { data: preManagementData, refetch } =
    useGetPreManagementQuery(undefined);
  const [deletePreManagement] = useDeletePreManagementMutation();
  const [createPreManagement] = useCreatePreManagementMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const hasPrescription = preManagementData?.data?.length > 0;

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
              buttonProperty={{ type: "create", text: "Add Prescription" }}
            />
          ) : (
            <CustomModal
              open={viewModalOpen}
              setOpen={setViewModalOpen}
              title="Uploaded Prescription"
              description="You can only delete the uploaded prescription."
              buttonProperty={{ type: "create", text: "Uploaded Prescription" }}
              hideForm
            >
              {preManagementData?.data?.map((item: any) => (
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
        <SerialControlPage />
      </div>
    </div>
  );
};

export default PrescriptionManagement;
