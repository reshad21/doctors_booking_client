import { BriefcaseMedical } from "lucide-react";

const PrescriptionHeader = () => {
  return (
    <div className="flex justify-between items-start border border-[#C3C3C3] bg-white p-5 mx-2 rounded-xl">
      <div className="flex items-start gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            ডাঃ এ.এফ.এম হেলাল উদ্দিন
          </h2>
          <p className="text-sm text-gray-600">এমবিবিএস, এমডি (কার্ডিওলজি)</p>
          <p className="text-sm text-gray-600">সহযোগী অধ্যাপক (কার্ডিওলজি)</p>
          <p className="text-sm text-gray-600">
            জাতীয় হৃদরোগ ইনস্টিটিউট ও হাসপাতাল
          </p>
          <p className="text-sm text-gray-600">শের-ই-বাংলা নগর, ঢাকা</p>
        </div>
      </div>
      <div className="size-20 bg-orange-100 rounded-full flex items-center justify-center">
        <BriefcaseMedical className="size-14" strokeWidth={1.2} />
      </div>
      <div className="text-right">
        <h3 className="text-lg font-bold text-gray-800">
          Dr. A.F.M Helal Uddin
        </h3>
        <p className="text-sm text-gray-600">MBBS, MD (Cardiology)</p>
        <p className="text-sm text-gray-600">
          Associate Professor (Cardiology)
        </p>
        <p className="text-sm text-gray-600">
          National Institute of Cardiovascular
        </p>
        <p className="text-sm text-gray-600">Diseases & Hospital</p>
        <p className="text-sm text-gray-600">Sher-E-Bangla Nagar, Dhaka</p>
      </div>
    </div>
  );
};

export default PrescriptionHeader;
