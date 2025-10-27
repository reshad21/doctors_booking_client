import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  // instructions can be a formatted string (what we store in PrescriptionData)
  // or the object shape while editing. Accept both to avoid type errors.
  instructions?:
    | string
    | {
        beforeEating?: boolean;
        afterEating?: boolean;
        notes?: string;
      };
}

interface BaseSectionProps {
  onAddClick: () => void;
}

interface ListSectionProps extends BaseSectionProps {
  items: string[];
  onRemoveItem: (index: number) => void;
}

interface MedicationSectionProps extends BaseSectionProps {
  medications: Medication[];
  onRemoveItem: (index: number) => void;
}

interface NextVisitSectionProps extends BaseSectionProps {
  nextVisit: string;
}

// Base Section Component
interface SectionWrapperProps {
  title: string;
  children: React.ReactNode;
  onAddClick: () => void;
  minHeight?: string;
  className?: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  title,
  children,
  onAddClick,
  minHeight = "40px",
  className,
}) => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      {/* <h3 className="text-lg font-bold"> */}
      <h3 className={`${title === "Rx" ? "text-lg font-extrabold" : "font-semibold"}`}>
        {title}
      </h3>
      <Button
        variant="ghost"
        size="sm"
        onClick={onAddClick}
        className="p-1 h-5 w-5 border cursor-pointer text-green-600 hover:bg-blue-50"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
    <div className={cn("text-sm", className)} style={{ minHeight }}>
      {children}
    </div>
  </div>
);

// Chief Complaint Section
export const ChiefComplaintSection: React.FC<ListSectionProps> = ({
  items,
  onAddClick,
  onRemoveItem,
}) => {
  return (
    <SectionWrapper title="Chief Complaint" onAddClick={onAddClick}>
      {items.map((item, index) => (
        <div
          key={index}
          className="mb-1 flex items-start justify-between group"
        >
          <div className="flex-1">• {item}</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveItem(index)}
            className="p-1 h-5 w-5 text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </SectionWrapper>
  );
};

// Examinations Section
export const ExaminationsSection: React.FC<ListSectionProps> = ({
  items,
  onAddClick,
  onRemoveItem,
}) => (
  <SectionWrapper title="On Examinations" onAddClick={onAddClick}>
    {items.map((item, index) => (
      <div key={index} className="mb-1 flex items-start justify-between group">
        <div className="flex-1">• {item}</div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemoveItem(index)}
          className="p-1 h-5 w-5 text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    ))}
  </SectionWrapper>
);

// Diagnosis Section
export const DiagnosisSection: React.FC<ListSectionProps> = ({
  items,
  onAddClick,
  onRemoveItem,
}) => (
  <SectionWrapper title="Diagnosis" onAddClick={onAddClick}>
    {items.map((item, index) => (
      <div key={index} className="mb-1 flex items-start justify-between group">
        <div className="flex-1">• {item}</div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemoveItem(index)}
          className="p-1 h-5 w-5 text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    ))}
  </SectionWrapper>
);

// Investigation Section
export const InvestigationSection: React.FC<ListSectionProps> = ({
  items,
  onAddClick,
  onRemoveItem,
}) => (
  <SectionWrapper title="Investigation" onAddClick={onAddClick}>
    {items.map((item, index) => {
      const [label, result] = item.split('[Result:').map(s => s.trim());
      const hasResult = result && result.endsWith(']');
      
      return (
        <div key={index} className="mb-1 flex items-start justify-between group">
          <div className="flex-1">
            <span>• {label}</span>
            {hasResult && (
              <span className="ml-2 text-blue-500 text-sm">
                {result.slice(0, -1)}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveItem(index)}
            className="p-1 h-5 w-5 text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      );
    })}
  </SectionWrapper>
);

// History Section
export const HistorySection: React.FC<ListSectionProps> = ({
  items,
  onAddClick,
  onRemoveItem,
}) => (
  <SectionWrapper title="History" onAddClick={onAddClick}>
    {items.map((item, index) => (
      <div key={index} className="mb-1 flex items-start justify-between group">
        <div className="flex-1">• {item}</div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemoveItem(index)}
          className="p-1 h-5 w-5 text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    ))}
  </SectionWrapper>
);

// Medications Section (Rx)
export const MedicationsSection: React.FC<MedicationSectionProps> = ({
  medications,
  onAddClick,
  onRemoveItem,
}) => {

  return (
    <SectionWrapper title="Rx" onAddClick={onAddClick} minHeight="200px">
      {medications.map((med, index) => {
        const isTabletCapsule = med.dosage && med.dosage.includes("+");

        // ✅ Handle both object or string instructions
        let instructionText = "";
        if (med.instructions) {
          if (typeof med.instructions === "object") {
            const { beforeEating, afterEating, notes } = med.instructions;
            const parts: string[] = [];
            if (beforeEating) parts.push("Before eating");
            if (afterEating) parts.push("After eating");
            if (notes && notes.trim()) parts.push(`Note: ${notes}`);
            instructionText = parts.join(" - ");
          } else if (typeof med.instructions === "string") {
            const parts: string[] = (med.instructions as string)
              .split(";")
              .map((p: string) => p.trim())
              .filter(Boolean);
            instructionText = parts.join(" - ");
          }
        }

        // ✅ Build summary
        let summary = "";
        if (isTabletCapsule) {
          summary = `${med.dosage}`;
          if (med.duration) summary += ` for ${med.duration}`;
          if (instructionText) summary += ` (${instructionText})`;
        } else {
          summary = `${med.dosage}`;
          if (med.frequency) summary += ` ${med.frequency}`;
          if (med.duration) summary += ` for ${med.duration}`;
          if (instructionText) summary += ` (${instructionText})`;
        }

        return (
          <div key={index} className="mb-3 flex items-center justify-between">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2 flex-1">
                <span className="rx-number">{index + 1}.</span>
                <div>
                  <div className="font-medium">{med.name}</div>
                  <div className="text-xs text-gray-600 ml-4">{summary}</div>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveItem(index)}
              className="p-1 size-14 text-red-500 cursor-pointer"
            >
              <Trash2 className="size-5" />
            </Button>
          </div>
        );
      })}
    </SectionWrapper>
  );
};

// Advice Section
export const AdviceSection: React.FC<ListSectionProps> = ({
  items,
  onAddClick,
  onRemoveItem,
}) => (
  <SectionWrapper title="Advice" onAddClick={onAddClick} minHeight="60px">
    {items.map((item, index) => (
      <div key={index} className="mb-1 flex items-start justify-between group">
        <div className="flex-1">• {item}</div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemoveItem(index)}
          className="p-1 h-5 w-5 text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    ))}
  </SectionWrapper>
);

// Next Visit Section
export const NextVisitSection: React.FC<NextVisitSectionProps> = ({
  nextVisit,
  onAddClick,
}) => (
  <SectionWrapper title="Next Visit" onAddClick={onAddClick}>
    {nextVisit}
  </SectionWrapper>
);
