/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useParams } from "react-router-dom";
import CreatePrescriptionForm from "../_components/CreatePrescriptionForm";
import { useCreatePrescriptionMutation } from "@/redux/api/prescription/prescription";
import { useAppSelector } from "@/redux/hooks";
import toast from "react-hot-toast";
import { useGetPreManagementQuery } from "@/redux/api/PreManagement/PreManagementApi";

const CreatePrescription = () => {
  const [adviceContent, setAdviceContent] = useState("");
  const [adviceInputContent, setAdviceInputContent] = useState("");
  const { data: preManagementData } = useGetPreManagementQuery(undefined);
  const [createPrescription] = useCreatePrescriptionMutation();
  const { patientId } = useParams();
  const location = useLocation();
  const patient = location.state;
  const doctorId = useAppSelector((state) => state.admin.id);
  const [testInputCount, setTestInputCount] = useState([{ content: 1 }]);
  const [chiefComplaint, setChiefComplaint] = useState([{ content: 1 }]);
  const [onExaminations, setOnExaminations] = useState([{ content: 1 }]);
  const [investigation, setInvestigation] = useState([{ content: 1 }]);
  const [diagnosis, setDiagnosis] = useState([{ content: 1 }]);
  const [medicineInputCount, setMedicineInputCount] = useState([
    { content: 1 },
  ]);
  const form = useForm();

  const handleAddTestInput = () => {
    setTestInputCount((prev) => [...prev, { content: prev.length + 1 }]);
  };
  const handleAddChiefComplaint = () => {
    setChiefComplaint((prev) => [...prev, { content: prev.length + 1 }]);
  };
  const handleAddOnExaminations = () => {
    setOnExaminations((prev) => [...prev, { content: prev.length + 1 }]);
  };
  const handleAddInvestigation = () => {
    setInvestigation((prev) => [...prev, { content: prev.length + 1 }]);
  };
  const handleAddDiagnosis = () => {
    setDiagnosis((prev) => [...prev, { content: prev.length + 1 }]);
  };
  const handleRemoveTestInput = (contentToDelete: number) => {
    setTestInputCount((prev) =>
      prev.filter((item) => item.content !== contentToDelete)
    );
  };
  const handleRemoveChiefComplaintInput = (contentToDelete: number) => {
    setChiefComplaint((prev) =>
      prev.filter((item) => item.content !== contentToDelete)
    );
  };
  const handleRemoveOnExaminations = (contentToDelete: number) => {
    setOnExaminations((prev) =>
      prev.filter((item) => item.content !== contentToDelete)
    );
  };
  const handleRemoveInvestigation = (contentToDelete: number) => {
    setInvestigation((prev) =>
      prev.filter((item) => item.content !== contentToDelete)
    );
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
    // Prepare medicines array
    const medicineArray = medicineInputCount.map((item) => {
      const key = item.content;
      return {
        medicineName: data[`medicine${key}`],
        dosage: data[`dosage${key}`],
        day: `${data[`day${key}`]}-দিন`,
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
    const diagnosisArray:any[] = [];
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
      patientId,
      doctorId,
      name: cleanedData.name,
      advice: `${adviceContent} ${adviceInputContent}`,
      nextVisit: cleanedData.nxVisit,
      medicines: medicineArray,
      tests: testsArray,
      chiefComplaint: chiefComplaintArray,
      onExaminations: onExaminationsArray,
      diagnosis: diagnosisArray,
      investigation: investigationArray,
    };
    
    const res = (await createPrescription(prescriptionData)) as any;
    console.log(res);
    if (res?.data?.success) {
      toast.success(res?.data?.message);
      form.reset();
    } else {
      toast.error(res?.error?.data?.message);
      console.log(res?.error?.data?.message);
    }
  };
 
  
  console.log(adviceContent,"line number 97");
  console.log(adviceInputContent,"line number 98");
  
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
          chiefComplaint={chiefComplaint}
          onExaminations={onExaminations}
          medicineInputCount={medicineInputCount}
          handleRemoveTestInput={handleRemoveTestInput}
          handleRemoveChiefComplaintInput={handleRemoveChiefComplaintInput}
          handleRemoveMedicineInput={handleRemoveMedicineInput}
          handleAddMedicineInput={handleAddMedicineInput}
          handleAddTestInput={handleAddTestInput}
          handleAddChiefComplaint={handleAddChiefComplaint}
          patient={patient}
          handleAdviceChange={setAdviceContent}
          handleAdviceInputChange={setAdviceInputContent}
          handleAddOnExaminations={handleAddOnExaminations}
          handleRemoveOnExaminations={handleRemoveOnExaminations}
          diagnosis={diagnosis}
          handleRemoveDiagnosis={handleRemoveDiagnosis}
          handleAddDiagnosis={handleAddDiagnosis}
          investigation={investigation}
          handleRemoveInvestigation={handleRemoveInvestigation}
          handleAddInvestigation={handleAddInvestigation}
        />
        <div className="pt-[30px]">
          <img src={preManagementData?.data?.[0]?.footerImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default CreatePrescription;
