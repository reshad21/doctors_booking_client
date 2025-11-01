/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChiefComplaintSection,
  ExaminationsSection,
  DiagnosisSection,
  InvestigationSection,
  HistorySection,
  TreatmentPlanSection,
  CoMorbiditiesSection,
  MedicationsSection,
  AdviceSection,
  NextVisitSection,
} from "./PrescriptionSections/PrescriptionSections";

interface ClinicalNote {
  id: string;
  title: string;
  category: "left" | "right";
  order: number;
}

interface BodySetup {
  bodyLeftSideWidth: string;
  bodyRightSideWidth: string;
  bodyLeftSideTopMargin: string;
  bodyRightSideTopMargin: string;
  showTopLine: boolean;
  showBottomLine: boolean;
  showLeftLine: boolean;
  showRightLine: boolean;
  showMiddleLine: boolean;
}

interface DynamicSectionsProps {
  clinicalNotes: ClinicalNote[];
  prescriptionData: any;
  handlers: any;
  removeHandlers: any;
  openModal: (type: string) => void;
  bodySetup?: BodySetup | null;
}

// Map clinical note titles to their corresponding components and data
const sectionComponentMap: Record<
  string,
  {
    component: React.ComponentType<any>;
    dataKey: string;
    modalType: string;
    removeHandler: string;
  }
> = {
  "Chief Complaint": {
    component: ChiefComplaintSection,
    dataKey: "chiefComplaint",
    modalType: "chiefComplaint",
    removeHandler: "chiefComplaint",
  },
  "On Examinations": {
    component: ExaminationsSection,
    dataKey: "examinations",
    modalType: "examinations",
    removeHandler: "examination",
  },
  Diagnosis: {
    component: DiagnosisSection,
    dataKey: "diagnosis",
    modalType: "diagnosis",
    removeHandler: "diagnosis",
  },
  Investigation: {
    component: InvestigationSection,
    dataKey: "investigations",
    modalType: "investigations",
    removeHandler: "investigation",
  },
  History: {
    component: HistorySection,
    dataKey: "history",
    modalType: "history",
    removeHandler: "history",
  },
  "Treatment Plan": {
    component: TreatmentPlanSection,
    dataKey: "treatmentPlan",
    modalType: "treatmentPlan",
    removeHandler: "treatmentPlan",
  },
  "Co Morbidities": {
    component: CoMorbiditiesSection,
    dataKey: "coMorbidities",
    modalType: "coMorbidities",
    removeHandler: "coMorbidities",
  },
  Medicine: {
    component: MedicationsSection,
    dataKey: "medications",
    modalType: "medications",
    removeHandler: "medication",
  },
  Advice: {
    component: AdviceSection,
    dataKey: "advice",
    modalType: "advice",
    removeHandler: "advice",
  },
  "Next Visit": {
    component: NextVisitSection,
    dataKey: "nextVisit",
    modalType: "nextVisit",
    removeHandler: "nextVisit",
  },
};

export function DynamicPrescriptionSections({
  clinicalNotes,
  prescriptionData,
  removeHandlers,
  openModal,
  bodySetup = null,
}: DynamicSectionsProps) {
  const leftSections = clinicalNotes
    .filter((note) => note.category === "left")
    .sort((a, b) => a.order - b.order);

  const rightSections = clinicalNotes
    .filter((note) => note.category === "right")
    .sort((a, b) => a.order - b.order);

  const renderSection = (note: ClinicalNote) => {
    const config = sectionComponentMap[note.title];
    if (!config) return null;

    const { component: Component, dataKey, modalType, removeHandler } = config;
    const items = prescriptionData[dataKey];

    if (dataKey === "medications") {
      return (
        <Component
          key={note.id}
          medications={items}
          onAddClick={() => openModal(modalType)}
          onRemoveItem={removeHandlers[removeHandler]}
        />
      );
    }

    if (dataKey === "nextVisit") {
      return (
        <Component
          key={note.id}
          nextVisit={items}
          onAddClick={() => openModal(modalType)}
        />
      );
    }

    return (
      <Component
        key={note.id}
        items={items}
        onAddClick={() => openModal(modalType)}
        onRemoveItem={removeHandlers[removeHandler]}
      />
    );
  };

  // Get width percentages from bodySetup or use defaults
  const leftWidth = bodySetup?.bodyLeftSideWidth || "50";
  const rightWidth = bodySetup?.bodyRightSideWidth || "50";
  const leftTopMargin = bodySetup?.bodyLeftSideTopMargin || "0";
  const rightTopMargin = bodySetup?.bodyRightSideTopMargin || "0";
  const showMiddleLine = bodySetup?.showMiddleLine ?? true;

  console.log(leftWidth, rightWidth, 'left width', "right width")

  return (
    <div className="border p-5 mx-2 border-[#C3C3C3] rounded">
      <div className="flex gap-8">
        {/* Left Column - Dynamically rendered based on clinical notes order */}
        <div
          className={`space-y-4 ${showMiddleLine ? "border-r border-r-[#C3C3C3] pr-8" : ""}`}
          style={{
            width: `${leftWidth}%`,
            marginTop: `${leftTopMargin}px`,
          }}
        >
          {leftSections.map((note) => renderSection(note))}
        </div>

        {/* Right Column - Dynamically rendered based on clinical notes order */}
        <div
          className="space-y-4"
          style={{
            width: `${rightWidth}%`,
            marginTop: `${rightTopMargin}px`,
          }}
        >
          {rightSections.map((note) => renderSection(note))}
        </div>
      </div>
    </div>
  );
}
