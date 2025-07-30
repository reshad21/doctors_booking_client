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
import { useCreateAdviceMutation } from "@/redux/api/advice/advice";

const PrescriptionManagement = () => {
  const { data: preManagementData, refetch } =
    useGetPreManagementQuery(undefined);
  const [deletePreManagement] = useDeletePreManagementMutation();
  const [createPreManagement] = useCreatePreManagementMutation();
  const [createAdvice] = useCreateAdviceMutation();

  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [viewPrescriptionModalOpen, setViewPrescriptionModalOpen] =
    useState(false);
  const [articleModalOpen, setArticleModalOpen] = useState(false);

  const hasPrescription = preManagementData?.data?.length > 0;

  const handlePrescriptionSubmit = async (
    data: Record<string, any>,
    helpers: { reset: () => void; close: () => void }
  ) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const res = (await createPreManagement(formData)) as any;
    if (res?.data?.success) {
      helpers.reset();
      helpers.close();
      toast.success(res?.data?.message);
      refetch();
    } else {
      toast.error(res?.error?.data?.message || "Something went wrong");
    }
  };

  const handleAdviceSubmit = async (
    data: Record<string, any>,
    helpers: { reset: () => void; close: () => void }
  ) => {
    const res = await createAdvice(data);
    console.log("Article Submitted:", data);

    if (res?.data?.success) {
      toast.success(res?.data?.message);
      helpers.reset();
      helpers.close();
    } else {
      toast.error("Failed to create advice");
      console.log("Error creating advice:", res?.error)
    }
  };

  return (
    <div className="custom-container">
      <div className="w-full">
        <div className="flex items-center justify-between" />

        <div className="flex flex-col md:flex-row items-center gap-4 py-4 px-4 bg-white rounded">
          {/* Prescription Modal */}
          {!hasPrescription ? (
            <CustomModal
              open={prescriptionModalOpen}
              setOpen={setPrescriptionModalOpen}
              title="Create Prescription"
              description="Fill in the form below."
              handleFormSubmit={handlePrescriptionSubmit}
              file={[
                { label: "Header Image", name: "headerImage" },
                { label: "Footer Image", name: "footerImage" },
              ]}
              buttonProperty={{ type: "create", text: "Add Prescription" }}
            />
          ) : (
            <CustomModal
              open={viewPrescriptionModalOpen}
              setOpen={setViewPrescriptionModalOpen}
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

          {/* Article Modal with TipTap Editor */}
          <CustomModal
            open={articleModalOpen}
            setOpen={setArticleModalOpen}
            title="Create Advice"
            description="Fill the form to create a new advice"
            input={[{ label: "Title", name: "title", type: "text" }]}
            richTextEditor={{ name: "content", label: "Content" }}
            buttonProperty={{ type: "create", text: "Patient Advice" }}
            handleFormSubmit={handleAdviceSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default PrescriptionManagement;
