/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import CreatePrescriptionForm from "../_components/CreatePrescriptionForm";
import { useGetPreManagementQuery } from "@/redux/api/PreManagement/PreManagementApi";

const CreatePrescription = () => {
  const [adviceContent, setAdviceContent] = useState("");
  const [adviceInputContent, setAdviceInputContent] = useState("");
  const { data: preManagementData } = useGetPreManagementQuery(undefined);
  // const [createPrescription] = useCreatePrescriptionMutation();
  // const { patientId } = useParams();
  const location = useLocation();
  const patient = location.state;
  // const doctorId = useAppSelector((state) => state.admin.id);
  const [medicineInputCount, setMedicineInputCount] = useState([
    { content: 1 },
  ]);
  const form = useForm();

  const handleAddMedicineInput = () => {
    setMedicineInputCount((prev) => [...prev, { content: prev.length + 1 }]);
  };
  const handleRemoveMedicineInput = (contentToDelete: number) => {
    setMedicineInputCount((prev) =>
      prev.filter((item) => item.content !== contentToDelete)
    );
  };
  const onSubmit = async (data: any) => {
    console.log(data);
  };

  return (
    <div className="custom-container mt-[30px]">
      <div className="p-5 bg-white">
        <div className="pb-[30px]">
          <img src={preManagementData?.data?.[0]?.headerImage} alt="" />
        </div>
        <CreatePrescriptionForm
          form={form}
          onSubmit={onSubmit}
          patient={patient}
          handleAdviceChange={setAdviceContent}
          medicineInputCount={medicineInputCount}
          handleRemoveMedicineInput={handleRemoveMedicineInput}
          handleAddMedicineInput={handleAddMedicineInput}
          handleAdviceInputChange={setAdviceInputContent}
        />
        <div className="pt-[30px]">
          <img src={preManagementData?.data?.[0]?.footerImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default CreatePrescription;
