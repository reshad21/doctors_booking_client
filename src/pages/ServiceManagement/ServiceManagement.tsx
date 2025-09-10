/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function ServiceManagement() {
   const [visits,setVisits] = useState([])
  const methods = useForm();
  const chamber =  methods.watch("chamber")
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    chamber: "",
  });
  const buildFilter = () => {
    const f: Record<string, any> = {};
    // if (filters.chamber) f.chamberId = filters.chamber;
    if (filters.startDate) f.startDate = filters.startDate;
    if (filters.endDate) f.endDate = filters.endDate;
    return JSON.stringify(f);
  };

  const visit = useGetVisitsQuery({
    filter: buildFilter(),
  });
  const { data: chambersData, isLoading: isChamberLoading } =
    useGetChambersQuery({});
  // let visits; 
      useEffect(() => {
  if (!visit.data?.data) {
    setVisits([]);
    return;
  }

  const filtered = chamber
    ? visit.data.data.filter((v: any) => v?.patient?.chamberId === chamber)
    : visit.data.data;

  setVisits(filtered);
}, [chamber, visit.data?.data]);

  // Filter visits based on filters
  const filteredVisits = visits.filter((v: any) => {
    const visitDate = v.date ? new Date(v.date) : null;
    const start = filters.startDate ? new Date(filters.startDate) : null;
    const end = filters.endDate ? new Date(filters.endDate) : null;
    let match = true;
    if (start && visitDate && visitDate < start) match = false;
    if (end && visitDate && visitDate > end) match = false;
    if (filters.chamber && v.chamberId !== filters.chamber) match = false;
    return match;
  });

  // Count patients by type (use filteredVisits)
  const newVisits = filteredVisits.filter((v: any) => v.type === "NEW");
  const oldVisits = filteredVisits.filter((v: any) => v.type === "OLD");
  const reportVisits = filteredVisits.filter((v: any) => v.type === "REPORT");

  const totalNewVisitsDiscount = newVisits.reduce((sum: any, item: any) => {
    return sum + (Number(item.patient?.discountAmount) || 0);
  }, 0);
  const totalOldVisitsDiscount = oldVisits.reduce((sum: any, item: any) => {
    return sum + (Number(item.patient?.discountAmount) || 0);
  }, 0);
  const totalReportVisitsDiscount = reportVisits.reduce(
    (sum: any, item: any) => {
      return sum + (Number(item.patient?.discountAmount) || 0);
    },
    0
  );

  // Count by type
  const newPatientCount = newVisits.length;
  const oldPatientCount = oldVisits.length;
  const reportPatientCount = reportVisits.length;

  // Earnings (total fee) by type
  const newPayment = newVisits.reduce(
    (sum: number, v: any) => sum + (v.fee || 0),
    0
  );
  const oldPayment = oldVisits.reduce(
    (sum: number, v: any) => sum + (v.fee || 0),
    0
  );
  const reportPayment = reportVisits.reduce(
    (sum: number, v: any) => sum + (v.fee || 0),
    0
  );

  // Helper to format date (optional, for better display)
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    });
  };

  // Determine date display for cards
  const getDateDisplay = () => {
    const { startDate, endDate } = filters;
    if (startDate && endDate) {
      return {
        from: formatDate(startDate),
        to: formatDate(endDate),
      };
    } else if (startDate) {
      return {
        from: formatDate(startDate),
        to: "",
      };
    } else if (endDate) {
      return {
        from: formatDate(endDate),
        to: "",
      };
    } else {
      return {
        from: "",
        to: "",
      };
    }
  };

  const dateDisplay = getDateDisplay();

  const cards = [
    {
      title: "New Patient History",
      from: dateDisplay.from,
      to: dateDisplay.to,
      stats: [
        { label: "New Patient", value: newPatientCount },
        { label: "Visited", value: newPatientCount },
        {
          label: "Total Payment",
          value: `${newPayment - totalNewVisitsDiscount}TK`,
        },
      ],
    },
    {
      title: "Old Patient History",
      from: dateDisplay.from,
      to: dateDisplay.to,
      stats: [
        { label: "Old Patient", value: oldPatientCount },
        { label: "Visited", value: oldPatientCount },
        {
          label: "Total Payment",
          value: `${oldPayment - totalOldVisitsDiscount}TK`,
        },
      ],
    },
    {
      title: "Report History",
      from: dateDisplay.from,
      to: dateDisplay.to,
      stats: [
        { label: "Report", value: reportPatientCount },
        { label: "Visited", value: reportPatientCount },
        {
          label: "Total Payment",
          value: `${reportPayment - totalReportVisitsDiscount}TK`,
        },
      ],
    },
    {
      title: "Discount Given",
      from: dateDisplay.from,
      to: dateDisplay.to,
      stats: [
        // { label: "Report", value: reportPatientCount },
        { label: "Visited", value: reportPatientCount },
        {
          label: "Total Discount Given",
          value: `${totalNewVisitsDiscount + totalOldVisitsDiscount + totalReportVisitsDiscount}TK`,
        },
      ],
    },
  ];

  if (isChamberLoading) return <LoadingSpinner />;

  const chamberOptions = (chambersData?.data || []).map((chamber: Chamber) => ({
    name: chamber.name,
    val: chamber.id,
  }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Search Form */}
      <FormProvider {...methods}>
        <form
          className="bg-white p-6 rounded-lg shadow-sm mb-6"
          onSubmit={methods.handleSubmit((data) =>
            setFilters({
              startDate: data.startDate || "",
              endDate: data.endDate || "",
              chamber: data.chamber || "",
            })
          )}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex-1 min-w-0 sm:max-w-sm">
              <span className="block text-sm mb-1 font-medium">Start Date</span>
              <BaseInput
                name="startDate"
                classname="border-[#A0B19E] rounded-[4px] !h-10 border text-[#5F597480] w-full bg-slate-50"
                type="date"
                placeholder="Start Date"
              />
            </div>
            {/* End Date Selection */}
            <div className="flex-1 min-w-0 sm:max-w-sm">
              <span className="block text-sm mb-1 font-medium">End Date</span>
              <BaseInput
                name="endDate"
                classname="border-[#A0B19E] rounded-[4px] !h-10 border text-[#5F597480] w-full bg-slate-50"
                type="date"
                placeholder="End Date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chamber
              </label>
              <BaseSelect
                name="chamber"
                options={chamberOptions.map(
                  (chamber: { name: string; val: string }) => ({
                    name: chamber.name,
                    value: chamber.val,
                  })
                )}
                className="w-full border-[#A0B19E] rounded-[4px] !h-10 border text-[#5F597480] bg-slate-50"
              />
            </div>
            <div className="flex gap-2 items-end mb-1">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 bg-transparent"
                onClick={() => {
                  // Clear filters (triggers re-fetch)
                  setFilters({
                    startDate: "",
                    endDate: "",
                    chamber: "",
                  });

                  // Reset form values in the UI
                  methods.reset({
                    startDate: "",
                    endDate: "",
                    chamber: "",
                  });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                className="bg-green-700 hover:bg-green-800 text-white px-6 h-10"
                type="submit"
              >
                Search
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>

      {/* Patient History Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <HistoryCard
            key={idx}
            title={card.title}
            from={card.from}
            to={card.to}
            stats={card.stats}
          />
        ))}
      </div>
    </div>
  );
}

import { Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetVisitsQuery } from "@/redux/api/visit/visit";
import { useGetChambersQuery } from "@/redux/api/chamber/chamber";
import BaseSelect from "@/components/shared/BaseSelect";
import type { Chamber } from "@/types/chamber.types";
import { FormProvider, useForm,  } from "react-hook-form";
import BaseInput from "@/components/shared/BaseInput";
import { useEffect, useRef, useState } from "react";
import LoadingSpinner from "@/loading/LoadingSpinner";

interface HistoryCardProps {
  title: string;
  from: string;
  to: string;
  stats: { label: string; value: string | number }[];
}

export function HistoryCard({ title, from, to, stats }: HistoryCardProps) {
  // Create a ref for the card
  const cardRef = useRef<HTMLDivElement>(null);

  // Print only this card
  const handlePrint = () => {
    if (!cardRef.current) return;
    const printContents = cardRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // reload to restore event handlers
  };

  return (
    <div
      ref={cardRef}
      className="print:bg-white print:text-black print:p-8 print:shadow-none"
    >
      <Card className="bg-gray-100 print:bg-white print:shadow-none">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 print:text-black">
                {from && to ? (
                  <>
                    <span className="font-medium">From </span> {from}{" "}
                    <span className="font-medium">To</span> {to}
                  </>
                ) : from ? (
                  <>
                    <span className="font-medium">Date: </span> {from}
                  </>
                ) : null}
                <Download
                  className="h-4 w-4 text-gray-600 inline ml-2 cursor-pointer print:hidden"
                  onClick={handlePrint}
                  aria-label="Download PDF"
                />
              </p>
            </div>
          </div>
          <CardTitle className="text-lg font-semibold print:text-black">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center print:text-black"
            >
              <span className="font-medium">{stat.label} :</span>
              <span className="font-bold text-lg">{stat.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
