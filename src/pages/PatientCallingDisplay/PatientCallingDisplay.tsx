/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetOnlyActiveVideoQuery } from "@/redux/api/watchVideoApi/watchVideoApi";
import { useGetPatientQuery } from "@/redux/api/patient/patient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Patient } from "@/types/patient.types";
import { getCurrentDateTime } from "@/utils/getCurrentDateTime";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import NoticeFooter from "./_components/NoticeFooter";

const today = new Date().toISOString().split("T")[0];

export default function PatientCallingDisplay() {
  const currentSerial = useAppSelector((state) => state.serial.currentSerial);
  const calledSerials = useAppSelector((state) => state.serial.calledSerials);
  const endedSerials = useAppSelector((state) => state.serial.endedSerials);
  const doctor = useAppSelector((state) => state.admin);

  const { data: onlyActiveVideo } = useGetOnlyActiveVideoQuery(undefined);
  const { data: patientApiData } = useGetPatientQuery({
    limit: 1000,
    filter: JSON.stringify({ createdAt: today }),
    orderBy: JSON.stringify({ createdAt: "desc" }),
  });

  const patients: Patient[] = patientApiData?.data?.data || [];
  const outdoorPatients = patients.filter((p) => p?.status !== "REPORT");
  const reportPatients = patients.filter((p) => p?.status === "REPORT");

  // Filter ended patients out once
  const filteredOutdoorPatients = outdoorPatients.filter(
    (p) => !endedSerials.includes(p.id)
  );

  // Find start index in filtered list
  const outdoorStart = Math.max(
    0,
    filteredOutdoorPatients.findIndex((p) => p.id === currentSerial) - 2
  );

  // Take up to 10 visible patients
  let visibleOutdoorPatients = filteredOutdoorPatients.slice(
    outdoorStart,
    outdoorStart + 10
  );

  // If less than 10, pull more from upcoming non-ended patients
  if (visibleOutdoorPatients.length < 10) {
    const remainingNeeded = 10 - visibleOutdoorPatients.length;

    // upcoming candidates from original outdoorPatients, excluding ended and already visible
    const upcomingCandidates = outdoorPatients.filter(
      (p) =>
        !endedSerials.includes(p.id) &&
        !visibleOutdoorPatients.some((vp) => vp.id === p.id) &&
        outdoorPatients.indexOf(p) > outdoorStart + 9
    );

    visibleOutdoorPatients = visibleOutdoorPatients.concat(
      upcomingCandidates.slice(0, remainingNeeded)
    );
  }

  // Map patient id to original index in outdoorPatients for stable serial numbers
  const patientIndexMap = new Map(outdoorPatients.map((p, idx) => [p.id, idx]));

  // FIXED: Get upcoming outdoor patients that are NOT in the visible table
  const upcomingOutdoorPatients = filteredOutdoorPatients.filter(
    (p) => !visibleOutdoorPatients.some((vp) => vp.id === p.id)
  );

  // Report patients logic: similar to outdoor patients
  const filteredReportPatients = reportPatients.filter(
    (p) => !endedSerials.includes(p.id)
  );

  // Find start index in filtered report list
  const reportStart = Math.max(
    0,
    filteredReportPatients.findIndex((p) => p.id === currentSerial) - 2
  );

  // Take up to 5 visible report patients
  let visibleReportPatients = filteredReportPatients.slice(
    reportStart,
    reportStart + 5
  );

  // If less than 5, pull more from upcoming non-ended report patients
  if (visibleReportPatients.length < 5) {
    const remainingNeeded = 5 - visibleReportPatients.length;

    // upcoming candidates from original reportPatients, excluding ended and already visible
    const upcomingCandidates = reportPatients.filter(
      (p) =>
        !endedSerials.includes(p.id) &&
        !visibleReportPatients.some((vp) => vp.id === p.id) &&
        reportPatients.indexOf(p) > reportStart + 4
    );

    visibleReportPatients = visibleReportPatients.concat(
      upcomingCandidates.slice(0, remainingNeeded)
    );
  }

  // Map report patient id to original index for stable serial numbers
  const reportPatientIndexMap = new Map(
    reportPatients.map((p, idx) => [p.id, idx])
  );

  // Get upcoming report patients that are NOT in the visible table
  const upcomingReportPatients = filteredReportPatients.filter(
    (p) => !visibleReportPatients.some((vp) => vp.id === p.id)
  );

  // Video URL embed helper
  const convertToEmbedUrl = (url: string) => {
    let videoId = "";
    if (url.includes("youtu.be")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("watch?v=")) {
      videoId = url.split("watch?v=")[1].split("&")[0];
    }
    return videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`
      : "";
  };

  const activeVideo = onlyActiveVideo?.data?.find(
    (v: any) => v.status === "ACTIVE"
  );

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      {/* Header */}
      <header className="bg-[#042F16] text-white py-4 px-6 flex items-center justify-between relative border-b border-gray-300">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="h-0.5 w-16 bg-gray-300" />
          <div className="flex items-center mx-4">
            <div className="w-2 h-2 rounded-full bg-gray-300 mr-2" />
            {doctor.name && (
              <h1 className="text-2xl font-bold">Dr. {doctor.name}</h1>
            )}
            <div className="w-2 h-2 rounded-full bg-gray-300 ml-2" />
          </div>
          <div className="h-0.5 w-16 bg-gray-300" />
        </div>
        <div className="text-sm text-gray-100">{getCurrentDateTime()}</div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Section - Patient Tables */}
        <div className="flex flex-col gap-8">
          {/* Outdoor Patients Table */}
          <div className="overflow-hidden shadow-sm">
            <Table className="border-separate border-spacing-y-1">
              <TableHeader>
                <TableRow className="bg-[#198BD2] text-white hover:bg-[#198BD2]">
                  <TableHead className="text-white w-[80px] pl-4">SN</TableHead>
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white w-[100px]">Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleOutdoorPatients.map((patient) => {
                  const originalIndex = patientIndexMap.get(patient.id) ?? 0;
                  return (
                    <TableRow
                      key={patient.id}
                      className={
                        calledSerials.includes(patient.id)
                          ? "bg-green-600 text-white hover:bg-[#042F16]"
                          : "bg-[#042F16] text-white hover:bg-green-700"
                      }
                    >
                      <TableCell className="pl-4">
                        {originalIndex + 1}
                      </TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>
                        {calledSerials.includes(patient.id)
                          ? "On Going"
                          : "Next"}
                      </TableCell>
                      <TableCell>{patient.status || "N/A"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Upcoming Outdoor Patients */}
            <Card className="bg-[#042F16] text-white py-0 rounded-none mt-1 mx-auto">
              <CardContent className="p-2">
                {upcomingOutdoorPatients.length > 0 ? (
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    {upcomingOutdoorPatients
                      .slice(0, 5) // Show first 5 upcoming patients
                      .map((patient) => {
                        const originalIndex =
                          patientIndexMap.get(patient.id) ?? 0;
                        return (
                          <div
                            key={patient.id}
                            className="flex items-center text-sm rounded"
                          >
                            <span className="text-gray-300">S N :</span>
                            <ChevronRight
                              size={16}
                              className="text-green-400 mx-1"
                            />
                            <span className="font-medium">
                              {originalIndex + 1}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center text-gray-300 text-sm font-medium">
                    No more upcoming patients at the moment.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Report Patients Table */}
          <div className="overflow-hidden shadow-sm">
            <Table className="border-separate border-spacing-y-1">
              <TableHeader>
                <TableRow className="bg-[#198BD2] text-white hover:bg-[#198BD2]">
                  <TableHead className="w-[80px] pl-4 text-white">SN</TableHead>
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="w-[100px] text-white">Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleReportPatients.map((patient) => {
                  const originalIndex =
                    reportPatientIndexMap.get(patient.id) ?? 0;
                  return (
                    <TableRow
                      key={patient.id}
                      className={
                        calledSerials.includes(patient.id)
                          ? "bg-green-600 text-white hover:bg-[#042F16]"
                          : "bg-[#042F16] text-white hover:bg-green-700"
                      }
                    >
                      <TableCell className="pl-4">
                        {originalIndex + 1}
                      </TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>
                        {calledSerials.includes(patient.id)
                          ? "On Going"
                          : "Next"}
                      </TableCell>
                      <TableCell>{patient.status}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Upcoming Report Patients */}
            <Card className="bg-[#042F16] text-white py-0 rounded-none mt-1 mx-auto">
              <CardContent className="p-2">
                {upcomingReportPatients.length > 0 ? (
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    {upcomingReportPatients
                      .slice(0, 5) // Show first 5 upcoming report patients
                      .map((patient) => {
                        const originalIndex =
                          reportPatientIndexMap.get(patient.id) ?? 0;
                        return (
                          <div
                            key={patient.id}
                            className="flex items-center text-sm rounded"
                          >
                            <span className="text-gray-300">S N :</span>
                            <ChevronRight
                              size={16}
                              className="text-green-400 mx-1"
                            />
                            <span className="font-medium">
                              {originalIndex + 1}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center text-gray-300 text-sm font-medium">
                    No more upcoming Report patients at the moment.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Section - Video */}
        <div className="flex-1">
          <div className="relative w-full h-full bg-black rounded overflow-hidden">
            {activeVideo?.videoFile &&
            convertToEmbedUrl(activeVideo.videoFile) ? (
              <iframe
                className="absolute inset-0 w-full h-full"
                src={convertToEmbedUrl(activeVideo.videoFile)}
                title="Active YouTube Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white text-lg">
                No active video yet
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <NoticeFooter />
    </div>
  );
}
