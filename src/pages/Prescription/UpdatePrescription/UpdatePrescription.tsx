/* eslint-disable @typescript-eslint/no-explicit-any */
import prHead from "@/assets/pr-head.png";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdatePrescriptionMutation } from "@/redux/api/prescription/prescription";
import toast from "react-hot-toast";
import UpdatePrescriptionForm from "./_components/UpdatePrescriptionForm";
import { useLocation, useNavigate } from "react-router-dom";

const UpdatePrescription = () => {
  const [updatePrescription] = useUpdatePrescriptionMutation();
  const location = useLocation();
  const navigate = useNavigate();
  const { perception } = location.state || {};
  const [testInputCount, setTestInputCount] = useState([{ content: 1 }]);
  const [chiefComplaint, setChiefComplaint] = useState([{ content: 1 }]);
  const [onExaminations, setOnExaminations] = useState([{ content: 1 }]);
  const [investigation, setInvestigation] = useState([{ content: 1 }]);
  const [diagnosis, setDiagnosis] = useState([{ content: 1 }]);
  const [medicineInputCount, setMedicineInputCount] = useState([
    { content: 1 },
  ]);

  const form = useForm();

  useEffect(() => {
    if (perception) {
      setMedicineInputCount(
        perception.medicines?.map((_: any, index: number) => ({
          content: index + 1,
        })) || [{ content: 1 }]
      );
      setTestInputCount(
        perception.tests?.map((_: any, index: number) => ({
          content: index + 1,
        })) || [{ content: 1 }]
      );
      setChiefComplaint(
        perception.chiefComplaint?.map((_: any, index: number) => ({
          content: index + 1,
        })) || [{ content: 1 }]
      );

      setOnExaminations(
        perception.onExaminations?.map((_: any, index: number) => ({
          content: index + 1,
        })) || [{ content: 1 }]
      );
      setInvestigation(
        perception.investigation?.map((_: any, index: number) => ({
          content: index + 1,
        })) || [{ content: 1 }]
      );
      setDiagnosis(
        perception.diagnosis?.map((_: any, index: number) => ({
          content: index + 1,
        })) || [{ content: 1 }]
      );

      const defaultValues: Record<string, any> = {
        name: perception.patient?.name,
        age: perception.patient?.age,
        weight: perception.patient?.weight,
        advice: perception.advice,
        nxVisit: perception.nextVisit,
        date: perception?.createdAt.split("T")[0],
      };

      perception.medicines?.forEach((item: any, index: number) => {
        const key = index + 1;
        defaultValues[`medicine${key}`] = item.medicineName;
        defaultValues[`dosage${key}`] = item.dosage;
        defaultValues[`day${key}`] = item.day;
        defaultValues[`time${key}`] = item.time;
        defaultValues[`comment${key}`] = item.comment;
      });

      perception.tests?.forEach((item: any, index: number) => {
        defaultValues[`test${index + 1}`] = item.description;
      });
      perception.chiefComplaint?.forEach((item: any, index: number) => {
        defaultValues[`chiefComplaint${index + 1}`] = item.description;
      });
      perception.diagnosis?.forEach((item: any, index: number) => {
        defaultValues[`diagnosis${index + 1}`] = item.description;
      });
      perception.investigation?.forEach((item: any, index: number) => {
        defaultValues[`investigation${index + 1}`] = item.description;
      });
      perception.onExaminations?.forEach((item: any, index: number) => {
        defaultValues[`onExaminations${index + 1}`] = item.description;
      });

      form.reset(defaultValues);
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
  const handleAddChiefComplaint = () => {
    setChiefComplaint((prev) => [...prev, { content: prev.length + 1 }]);
  };

  const handleRemoveChiefComplaint = (contentToDelete: number) => {
    setChiefComplaint((prev) =>
      prev.filter((item) => item.content !== contentToDelete)
    );
  };
  const handleAddOnExaminations = () => {
    setOnExaminations((prev) => [...prev, { content: prev.length + 1 }]);
  };
  const handleRemoveOnExaminations = (contentToDelete: number) => {
    setOnExaminations((prev) =>
      prev.filter((item) => item.content !== contentToDelete)
    );
  };
  const handleAddInvestigation = () => {
    setInvestigation((prev) => [...prev, { content: prev.length + 1 }]);
  };

  const handleRemoveInvestigation = (contentToDelete: number) => {
    setInvestigation((prev) =>
      prev.filter((item) => item.content !== contentToDelete)
    );
  };
  const handleAddDiagnosis = () => {
    setDiagnosis((prev) => [...prev, { content: prev.length + 1 }]);
  };

  const handleRemoveDiagnosis = (contentToDelete: number) => {
    setDiagnosis((prev) =>
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

    const chiefComplaintArray = [];
    let chiefComplaintIndex = 1;
    while (data[`chiefComplaint${chiefComplaintIndex}`]) {
      chiefComplaintArray.push({
        description: data[`chiefComplaint${chiefComplaintIndex}`],
      });
      chiefComplaintIndex++;
    }
    const diagnosisArray: any[] = [];
    let diagnosisIndex = 1;
    while (data[`diagnosis${diagnosisIndex}`]) {
      diagnosisArray.push({
        description: data[`diagnosis${diagnosisIndex}`],
      });
      diagnosisIndex++;
    }
    const onExaminationsArray: any[] = [];
    let onExaminationsIndex = 1;
    while (data[`onExaminations${onExaminationsIndex}`]) {
      onExaminationsArray.push({
        description: data[`onExaminations${onExaminationsIndex}`],
      });
      onExaminationsIndex++;
    }
    const investigationArray: any[] = [];
    let investigationIndex = 1;
    while (data[`investigation${investigationIndex}`]) {
      investigationArray.push({
        description: data[`investigation${investigationIndex}`],
      });
      investigationIndex++;
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
    for (let i = 1; i < chiefComplaintIndex; i++) {
      delete cleanedData[`chiefComplaint${i}`];
    }
    for (let i = 1; i < onExaminationsIndex; i++) {
      delete cleanedData[`onExaminations${i}`];
    }
    for (let i = 1; i < diagnosisIndex; i++) {
      delete cleanedData[`diagnosis${i}`];
    }
    for (let i = 1; i < investigationIndex; i++) {
      delete cleanedData[`investigation${i}`];
    }
    const prescriptionData = {
      id:perception?.id,
      name: cleanedData.name,
      advice: cleanedData.advice,
      nextVisit: cleanedData.nxVisit,
      medicines: medicineArray,
      tests: testsArray,
      chiefComplaint: chiefComplaintArray,
      onExaminations: onExaminationsArray,
      diagnosis: diagnosisArray,
      investigation: investigationArray,
    };
console.log(prescriptionData);

    const res = (await updatePrescription(prescriptionData)) as any;
    console.log(res);
    
    if (res?.data?.success) {
      toast.success(res?.data?.message);
      navigate(`/dashboard/view-prescription/${perception?.patientId}`);
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
          patient={perception?.patient}
          handleRemoveChiefComplaint={handleRemoveChiefComplaint}
          handleAddChiefComplaint={handleAddChiefComplaint}
          chiefComplaint={chiefComplaint}
          onExaminations={onExaminations}
          investigation={investigation}
          diagnosis={diagnosis}
          handleRemoveOnExaminations={handleRemoveOnExaminations}
          handleAddOnExaminations={handleAddOnExaminations}
          handleAddInvestigation={handleAddInvestigation}
          handleRemoveInvestigation={handleRemoveInvestigation}
          handleRemoveDiagnosis={handleRemoveDiagnosis}
          handleAddDiagnosis={handleAddDiagnosis}
        />
        <div className="pt-[30px]">
          <img src={prHead} alt="" />
        </div>
      </div>
    </div>
  );
};

export default UpdatePrescription;
