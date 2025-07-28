import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Patient } from "@/types/patient.types";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

interface PatientCallerProps {
  patients: Patient[];
}

const PatientCaller: React.FC<PatientCallerProps> = ({ patients }) => {
  const currentSerial = useSelector(
    (state: RootState) => state.serial.currentSerial
  );

  const hasSpokenRef = useRef<number | null>(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // ✅ Ensure voices are available before speaking
  useEffect(() => {
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      setVoicesLoaded(true);
    } else {
      const handleVoicesChanged = () => {
        setVoicesLoaded(true);
      };
      window.speechSynthesis.addEventListener(
        "voiceschanged",
        handleVoicesChanged
      );
      return () => {
        window.speechSynthesis.removeEventListener(
          "voiceschanged",
          handleVoicesChanged
        );
      };
    }
  }, []);


  useEffect(() => {
    if (
      voicesLoaded &&
      currentSerial >= 0 &&
      currentSerial < patients.length &&
      currentSerial !== hasSpokenRef.current
    ) {
      const serial = currentSerial + 1;
      const message = `Serial Number ${serial}, please be ready`;
      const lang = "en-US";
      const voices = window.speechSynthesis.getVoices();

      const preferredVoice = voices.find(
        (v) => v.lang === lang && v.name.includes("Microsoft")
      );

      let count = 0;
      const repeat = () => {
        if (count < 3) {
          const utterance = new SpeechSynthesisUtterance(message);
          utterance.lang = lang;
          utterance.rate = 0.85;
          if (preferredVoice) utterance.voice = preferredVoice;
          utterance.onend = () => {
            count++;
            setTimeout(repeat, 400);
          };
          speechSynthesis.speak(utterance);
        }
      };

      repeat();
      hasSpokenRef.current = currentSerial;
    }
  }, [currentSerial, voicesLoaded, patients]);

  // ✅ Determine visible patients
  const visibleCount = 6;
  let start = currentSerial >= 0 ? currentSerial : 0;

  if (patients.length <= visibleCount) {
    start = 0;
  } else if (start > patients.length - 1) {
    start = patients.length - 1;
  } else if (start > patients.length - visibleCount) {
    start = Math.max(0, patients.length - visibleCount);
  }

  const end = Math.min(patients.length, start + visibleCount);
  const visiblePatients = patients.slice(start, end);

  return (
    <div className="space-y-2">
      {visiblePatients.map((patient, idx) => {
        const realIdx = start + idx;
        const isOngoing = realIdx === currentSerial;

        return (
          <Card
            key={patient.id}
            className={`overflow-hidden rounded py-0 ${isOngoing ? "bg-blue-600" : "bg-[#042F16]"}`}
          >
            <CardContent className="px-0 py-0">
              <div
                className={`flex items-center justify-between p-2 rounded text-white ${
                  isOngoing ? "bg-blue-600" : "bg-[#042F16]"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <Badge
                    variant="secondary"
                    className={`${
                      isOngoing ? "bg-green-700" : "bg-green-600"
                    } text-white px-3 py-1`}
                  >
                    {isOngoing ? "Ongoing" : "Next"}
                  </Badge>
                  <span className="text-sm font-semibold">
                    S N : {realIdx + 1}
                  </span>
                  <span className="text-sm font-medium">
                    Patient Name:{" "}
                    <span className="font-bold">
                      {String(patient.name || "")}
                    </span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PatientCaller;
