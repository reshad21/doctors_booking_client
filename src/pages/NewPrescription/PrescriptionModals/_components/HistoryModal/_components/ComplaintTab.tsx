import { X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

export type ComplaintItem = {
    id: string;
    label: string;
    duration: string;
    unit: string;
    notes: string;
};

const filterOptions = [
    "Fever",
    "Cough",
    "Cold",
    "Headache",
    "Body Ache",
    "Fatigue",
    "Nausea",
    "Vomiting",
    "Diarrhea",
    "Constipation",
    "Abdominal Pain",
    "Chest Pain",
    "Shortness of Breath",
    "Dizziness",
    "Weakness",
    "Loss of Appetite",
    "Sore Throat",
    "Runny Nose",
    "Sneezing",
    "Itching",
];

function DurationInput({
    value,
    onChange,
    placeholder = "0",
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    return (
        <Input
            type="number"
            min="0"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full"
        />
    );
}

function ComplaintCard({
    complaint,
    index,
    onRemove,
    onUpdate,
}: {
    complaint: ComplaintItem;
    index: number;
    onRemove: (id: string) => void;
    onUpdate: (id: string, field: keyof ComplaintItem, value: string) => void;
}) {
    return (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-800">
                    {index + 1}. {complaint.label}
                </span>
                <button
                    onClick={() => onRemove(complaint.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Duration</label>
                    <DurationInput
                        value={complaint.duration}
                        onChange={(value) => onUpdate(complaint.id, "duration", value)}
                        placeholder="Duration..."
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Unit</label>
                    <Select
                        value={complaint.unit}
                        onValueChange={(value) => onUpdate(complaint.id, "unit", value)}
                    >
                        <SelectTrigger className="w-full text-left">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            {["Days", "Weeks", "Months", "Years", "Hours"].map((u) => (
                                <SelectItem key={u} value={u}>
                                    {u}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Notes</label>
                    <Input
                        placeholder="Add notes..."
                        value={complaint.notes}
                        onChange={(e) => onUpdate(complaint.id, "notes", e.target.value)}
                        className="w-full"
                    />
                </div>
            </div>

            {(complaint.duration || complaint.unit || complaint.notes) && (
                <div className="text-sm text-gray-600">
                    {complaint.duration && (
                        <span className="font-medium">{complaint.duration} </span>
                    )}
                    {complaint.unit && <span>{complaint.unit} </span>}
                    {complaint.notes && (
                        <span className="text-gray-500">({complaint.notes})</span>
                    )}
                </div>
            )}
        </div>
    );
}

export function ComplaintTab({
    searchQuery,
    complaints,
    onToggleFilter,
    onRemoveComplaint,
    onUpdateComplaint,
}: {
    searchQuery: string;
    complaints: ComplaintItem[];
    onToggleFilter: (filter: string) => void;
    onRemoveComplaint: (id: string) => void;
    onUpdateComplaint: (
        id: string,
        field: keyof ComplaintItem,
        value: string
    ) => void;
}) {
    const isFilterSelected = (filter: string) =>
        complaints.some((c) => c.label === filter);

    const sortedFilterOptions = filterOptions
        .filter((option) => complaints.some((c) => c.label === option))
        .concat(
            filterOptions.filter(
                (option) => !complaints.some((c) => c.label === option)
            )
        );

    const filteredComplaintOptions = sortedFilterOptions.filter((option) =>
        option.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 pb-6">
            <div className="w-full md:w-1/2 space-y-4">
                <div className="flex flex-wrap gap-2">
                    {filteredComplaintOptions.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => onToggleFilter(filter)}
                            className={`flex items-center gap-2 px-1 py-0.5 cursor-pointer rounded-md border transition-colors ${isFilterSelected(filter) ? "bg-green-50 border-green-600 text-green-700" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                        >
                            {isFilterSelected(filter) && (
                                <span className="text-green-600">✓</span>
                            )}
                            {filter}
                            <ChevronDown className="h-4 w-4" />
                        </button>
                    ))}
                </div>

                {filteredComplaintOptions.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                        No symptoms found matching "{searchQuery}"
                    </p>
                )}
            </div>

            <div className="w-full md:w-1/2 space-y-3 max-h-96 overflow-y-auto pr-2">
                {complaints.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-8">
                        Select symptoms from the left to add here
                    </p>
                )}
                {complaints.map((complaint, index) => (
                    <ComplaintCard
                        key={complaint.id}
                        complaint={complaint}
                        index={index}
                        onRemove={onRemoveComplaint}
                        onUpdate={onUpdateComplaint}
                    />
                ))}
            </div>
        </div>
    );
}