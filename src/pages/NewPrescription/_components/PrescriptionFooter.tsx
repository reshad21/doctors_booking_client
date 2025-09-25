const PrescriptionFooter = () => {
  return (
    <div className="flex justify-between items-end mx-2 mt-4">
      <div className="text-xs text-gray-600">
        <p>চেম্বার: শ্রীনগর হাসপাতাল লিমিটেড</p>
        <p>১৫২-১৫৩, গ্রীন রোড, ঢাকা-১২০৫</p>
        <p>ফোন: ০২-৮৬১৯৯৯১-৫, মোবাইল: ০১৭১১-৮৮৮৮৮৮</p>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium mb-2">ডাক্তারের স্বাক্ষর</div>
        <div className="w-32 border-b border-black"></div>
      </div>
    </div>
  );
};

export default PrescriptionFooter;
