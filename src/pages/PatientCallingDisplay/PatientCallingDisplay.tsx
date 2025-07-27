import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useGetOnlyActiveVideoQuery } from "@/redux/api/watchVideoApi/watchVideoApi";
import { useGetPatientQuery } from "@/redux/api/patient/patient";
import PatientCaller from "./_components/PatientCaller";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { getCurrentDateTime } from "@/utils/getCurrentDateTime";
import type { Patient } from "@/types/patient.types";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect } from "react";
import { setCurrentSerial } from "@/redux/api/features/serialSlice";

const today = new Date().toISOString().split("T")[0];

const PatientCallingDisplay = () => {
  const currentSerial = useSelector(
    (state: RootState) => state.serial.currentSerial
  );

  const { data: onlyActiveVideo, isLoading } =
    useGetOnlyActiveVideoQuery(undefined);
  const { data: patientApiData, isLoading: isPatientLoading } =
    useGetPatientQuery({
      limit: 1000,
      filter: JSON.stringify({ createdAt: today }),
      orderBy: JSON.stringify({ createdAt: "desc" }),
    });

  const dispatch = useAppDispatch();
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "currentSerial") {
        dispatch(setCurrentSerial(Number(e.newValue)));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [dispatch]);

  if (isLoading || isPatientLoading) {
    return <div className="text-center p-8 text-lg">Loading...</div>;
  }

  const patients = patientApiData?.data?.data || [];

  const activeVideo = onlyActiveVideo?.data?.find(
    (video: { status: string }) => video.status === "ACTIVE"
  );

  const convertToEmbedUrl = (url: string) => {
    let videoId = "";

    if (url.includes("youtu.be")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("watch?v=")) {
      videoId = url.split("watch?v=")[1].split("&")[0];
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`;
    }
    return "";
  };

  const visibleCount = 6;
  const upcomingCount = 7;
  const start = Math.max(0, (currentSerial >= 0 ? currentSerial : 0) - 2);
  const end = Math.min(patients.length, start + visibleCount);
  const upcomingSerials = patients.slice(end, end + upcomingCount);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-[#042F16] text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <h1 className="text-xl font-semibold">Patient Calling Display</h1>
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 sm:px-8 py-2">
        <div className="bg-gray-200 text-gray-800 text-sm font-medium px-4 py-2 rounded-lg shadow">
          {getCurrentDateTime()}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient Queue */}
          <div className="space-y-2">
            <PatientCaller patients={patients} />
            {/* Upcoming Numbers */}
            <Card className="bg-gray-800 text-white py-0 rounded">
              <CardContent className="p-4">
                {upcomingSerials.length > 0 ? (
                  <div className="flex items-center justify-between">
                    {upcomingSerials.map((patient: Patient, idx: number) => (
                      <div
                        key={patient?.id}
                        className="flex items-center text-sm"
                      >
                        <span className="text-gray-300">S N : </span>
                        <ChevronRight size={16} className="text-green-400" />
                        <span className="font-medium">{end + idx + 1}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-300 text-sm font-medium">
                    No more upcoming patients at the moment.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          {/* Video Display Section */}
          <div className="space-y-4">
            <Card className="overflow-hidden rounded py-0">
              <CardContent className="p-0">
                <div className="relative bg-gray-900 aspect-video flex items-center justify-center">
                  {activeVideo?.videoFile &&
                  convertToEmbedUrl(activeVideo.videoFile) ? (
                    <iframe
                      className="w-full h-full"
                      src={convertToEmbedUrl(activeVideo.videoFile)}
                      title="Active YouTube video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <p className="text-white text-lg">No active video yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Notice Section */}
        <div className="mt-8">
          <div className="bg-[#042F16] text-white py-3 px-6 rounded-t-lg">
            <h2 className="text-lg font-semibold text-center">Notice</h2>
          </div>
          <Card className="rounded-t-none py-0">
            <CardContent className="p-4">
              <p className="text-brand font-bold text-lg leading-relaxed">
                Welcome To Dr. A. F. M. Helal Uddin Medical Application. Now You
                Can Make Online Appointment From Here. Welcome To Dr. A. F. M.
                Helal Uddin Medical Application. Now You Can Make Online
                Appointment From Here.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientCallingDisplay;
