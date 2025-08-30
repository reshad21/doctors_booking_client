import { Badge } from "@/components/ui/badge"

/* eslint-disable @typescript-eslint/no-explicit-any */
const PatientInformation = ({ patient }: any) => {
    return (
        <div className="p-2">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                <h3 className="text-xl font-semibold text-gray-900">
                    Patient Information
                </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    {
                        key: "name",
                        label: "Patient Name",
                        value: patient?.patient?.name,
                    },
                    { key: "age", label: "Age", value: `${patient?.patient?.age}yrs` },
                    {
                        key: "date",
                        label: "Date",
                        value: new Date().toLocaleDateString(),
                    },
                    { key: "Id", label: "Prescription ID", value: null },
                ].map((item) => (
                    <div key={item.key} className="space-y-2">
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            {item.label}
                        </label>
                        <div className="min-h-[40px] flex items-center">
                            {item.value ? (
                                <span className="text-lg font-semibold text-gray-900">
                                    {item.value}
                                </span>
                            ) : (
                                <Badge
                                    variant="outline"
                                    className="text-xs font-medium text-blue-600 border-blue-200 bg-blue-50"
                                >
                                    Auto-generating
                                </Badge>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PatientInformation