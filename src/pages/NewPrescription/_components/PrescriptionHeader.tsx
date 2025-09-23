const PrescriptionHeader = () => {
  return (
    <div className="prescription-header flex justify-between items-start">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
          <img
            src="/images/clinic-logo.jpg"
            alt="Clinic Logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
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
        <p className="text-xs text-gray-500 mt-2">
          চেম্বারঃ ০১৭১১-৮৮৮৮৮৮ (শুধুমাত্র এপয়েন্টমেন্টের জন্য)
        </p>
      </div>
    </div>
  );
};

export default PrescriptionHeader;
