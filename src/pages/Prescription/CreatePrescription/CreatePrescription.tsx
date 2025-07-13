/* eslint-disable @typescript-eslint/no-explicit-any */
import prHead from "@/assets/pr-head.png";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import CreatePrescriptionForm from "../_components/CreatePrescriptionForm";

const CreatePrescription = () => {
  const { patientId } = useParams();

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
    // Final object matching your backend expectation
    const finalData = {
      patientId,
      doctorId: cleanedData.doctorId,
      name: cleanedData.name,
      advice: cleanedData.advice,
      nextVisit: cleanedData.nxVisit,
      medicines: medicineArray,
      tests: testsArray,
    };
    console.log("Final Data for Backend:", finalData);
  };

  return (
    <div className="custom-container mt-[30px]">
      <div className="p-5 bg-white">
        <div className="pb-[30px]">
          <img src={prHead} alt="" />
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
        />
        <div className="pt-[30px]">
          <img src={prHead} alt="" />
        </div>
      </div>
    </div>
  );
};

export default CreatePrescription;
