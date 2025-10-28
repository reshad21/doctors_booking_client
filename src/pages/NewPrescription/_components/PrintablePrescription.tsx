import type { PrescriptionData } from "@/types/new-prescription.types";
// import PrescriptionHeader from "./PrescriptionHeader";
// import PrescriptionFooter from "./PrescriptionFooter";

interface PrintablePrescriptionProps {
  data: PrescriptionData;
}

export const PrintablePrescription = ({ data }: PrintablePrescriptionProps) => {
  console.log(data, 'ddd')
  return (
    <div className="bg-white p-8 max-w-5xl mx-auto" id="printable-prescription">
      {/* Header */}
      {/* <PrescriptionHeader /> */}

      {/* Patient Information */}
      <div className="grid grid-cols-4 gap-8 justify-items-center max-w-5xl my-5 mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Name:</span>
          <span className="text-sm">{data.patientName || ""}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Age:</span>
          <span className="text-sm w-16">{data.age || ""}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Date:</span>
          <span className="text-sm">{data.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">ID:</span>
          <span className="text-sm">{data.date}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 border p-5 mx-2 border-[#C3C3C3] rounded">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Chief Complaints */}
          {data.chiefComplaint.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Chief Complaints:</h3>
              <ul className="list-disc pl-5">
                {data.chiefComplaint.map((complaint, index) => (
                  <li key={index}>{complaint}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Examinations */}
          {data.examinations.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Examinations:</h3>
              <ul className="list-disc pl-5">
                {data.examinations.map((exam, index) => (
                  <li key={index}>{exam}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Diagnosis */}
          {data.diagnosis.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Diagnosis:</h3>
              <ul className="list-disc pl-5">
                {data.diagnosis.map((diag, index) => (
                  <li key={index}>{diag}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Investigations */}
          {data.investigations.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Investigations:</h3>
              <ul className="list-disc pl-5">
                {data.investigations.map((inv, index) => (
                  <li key={index}>{inv}</li>
                ))}
              </ul>
            </div>
          )}

          {/* History */}
          {data.history.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">History:</h3>
              <ul className="list-disc pl-5">
                {data.history.map((hist, index) => (
                  <li key={index}>{hist}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Medications */}
          {data.medications.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Medications:</h3>
              <ul className="list-none">
                {data.medications.map((med, index) => (
                  <li key={index} className="mb-2">
                    <div className="font-medium">{med.name}</div>
                    <div className="text-sm">
                      {med.dosage} - {med.frequency} - {med.duration}
                      {med.instructions && (
                        <div className="text-sm text-gray-600">
                          {med.instructions}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Advice */}
          {data.advice.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Advice:</h3>
              <ul className="list-disc pl-5">
                {data.advice.map((adv, index) => (
                  <li key={index}>{adv}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Visit */}
          {data.nextVisit && (
            <div>
              <h3 className="font-medium mb-2">Next Visit:</h3>
              <p>{data.nextVisit}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      {/* <PrescriptionFooter /> */}
    </div>
  );
};