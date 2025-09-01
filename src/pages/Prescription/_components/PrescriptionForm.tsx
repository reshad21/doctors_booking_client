/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import MedicineForm from "./MedicineForm";
import { Form } from "@/components/ui/form";
import BaseInput from "@/components/shared/BaseInput";
import ClinicalAssessment from "./ChiefComplaints";
import AdviceField from "./AdviceFields";

const PrescriptionForm = ({
  onSubmit,
  type,
}: {
  onSubmit: (data: any) => void;
  type: string;
}) => {
  const form = useFormContext();
  const [formError, setFormError] = useState<string>("");

  const handleSubmit = (data: any) => {
    setFormError("");
    onSubmit(data);
  };

  const handleValidationError = (error: string) => {
    setFormError(error);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      <ClinicalAssessment />

      <div className="p-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
          <h3 className="text-xl font-semibold text-gray-900">
            Medication Details
          </h3>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <MedicineForm
              type={type}
              onValidationError={handleValidationError}
            />

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-5 bg-yellow-500 rounded-full"></div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Follow Up
                </h4>
              </div>
              <BaseInput
                name="nextVisit"
                placeholder="Enter Follow up details"
                type="text"
                classname="p-3 rounded-md bg-[#fdfdff] border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <AdviceField />

            <div className="flex justify-end items-center gap-4 border-gray-200">
              <button
                type="submit"
                disabled={!!formError}
                className={`px-10 py-3 text-sm cursor-pointer font-semibold text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                  formError
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                }`}
              >
                Save Prescription
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PrescriptionForm;