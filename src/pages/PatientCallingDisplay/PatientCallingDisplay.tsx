/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetWatchVideoQuery } from "@/redux/api/watchVideoApi/watchVideoApi";
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
import { useEffect, useMemo, useState } from "react";
import { socket } from "@/socket/socket";
import VideoPlayer from "./_components/VideoPlayer";
import { useGetChambersQuery } from "@/redux/api/chamber/chamber";
import { useGetStaffsDoctorQuery } from "@/redux/api/staff/staff";

interface Chamber {
  id: string;
  name: string;
}

const today = new Date().toISOString().split("T")[0];

export default function PatientCallingDisplay() {
  const { data: staffsDoctor } = useGetStaffsDoctorQuery({});
  const { data: chambersData } = useGetChambersQuery({});
  const currentSerial = useAppSelector((state) => state.serial.currentSerial);
  const calledSerials = useAppSelector((state) => state.serial.calledSerials);
  const endedSerials = useAppSelector((state) => state.serial.endedSerials);
  const [selectedChamber, setSelectedChamber] = useState("all");
  const doctor = useAppSelector((state) => state.admin)
 
  
  
  const chambers: Chamber[] = useMemo(() => 
    chambersData?.data?.map((item: any) => ({ name: item?.name, id: item?.id })) || [], 
    [chambersData]
  );

  const { data: videoData } = useGetWatchVideoQuery({});
  const { data: patientApiData, refetch } = useGetPatientQuery({
    limit: 1000, // Ensure we get all patients, not just the first page
    filter: JSON.stringify({
      chamberId: selectedChamber === "all" ? {} : { equals: selectedChamber },
      createdAt: today,
      timezoneOffset: new Date().getTimezoneOffset(),
    }),
    orderBy: JSON.stringify({ createdAt: "asc" }),
  });

  const patients: Patient[] = useMemo(() => 
    patientApiData?.data?.data || [], 
    [patientApiData]
  );

  const outdoorPatients = useMemo(
    () => patients.filter((p) => p?.status !== "REPORT"),
    [patients]
  );

  const reportPatients = useMemo(
    () => patients.filter((p) => p?.status === "REPORT"),
    [patients]
  );

  const activeVideos = useMemo(
    () => videoData?.data?.filter((v: any) => v.status === "ACTIVE") || [],
    [videoData]
  );

  // Filter out ended patients AND patients where isArrived is true
  const filteredOutdoorPatients = useMemo(
    () => outdoorPatients.filter(
      (p) => !endedSerials.includes(p.id) && p.visitStatus !== "VISITED"
    ),
    [outdoorPatients, endedSerials]
  );

  // Find start index in filtered list
  const outdoorStart = useMemo(() => 
    Math.max(
      0,
      filteredOutdoorPatients.findIndex((p) => p.id === currentSerial) - 2
    ),
    [filteredOutdoorPatients, currentSerial]
  );

  // Take up to 10 visible patients
  const visibleOutdoorPatients = useMemo(() => {
    let visiblePatients = filteredOutdoorPatients.slice(
      outdoorStart,
      outdoorStart + 10
    );

    // If less than 10, pull more from upcoming non-ended patients
    if (visiblePatients.length < 10) {
      const remainingNeeded = 10 - visiblePatients.length;
      const upcomingCandidates = outdoorPatients.filter(
        (p) =>
          !endedSerials.includes(p.id) &&
          !visiblePatients.some((vp) => vp.id === p.id) &&
          p.visitStatus !== "VISITED"
      );
      visiblePatients = visiblePatients.concat(
        upcomingCandidates.slice(0, remainingNeeded)
      );
    }

    return visiblePatients;
  }, [filteredOutdoorPatients, outdoorStart, outdoorPatients, endedSerials]);

  // Map patient id to original index in outdoorPatients for stable serial numbers
  const patientIndexMap = useMemo(
    () => new Map(outdoorPatients.map((p, idx) => [p.id, idx + 1])),
    [outdoorPatients]
  );

  const upcomingOutdoorPatients = useMemo(
    () => filteredOutdoorPatients.filter(
      (p) =>
        !visibleOutdoorPatients.some((vp) => vp.id === p.id) &&
        p.visitStatus !== "VISITED"
    ),
    [filteredOutdoorPatients, visibleOutdoorPatients]
  );

  const filteredReportPatients = useMemo(
    () => reportPatients.filter(
      (p) => !endedSerials.includes(p.id) && p.visitStatus !== "VISITED"
    ),
    [reportPatients, endedSerials]
  );

  // Find start index in filtered report list
  const reportStart = useMemo(
    () => Math.max(
      0,
      filteredReportPatients.findIndex((p) => p.id === currentSerial) - 2
    ),
    [filteredReportPatients, currentSerial]
  );

  // Take up to 5 visible report patients
  const visibleReportPatients = useMemo(() => {
    let visiblePatients = filteredReportPatients.slice(
      reportStart,
      reportStart + 5
    );

    // If less than 5, pull more from upcoming non-ended report patients
    if (visiblePatients.length < 5) {
      const remainingNeeded = 5 - visiblePatients.length;
      const upcomingCandidates = reportPatients.filter(
        (p) =>
          !endedSerials.includes(p.id) &&
          !visiblePatients.some((vp) => vp.id === p.id) &&
          p.visitStatus !== "VISITED"
      );
      visiblePatients = visiblePatients.concat(
        upcomingCandidates.slice(0, remainingNeeded)
      );
    }

    return visiblePatients;
  }, [filteredReportPatients, reportStart, reportPatients, endedSerials]);

  // Map report patient id to original index for stable serial numbers
  const reportPatientIndexMap = useMemo(
    () => new Map(reportPatients.map((p, idx) => [p.id, idx + 1])),
    [reportPatients]
  );

  const upcomingReportPatients = useMemo(
    () => filteredReportPatients.filter(
      (p) =>
        !visibleReportPatients.some((vp) => vp.id === p.id) &&
        p.visitStatus !== "VISITED"
    ),
    [filteredReportPatients, visibleReportPatients]
  );

  // Socket listener for new patients
  useEffect(() => {
    socket.on("patient:created", (newPatient) => {
      console.log("New patient received via socket:", newPatient);
      refetch();
    });

    return () => {
      socket.off("patient:created");
    };
  }, [refetch]);

  const handleChamberChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedChamber(event.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      {/* Header */}
      <header className="bg-[#042F16] text-white py-4 px-6 flex items-center justify-between relative border-b border-gray-300">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="h-0.5 w-16 bg-gray-300" />
          <div className="flex items-center mx-4">
            <div className="w-2 h-2 rounded-full bg-gray-300 mr-2" />
            {doctor.name && (
              <h1 className="text-2xl font-bold">{doctor.name}</h1>
            )}
            {staffsDoctor?.data?.name && (
              <h1 className="text-2xl font-bold">{staffsDoctor?.data?.name}</h1>
            )}
            <div className="w-2 h-2 rounded-full bg-gray-300 ml-2" />
          </div>
          <div className="h-0.5 w-16 bg-gray-300" />
        </div>
        <div className="text-sm text-gray-100">{getCurrentDateTime()}</div>
      </header>
      
      {/* Chamber Selection */}
      <div className="pt-2 px-4 flex justify-center items-center">
        <div className="w-full">
          <select
            id="chamber-select"
            value={selectedChamber}
            onChange={handleChamberChange}
            className="w-full p-2 border text-gray-700 bg-gray-100 border-gray-200 rounded-md focus:ring-brand focus:border-brand"
          >
            {[{ id: "all", name: "All Chambers" }, ...chambers].map(
              (chamber: Chamber) => (
                <option
                  key={chamber.id}
                  value={chamber.id}
                  className="text-gray-500"
                >
                  {chamber.name}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Section - Patient Tables */}
        <div className="flex flex-col gap-8">
          {/* Outdoor Patients Table */}
          <div className="overflow-hidden shadow-sm">
            {/* <h2 className="text-xl font-bold mb-2 text-center">Outdoor Patients</h2> */}
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
                  const serialNumber = patientIndexMap.get(patient.id) || 0;
                  return (
                    <TableRow
                      key={patient.id}
                      className={
                        calledSerials.includes(patient.id)
                          ? "bg-green-600 text-white hover:bg-[#042F16]"
                          : "bg-[#042F16] text-white hover:bg-green-700"
                      }
                    >
                      <TableCell className="pl-4 font-bold">
                        {serialNumber}
                      </TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>
                        {calledSerials.includes(patient.id)
                          ? "On Going"
                          : currentSerial === patient.id
                          ? "Calling Now"
                          : "Waiting"}
                      </TableCell>
                      <TableCell>{patient.status || "OUTDOOR"}</TableCell>
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
                    <span className="text-gray-300 mr-2">Upcoming:</span>
                    {upcomingOutdoorPatients.slice(0, 10).map((patient) => {
                      const serialNumber = patientIndexMap.get(patient.id) || 0;
                      return (
                        <div
                          key={patient.id}
                          className="flex items-center text-sm rounded bg-green-800 px-2 py-1"
                        >
                          <ChevronRight
                            size={16}
                            className="text-green-400 mx-1"
                          />
                          <span className="font-medium">{serialNumber}</span>
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
            {/* <h2 className="text-xl font-bold mb-2 text-center">Report Patients</h2> */}
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
                  const serialNumber = reportPatientIndexMap.get(patient.id) || 0;
                  return (
                    <TableRow
                      key={patient.id}
                      className={
                        calledSerials.includes(patient.id)
                          ? "bg-green-600 text-white hover:bg-[#042F16]"
                          : "bg-[#042F16] text-white hover:bg-green-700"
                      }
                    >
                      <TableCell className="pl-4 font-bold">
                        {serialNumber}
                      </TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>
                        {calledSerials.includes(patient.id)
                          ? "On Going"
                          : currentSerial === patient.id
                          ? "Calling Now"
                          : "Waiting"}
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
                    <span className="text-gray-300 mr-2">Upcoming Reports:</span>
                    {upcomingReportPatients.slice(0, 5).map((patient) => {
                      const serialNumber = reportPatientIndexMap.get(patient.id) || 0;
                      return (
                        <div
                          key={patient.id}
                          className="flex items-center text-sm rounded bg-green-800 px-2 py-1"
                        >
                          <ChevronRight
                            size={16}
                            className="text-green-400 mx-1"
                          />
                          <span className="font-medium">{serialNumber}</span>
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
        <div className="relative w-full h-full bg-black rounded overflow-hidden">
          <VideoPlayer videos={activeVideos} />
        </div>
      </main>

      {/* Footer */}
      <NoticeFooter />
    </div>
  );
}