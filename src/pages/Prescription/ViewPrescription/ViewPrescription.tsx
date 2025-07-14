/* eslint-disable @typescript-eslint/no-explicit-any */
import prHead from "@/assets/pr-head.png";
import { useGetPerceptionByPatientIdQuery } from "@/redux/api/prescription/prescription";
import { Edit, Printer } from "lucide-react";
import { useParams } from "react-router-dom";

const ViewPrescription = () => {
  const { patientId } = useParams();
  const { data: perceptions } = useGetPerceptionByPatientIdQuery(patientId);
  console.log(perceptions?.data);

  const patient = {
    name: "Asif Khan",
    age: "20 Years",
    date: "20/04/2025",
    id: "20052503",
  };
  return (
    <div>
      {perceptions?.data?.map((medic: any) => {
        console.log(medic);

        return (
          <div className="m-5">
            <div className="flex justify-start items-center gap-2 pb-2">
              <button className=" flex justify-center items-center gap-2 bg-brand text-white py-1 px-3 rounded-sm">
                <Printer className="size-4  text-white"/>
                <span>Print</span>
              </button>
              <button className=" flex justify-center items-center gap-2 bg-[#47C363] text-white py-1 px-3 rounded-sm">
                <Edit className="size-4  text-white"/>
                <span>Edit</span>
              </button>
            </div>
            <div className="max-w-4xl bg-white rounded-lg overflow-hidden w-1/2  shadow-md">
            {/* Header Section */}
            <div className="p-2">
              <img src={prHead} alt="" />
            </div>

            {/* Patient Information */}
            <div className="bg-gray-50 p-3 border-b border-gray-300">
              <div className="flex justify-between items-center text-xs">
                <span>
                  <strong>Name:</strong> {medic?.patient.name}
                </span>
                <span>
                  <strong>Age:</strong> {medic?.patient.age}
                </span>
                <span>
                  <strong>Date:</strong> {medic?.createdAt.split("T")[0]}
                </span>
                <span>
                  <strong>ID:</strong> {patient.id}
                </span>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex min-h-96">
              {/* Diagnosis Section */}
              <div className="w-1/3 p-4 border-r-2 border-gray-800">
                <h3 className="font-bold text-xs mb-4">Diagnosis</h3>
                <ul className="space-y-2">
                  {medic?.tests.map((item: any, index: number) => (
                    <li key={index} className="flex items-center text-xs">
                      <span className="w-2 h-2 bg-black rounded-full mr-2"></span>
                      {item.description}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Prescription Section */}
              <div className="flex-1 p-4">
                <div className="space-y-4">
                  {medic?.medicines.map((med: any, index: number) => (
                    <div key={index}>
                      <p className="text-xs font-semibold">
                        {index + 1}. {med.medicineName}
                      </p>
                      <div className="text-xs flex justify-between my-1  items-center">
                        <p>{med.dosage}</p>
                        <p>{med.day}</p>
                        <p>{med.time}</p>
                      </div>
                      {med.comment && (
                        <p className="text-xs text-gray-600 ml-4 mt-1">
                          {med.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-2">
              <img src={prHead} alt="" />
            </div>
          </div>
          </div>
        );
      })}
    </div>
  );
};

export default ViewPrescription;
