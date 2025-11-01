import Preview from "@/components/shared/Preview"


interface PrescriptionFooter {
  id: string
  prescriptionSetupId: string
  chamberId: string | null
  doctorId: string | null
  logo: string
  doctorInfoBangla: string
  doctorInfoEnglish: string
  showLogo: boolean
  showPrescriptionFooter: boolean
  showPrescriptionInBangla: boolean
  showPrescriptionInEnglish: boolean
  createdAt: string
  updatedAt: string
}

const PrescriptionFooter = ({ data }: { data: PrescriptionFooter }) => {
  if (!data?.showPrescriptionFooter) {
    return <div className="text-center py-6 text-sm text-gray-700">Try Create Doctor Information from the Pre Management For Footer.</div>
  }

  return (
    <div className="flex justify-between items-end mx-2 mt-4 gap-4">
      {/* Left side: Logo and Bangla content */}
      <div className="flex-1">
        <div className="flex items-start gap-3 mb-3">
          {data?.showLogo && data?.logo && (
            <img src={data?.logo || "/placeholder.svg"} alt="Logo" className="w-12 h-12 object-contain flex-shrink-0" />
          )}
          {data?.showPrescriptionInBangla && (
            <div className="text-xs text-gray-600 flex-1">
              <Preview content={data?.doctorInfoBangla} details />
            </div>
          )}
        </div>
      </div>

      {/* Right side: English content and signature */}
      <div className="flex-1 text-right">
        {data?.showPrescriptionInEnglish && (
          <div className="text-xs text-gray-600 mb-3">
            <Preview content={data?.doctorInfoEnglish} details />
          </div>
        )}
      </div>
    </div>
  )
}

export default PrescriptionFooter
