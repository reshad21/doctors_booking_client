/* eslint-disable @typescript-eslint/no-explicit-any */
import prHead from "@/assets/pr-head.png";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {useUpdatePrescriptionMutation } from "@/redux/api/prescription/prescription";
import toast from "react-hot-toast";
import UpdatePrescriptionForm from "./_components/UpdatePrescriptionForm";
import { useLocation, useNavigate } from "react-router-dom";

const UpdatePrescription = () => {
  const [updatePrescription] = useUpdatePrescriptionMutation();
  const location = useLocation();
  const navigate = useNavigate()
  const { perception } = location.state || {};
  const [testInputCount, setTestInputCount] = useState([{ content: 1 }]);
  const [medicineInputCount, setMedicineInputCount] = useState([{ content: 1 }]);
  const form = useForm();
  
  useEffect(() => {
    if (perception) {
      setMedicineInputCount(
        perception.medicines?.map((_: any, index: number) => ({ content: index + 1 })) || [{ content: 1 }]
      );
      setTestInputCount(
        perception.tests?.map((_: any, index: number) => ({ content: index + 1 })) || [{ content: 1 }]
      );

      form.reset({
        name: perception.patient?.name,
        age: perception.patient?.age,
        weight: perception.patient?.weight,
        advice: perception.advice,
        nxVisit: perception.nextVisit,
        date:perception?.createdAt.split("T")[0],
        ...Object.fromEntries(
          perception.medicines.map((item: any, index: number) => [
            [`medicine${index + 1}`],
            item.medicineName,
          ])
        ),
        ...Object.fromEntries(
          perception.medicines.map((item: any, index: number) => [
            [`dosage${index + 1}`],
            item.dosage,
          ])
        ),
        ...Object.fromEntries(
          perception.medicines.map((item: any, index: number) => [
            [`day${index + 1}`],
            item.day,
          ])
        ),
        ...Object.fromEntries(
          perception.medicines.map((item: any, index: number) => [
            [`time${index + 1}`],
            item.time,
          ])
        ),
        ...Object.fromEntries(
          perception.medicines.map((item: any, index: number) => [
            [`comment${index + 1}`],
            item.comment,
          ])
        ),
        ...Object.fromEntries(
          perception.tests.map((item: any, index: number) => [
            [`test${index + 1}`],
            item.description,
          ])
        ),
      });
    }
  }, [perception, form]);

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
      id:perception?.id,
      advice: cleanedData.advice,
      nextVisit: cleanedData.nxVisit,
      medicines: medicineArray,
      tests: testsArray,
    };
    
    const res = (await updatePrescription(prescriptionData)) as any;  
    if (res?.data?.success) {
      toast.success(res?.data?.message);
      navigate(`/dashboard/view-prescription/${perception?.patientId}`)
      form.reset();
    } else {
      toast.error(res?.error?.data?.message);
    }
  };

  return (
    <div className="custom-container mt-[30px]">
      <div className="p-5 bg-white">
        <div className="pb-[30px]">
          <img src={prHead} alt="" />
        </div>
        <UpdatePrescriptionForm
          form={form}
          onSubmit={onSubmit}
          testInputCount={testInputCount}
          medicineInputCount={medicineInputCount}
          handleRemoveTestInput={handleRemoveTestInput}
          handleRemoveMedicineInput={handleRemoveMedicineInput}
          handleAddMedicineInput={handleAddMedicineInput}
          handleAddTestInput={handleAddTestInput}
          patientId={perception?.patientId}
        />
        <div className="pt-[30px]">
          <img src={prHead} alt="" />
        </div>
      </div>
    </div>
  );
};
export default UpdatePrescription;