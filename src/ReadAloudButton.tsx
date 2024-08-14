import React from "react";
import axios from "axios";
import { RxSpeakerLoud } from "react-icons/rx";
import { SpeakerIcon } from "lucide-react";
// import ReadAloudIcon from "./assets/readaloudicon.png"

const ReadAloudButton = ({ text }) => {
  const apiKey = "AIzaSyDHSN2gsEwLV85AdVBcl4zw_1Ad1Grrl1s";

  const handleReadAloud = async () => {
    try {
      const response = await axios.post(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
        {
          input: { text: text },
          voice: { languageCode: "en-IN", ssmlGender: "MALE" },
          audioConfig: { audioEncoding: "MP3" },
        }
      );

      const audioContent = response.data.audioContent;
      const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
      audio.play();
    } catch (error) {
      alert("Sorry! Error playing the audio.");
      console.error("Error with Text-to-Speech API", error);
    }
  };

  return (
    <>
      <button onClick={handleReadAloud}>
        <RxSpeakerLoud />
      </button>
    </>
  );
};

export default ReadAloudButton;
