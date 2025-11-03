import { useState } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import PrescriptionHeader from "./_components/PrescriptionHeader";
import PrescriptionFooter from "./_components/PrescriptionFooter";
import { PrescriptionModals } from "./PrescriptionModals/PrescriptionModals";
import { usePrescriptionData, type AdviceItem, type CoMorbiditiesItem, type ComplaintItem, type DiagnosisItem, type ExaminationItem, type FamilyItem, type GeneralItem, type InvestigationItem, type MedicationItem, type PersonalItem, type TreatmentPlanItem } from "./hook/usePrescriptionData";
import { useGetPrescriptionPageSetupsQuery } from "@/redux/api/PreManagement/PrescriptionPageSetupApi";
import { useGetClinicTemplateQuery } from "@/redux/api/clinicalNoteTemplate/clinicalNoteTemplate";
import { DynamicPrescriptionSections } from "./DynamicPrescriptionSection";
import { useGetSinglePatientQuery } from "@/redux/api/patient/patient";
import { useParams } from "react-router-dom";
import { useCreatePrescriptionMutation } from "@/redux/api/prescription/prescription";

const defaultClinicalNotes = [
  { id: "left-1", title: "Chief Complaint", category: "left", isShow: true },
  { id: "left-2", title: "On Examinations", category: "left", isShow: true },
  { id: "left-3", title: "Diagnosis", category: "left", isShow: true },
  { id: "left-4", title: "Investigation", category: "left", isShow: true },
  { id: "left-5", title: "History", category: "left", isShow: true },
  { id: "left-6", title: "Treatment Plan", category: "left", isShow: true },
  { id: "left-7", title: "Co Morbidities", category: "left", isShow: true },
  { id: "right-1", title: "Medicine", category: "right", isShow: true },
  { id: "right-2", title: "Advice", category: "right", isShow: true },
  { id: "right-3", title: "Next Visit", category: "right", isShow: true },
];

export default function NewPrescription() {
  const { patientId } = useParams<{ patientId: string }>()
  const { data: patientData, isLoading: isPatientLoading } = useGetSinglePatientQuery(patientId)
  const { prescriptionData, handlers, removeHandlers, rawPrescriptionData } = usePrescriptionData();
  const [createPrescription] = useCreatePrescriptionMutation()
  const { data: prescriptionPageData, isLoading } =
    useGetPrescriptionPageSetupsQuery({});
  const { data: clinicalData } = useGetClinicTemplateQuery({});
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (type: string) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);
  const handlePrint = () => window.print();

  const handleSubmit = async () => {
    try {
      const preparedData = {
        patientId,

        chiefComplaint: rawPrescriptionData.chiefComplaint?.complaints?.map((c: ComplaintItem) => ({
          label: c.label,
          duration: c.duration,
          unit: c.unit,
          notes: c.notes,
        })) || [],

        onExaminations: rawPrescriptionData.examinations?.examinations?.map((e: ExaminationItem) => ({
          label: e.label,
          notes: e.notes,
        })) || [],

        diagnosis: rawPrescriptionData.diagnosis?.diagnosis?.map((d: DiagnosisItem) => ({
          label: d.label,
          notes: d.notes,
        })) || [],

        investigation: rawPrescriptionData.investigations?.investigations?.map((i: InvestigationItem) => ({
          label: i.label,
          notes: i.notes,
        })) || [],

        advice: rawPrescriptionData.advice?.advices?.map((a: AdviceItem) => ({
          label: a.label,
          notes: a.notes,
        })) || [],

        treatmentPlan: rawPrescriptionData.treatmentPlan?.treatmentPlan?.map((t: TreatmentPlanItem) => ({
          label: t.label,
          notes: t.notes,
        })) || [],

        coMorbidities: rawPrescriptionData.coMorbidities?.coMorbidities?.map((c: CoMorbiditiesItem) => ({
          label: c.label,
          notes: c.notes,
        })) || [],

        medication: rawPrescriptionData.medications?.medications?.map((m: MedicationItem) => ({
          name: m.name,
          dosage: m.dosage,
          frequency: m.frequency,
          duration: m.duration,
          showInPrescription: m.showInPrescription,
          instructionNotes: {
            beforeEating: m.instructions?.beforeEating,
            afterEating: m.instructions?.afterEating,
            notes: m.instructions?.notes,
          },
        })) || [],

        nextVisit: {
          durationType: rawPrescriptionData.nextVisit?.nextVisit?.durationType,
          durationValue: rawPrescriptionData.nextVisit?.nextVisit?.durationValue,
          notes: rawPrescriptionData.nextVisit?.nextVisit?.notes,
          showInReport: rawPrescriptionData.nextVisit?.nextVisit?.showInReport,
          withPatient: rawPrescriptionData.nextVisit?.nextVisit?.withPatient,
        },

        history: [
          {
            general: rawPrescriptionData.history?.general?.map((h: GeneralItem) => ({
              label: h.label,
              duration: h.duration,
              unit: h.unit,
              notes: h.notes,
            })) || [],
            drug: rawPrescriptionData.history?.drugs?.map((d: string) => ({
              drugName: d,
            })) || [],
            investigation: rawPrescriptionData.history?.investigations?.map((i: InvestigationItem) => ({
              label: i.label,
              notes: i.notes,
            })) || [],
            personal: rawPrescriptionData.history?.personal?.map((p: PersonalItem) => ({
              label: p.label,
              duration: p.duration,
              unit: p.unit,
              notes: p.notes,
            })) || [],
            family: rawPrescriptionData.history?.family?.map((f: FamilyItem) => ({
              label: f.label,
              duration: f.duration,
              unit: f.unit,
              notes: f.notes,
            })) || [],
          },
        ],
      };

      // 2️⃣ Call mutation
      const res = await createPrescription(preparedData).unwrap();

      // 3️⃣ Handle success
      console.log("Prescription created successfully:", res);
      alert("Prescription saved successfully!");
    } catch (err) {
      console.error("Failed to create prescription:", err);
      alert("Something went wrong while saving the prescription.");
    }
  };

  const headerData =
    prescriptionPageData?.data?.[0]?.PrescriptionHeader?.[0] || null;
  const footerData =
    prescriptionPageData?.data?.[0]?.PrescriptionFooter?.[0] || null;
  const bodySetupData =
    prescriptionPageData?.data?.[0]?.PrescriptionBodySetup?.[0] || null;


  const clinicalNotesFromApi = clinicalData?.data?.notes || [];

  const clinicalNotes =
    clinicalNotesFromApi && clinicalNotesFromApi.length > 0
      ? clinicalNotesFromApi
      : defaultClinicalNotes;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-slate-100">
      <style>{`
        @media print {
          body {
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            background: white !important;
          }
        }
      `}</style>

      <div className="max-w-5xl mx-auto pt-2 print-container">
        {/* Print and Submit Buttons */}
        <div className="flex justify-end gap-2 mb-4 no-print mr-2">
          <Button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white"
          >
            Submit Prescription
          </Button>
          <Button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 cursor-pointer text-white"
          >
            <Printer className="h-4 w-4" />
            Print Prescription
          </Button>
        </div>

        <div>
          {/* Header */}
          <PrescriptionHeader data={headerData} />

          {/* Patient Information */}
          {!isPatientLoading && (<div className="grid grid-cols-4 gap-8 justify-items-center max-w-5xl my-5 mx-auto">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Name:</span>
              <span className="text-sm">{patientData?.data?.name || "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Age:</span>
              <span className="text-sm w-16">{patientData?.data?.age || "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Gender:</span>
              <span className="text-sm">{patientData?.data?.gender || "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Phone:</span>
              <span className="text-sm">{patientData?.data?.phoneNumber || "—"}</span>
            </div>
          </div>)}


          <DynamicPrescriptionSections
            clinicalNotes={clinicalNotes}
            prescriptionData={prescriptionData}
            handlers={handlers}
            removeHandlers={removeHandlers}
            openModal={openModal}
            bodySetup={bodySetupData}
          />

          {/* Footer */}
          <PrescriptionFooter data={footerData} />
        </div>

        {/* All Modals */}
        <PrescriptionModals
          activeModal={activeModal}
          onClose={closeModal}
          handlers={handlers}
          prescriptionData={prescriptionData}
        />
      </div>
    </div>
  );
}
