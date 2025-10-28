import Preview from "@/components/shared/Preview";
import { BriefcaseMedical } from "lucide-react";

interface PrescriptionHeader {
  id: string;
  prescriptionSetupId: string;
  logo: string;
  doctorInfoBangla: string;
  doctorInfoEnglish: string;
  showLogo: boolean;
  showPrescriptionHeader: boolean;
  showPrescriptionInBangla: boolean;
  showPrescriptionInEnglish: boolean;
  createdAt: string;
  updatedAt: string;
}

const PrescriptionHeader = ({ data }: { data: PrescriptionHeader }) => {
  if (!data.showPrescriptionHeader) {
    return null;
  }

  return (
    <div className="flex justify-between items-start border border-[#C3C3C3] bg-white p-5 mx-2 rounded-xl">
      {data.showPrescriptionInBangla && (
        <div className="flex items-start gap-4">
          <div>
            <Preview
              content={data.doctorInfoBangla}
              details
              className="text-sm text-gray-600"
            />
          </div>
        </div>
      )}

      {data.showLogo && (
        <div className="size-28 flex items-center justify-center flex-shrink-0">
          {data.logo ? (
            <img
              src={data.logo}
              alt="Doctor Logo"
              className="size-24 object-contain"
            />
          ) : (
            <BriefcaseMedical className="size-14" strokeWidth={1.2} />
          )}
        </div>
      )}

      {data.showPrescriptionInEnglish && (
        <div className="text-right">
          <Preview
            content={data.doctorInfoEnglish}
            details
            className="text-sm text-gray-600"
          />
        </div>
      )}
    </div>
  );
};

export default PrescriptionHeader;
