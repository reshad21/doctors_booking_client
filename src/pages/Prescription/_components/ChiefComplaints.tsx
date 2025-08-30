/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactSelectCompo from "./ReactSelectCompo";
import {
    useGetChiefComplaintQuery,
    useGetDiagnosisQuery,
    useGetInvestigationQuery,
    useGetOnExaminationsQuery,
} from "@/redux/api/manualData/manualData";
import { InputOptions } from "./CreateFn";

interface ClinicalAssessmentProps {
    form: any;
    dynamicOptions: Record<string, any[]>;
    handleAdviceInputChange: (inputValue: string, fieldKey: string) => void;
}

const ClinicalAssessment: React.FC<ClinicalAssessmentProps> = ({
    form,
    dynamicOptions,
    handleAdviceInputChange,
}) => {
    const { data: onExaminations } = useGetOnExaminationsQuery({ limit: 200 });
    const { data: investigations } = useGetInvestigationQuery({ limit: 200 });
    const { data: diagnosis } = useGetDiagnosisQuery({ limit: 200 });
    const { data: chiefComplaint } = useGetChiefComplaintQuery({ limit: 200 });

    // Transform data
    const onExaminationOptions =
        InputOptions(onExaminations, "onExaminations") || [];
    const investigationOptions =
        InputOptions(investigations, "investigations") || [];
    const diagnosisOptions = InputOptions(diagnosis, "diagnosis") || [];
    const chiefComplaintOptions =
        InputOptions(chiefComplaint, "chiefComplaint") || [];

    const fields = [
        {
            key: "Chief-Complaint",
            label: "Chief Complaint",
            options: chiefComplaintOptions,
        },
        {
            key: "On-Examinations",
            label: "On Examinations",
            options: onExaminationOptions,
        },
        { key: "Diagnosis", label: "Diagnosis", options: diagnosisOptions },
        {
            key: "Investigation",
            label: "Investigation",
            options: investigationOptions,
        },
    ];

    return (
        <div className="p-2">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-6 bg-green-500 rounded-full"></div>
                <h3 className="text-xl font-semibold text-gray-900">
                    Clinical Assessment
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                {fields.map((field) => {
                    const fieldName = field.key.toLowerCase();
                    const mergedOptions = [
                        ...field.options,
                        ...(dynamicOptions[fieldName] || []),
                    ].filter(
                        (option, index, self) =>
                            index === self.findIndex((o) => o.value === option.value)
                    );

                    return (
                        <div key={field.key} className="space-y-3">
                            <ReactSelectCompo
                                label={field.label}
                                name={fieldName}
                                options={mergedOptions}
                                control={form.control}
                                isMulti
                                showSelectedBox
                                onCreateOption={(inputValue) =>
                                    handleAdviceInputChange(inputValue, field.key)
                                }
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ClinicalAssessment;
