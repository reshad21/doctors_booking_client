/* eslint-disable @typescript-eslint/no-explicit-any */
import prHead from "@/assets/pr-head.png";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useParams } from "react-router-dom";
import CreatePrescriptionForm from "../_components/CreatePrescriptionForm";
import { useCreatePrescriptionMutation } from "@/redux/api/prescription/prescription";
import { useAppSelector } from "@/redux/hooks";
import toast from "react-hot-toast";
import { useGetPreManagementQuery } from "@/redux/api/PreManagement/PreManagementApi";

const CreatePrescription = () => {
  const { data: preManagementData } = useGetPreManagementQuery(undefined);
  const [createPrescription] = useCreatePrescriptionMutation()
  const { patientId } = useParams();
  const location = useLocation();
  const patient = location.state 
  const doctorId = useAppSelector((state) => state.admin.id);
  const [testInputCount, setTestInputCount] = useState([{ content: 1 }]);
  const [medicineInputCount, setMedicineInputCount] = useState([
    { content: 1 },
  ]);
  const form = useForm();

  const handleAddTestInput = () => {
    setTestInputCount((prev) => [...prev, { content: prev.length + 1 }]);
  };
  const handleRemoveTestInput = (contentToDelete: number) => {
    setTestInputCount((prev) =>
      prev.filter((item) => item.content !== contentToDelete)
    );
  };
  const handleAddMedicineInput = () => {
    setMedicineInputCount((prev) => [...prev, { content: prev.length + 1 }]);
  };
  const handleRemoveMedicineInput = (contentToDelete: number) => {
    setMedicineInputCount((prev) =>
      prev.filter((item) => item.content !== contentToDelete)
    );
  };
  const onSubmit = async (data: any) => {
    // Prepare medicines array
    const medicineArray = medicineInputCount.map((item) => {
      const key = item.content;
      return {
        medicineName: data[`medicine${key}`],
        dosage: data[`dosage${key}`],
        day: data[`day${key}`],
        time: data[`time${key}`],
        comment: data[`comment${key}`],
      };
    });

    const testsArray = [];
    let testIndex = 1;
    while (data[`test${testIndex}`]) {
      testsArray.push({
        description: data[`test${testIndex}`],
      });
      testIndex++;
    }
    // Clean up redundant medicine fields from form data
    const cleanedData = { ...data };
    medicineInputCount.forEach((item) => {
      const key = item.content;
      delete cleanedData[`medicine${key}`];
      delete cleanedData[`dosage${key}`];
      delete cleanedData[`day${key}`];
      delete cleanedData[`time${key}`];
      delete cleanedData[`comment${key}`];
    });

    for (let i = 1; i < testIndex; i++) {
      delete cleanedData[`test${i}`];
    }
    const prescriptionData = {
      patientId,
      doctorId,
      name: cleanedData.name,
      advice: cleanedData.advice,
      nextVisit: cleanedData.nxVisit,
      medicines: medicineArray,
      tests: testsArray,
    };
    const res = await createPrescription(prescriptionData) as any
    console.log( res);
    if (res?.data?.success) {
      toast.success(res?.data?.message)
      form.reset()
    }else{
      toast.error(res?.error?.data?.message)
      console.log(res?.error?.data?.message);
    }
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
          testInputCount={testInputCount}
          medicineInputCount={medicineInputCount}
          handleRemoveTestInput={handleRemoveTestInput}
          handleRemoveMedicineInput={handleRemoveMedicineInput}
          handleAddMedicineInput={handleAddMedicineInput}
          handleAddTestInput={handleAddTestInput}
          patient={patient}
        />
        <div className="pt-[30px]">
          <img src={preManagementData?.data?.[0]?.footerImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default CreatePrescription;
