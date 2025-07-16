import { useEffect, useState } from "react";


const namesToSpeak = ["আসিফ খান" ,"আসিফ খান"];

const SpeakNames = () => {
  const [bengaliVoice, setBengaliVoice] = useState<SpeechSynthesisVoice | null>(
    null
  );

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // console.log("Available voices:", voices);

      
      const bnVoice = voices.find((voice) => voice.lang === "bn-IN");

      if (bnVoice) {
        setBengaliVoice(bnVoice);
        console.log("Found Indian Bengali voice:", bnVoice.name);
      } else {
        console.warn("No Indian Bengali (bn-IN) voice found. Using default.");
       
        if (voices.length > 0) {
          setBengaliVoice(voices[0]);
        }
      }
    };

    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  const speak = () => {
    const synth = window.speechSynthesis;
    if (!synth) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }

    const text = `পরবর্তী পেশেন্ট ${namesToSpeak.join(", ")}`;
    const utterance = new SpeechSynthesisUtterance(text);

    if (bengaliVoice) {
      utterance.voice = bengaliVoice;
    }

   
    utterance.lang = "bn-IN";
    utterance.rate = 0.8; // কথা বলার গতি
    utterance.pitch = 5; // পিচ স্বাভাবিক রাখা

    synth.speak(utterance);
  };

  return (
    <div className="p-4">
      <button
        onClick={speak}
        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
      >
        Speak in  Bengali
      </button>
    </div>
  );
};

export default SpeakNames;