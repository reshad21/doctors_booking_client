import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Volume2, X, ChevronRight } from "lucide-react";
import { getCurrentDateTime } from "@/utils/getCurrentDateTime";
import SpeakNames from "./SpeakNames";
import { useGetOnlyActiveVideoQuery } from "@/redux/api/watchVideoApi/watchVideoApi";

const patientQueue = [
  { sn: 10, name: "Asif Khan", status: "ongoing" },
  { sn: 11, name: "Salman Khan", status: "next" },
  { sn: 12, name: "Asif Khan", status: "next" },
  { sn: 13, name: "Salman Khan", status: "next" },
  { sn: 14, name: "Salman Khan", status: "next" },
];

const upcomingNumbers = [16, 17, 18, 19, 20, 21];

const PatientCallingDisplay = () => {
  const { data: onlyActiveVideo, isLoading } =
    useGetOnlyActiveVideoQuery(undefined);

  // console.log(onlyActiveVideo.data?.[0].videoFile);
  if (isLoading) {
    return <div className="text-center p-8 text-lg">Loading...</div>;
  }

  const activeVideo = onlyActiveVideo?.data?.find(
    (video) => video.status === "ACTIVE"
  );
  // const convertToEmbedUrl = (url: string) => {
  //   if (url.includes("youtu.be")) {
  //     const id = url.split("youtu.be/")[1].split("?")[0];
  //     return `https://www.youtube.com/embed/${id}`;
  //   } else if (url.includes("watch?v=")) {
  //     const id = url.split("watch?v=")[1].split("&")[0];
  //     return `https://www.youtube.com/embed/${id}`;
  //   }
  //   return url;
  // };


  const convertToEmbedUrl = (url: string) => {
  let videoId = "";

  if (url.includes("youtu.be")) {
    videoId = url.split("youtu.be/")[1].split("?")[0];
  } else if (url.includes("watch?v=")) {
    videoId = url.split("watch?v=")[1].split("&")[0];
  }

  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`;
};

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

      <div className="flex items-center justify-between px-4 sm:px-8 py-2">
        <Button className="text-white hover:text-gray-300 transition-colors">
          <Volume2 size={28} />
        </Button>
        <div className="bg-gray-200 text-gray-800 text-sm font-medium px-4 py-2 rounded-lg shadow">
          {getCurrentDateTime()}
        </div>
        <Button className="text-white hover:text-gray-300 transition-colors">
          <X size={28} />
        </Button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient Queue */}
          <div className="space-y-2">
            {/* Current and Next Patients */}
            <div className="space-y-2">
              {patientQueue.map((patient) => (
                <Card key={patient.sn} className="overflow-hidden py-0">
                  <CardContent className="px-0 py-0">
                    <div
                      className={`flex items-center justify-between p-2 text-white ${
                        patient.status === "ongoing"
                          ? "bg-gradient-to-r from-blue-600 to-blue-500"
                          : "bg-gradient-to-r from-gray-800 to-gray-700"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <Badge
                          variant="secondary"
                          className={`${
                            patient.status === "ongoing"
                              ? "bg-green-600 text-white"
                              : "bg-green-700 text-white"
                          } px-3 py-1`}
                        >
                          {patient.status === "ongoing" ? "Ongoing" : "Next"}
                        </Badge>
                        <div className="text-sm">
                          <span className="font-medium">
                            S N : {patient.sn}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">
                          Patient Name : {patient.name}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Upcoming Numbers */}
            <Card className="bg-gray-800 text-white py-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  {upcomingNumbers.map((num) => (
                    <div key={num} className="flex items-cente text-sm">
                      <span className="text-gray-300">S N : </span>
                      <ChevronRight size={16} className="text-green-400" />
                      <span className="font-medium">{num}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Video Display Section */}
          <div className="space-y-4">
            <Card className="overflow-hidden py-0">
              <CardContent className="p-0">
                <div className="relative bg-gray-900 aspect-video flex items-center justify-center">
                  {activeVideo?.videoFile ? (
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
          <SpeakNames />
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
