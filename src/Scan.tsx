import { Link } from "react-router-dom";
import React, { useCallback, useRef, useState } from "react";

import {
  CameraIcon,
  CameraOff,
  Loader,
  MoveLeftIcon,
  ScanLine,
  SwitchCamera,
  TargetIcon,
} from "lucide-react";
import { redirect } from "react-router-dom";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAi = new GoogleGenerativeAI("AIzaSyBI5B23RXprsQeqPuER3xVzFDzmp8-ZM28");
const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });

import somegood from "./assets/pokeball.jpg";
import loaders from "./assets/pokebal.gif";
import { set } from "react-hook-form";

type Props = {};

function Scan({}: Props) {
  const [facemode, setFaceMode] = useState("environment");
  const navigate = useNavigate();
  function switchCamera() {
    setFaceMode(facemode === "user" ? "environment" : "user");
  }
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: facemode,
  };

  const [imageSrc, setImageSrc] = React.useState(somegood);
  const webcamRef = useRef<Webcam>(null);
  const [foodData, setFoodData] = React.useState("");
  const [isScanning, setIsScanning] = React.useState(true);
  const [foodName, setFoodName] = useState("");
  const [dietaryRecommendations, setDietaryRecommendations] = useState([]);
  const [healthImpact, setHealthImpact] = useState([]);
  const [micronutrients, setMicronutrients] = useState([]);
  const [nutritionalFacts, setNutritionalFacts] = useState([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = React.useState(true);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (imageSrc) {
      setImageSrc(imageSrc);
      console.log(imageSrc);
    }
    setIsScanning(false);
  }, [webcamRef]);

  function retake() {
    setIsScanning(true);
  }

  async function generateCorbonFootprint() {
    setLoading(false);
    const prompt = `work as a object detection model and tell me the object is "food" , "product" or "medicine"`;

    const image = {
      inlineData: {
        data: imageSrc.split(",")[1],
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([prompt, image]);
    const response = result.response;
    const responseText = response.text();
    setLoading(false);
    if (responseText.includes("food")) {
      navigate("/food", { state: { imageSrc } });
    } else if (responseText.includes("product")) {
      navigate("/products", { state: { imageSrc } });
    } else {
      navigate("/medicine", { state: { imageSrc } });
    }
  }

  return (
    <>
      <div className="container p-4 flex justify-between">
        <Link to="/">
          <MoveLeftIcon />
        </Link>
        <h1 className="text-xl font-extrabold">Scan</h1>
      </div>
      <div className="relative">
        {isScanning ? (
          <>
            <Webcam
              audio={false}
              height={720}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={1280}
              videoConstraints={videoConstraints}
            />
            <div className="bg-gray-100 qrOnDiv">
              <div className="scanner"></div>
            </div>
          </>
        ) : (
          <>
            <img src={imageSrc} className="imageforphoto" />
          </>
        )}
        <div className="flex justify-center items-center gap-2">
          <Button
            className="m-4 flex gap-2"
            onClick={capture}
            variant="outline"
          >
            <TargetIcon /> Capture
          </Button>

          <Button className="m-4 flex gap-2" onClick={retake} variant="outline">
            <CameraIcon /> Retake
          </Button>
          <Button
            className="m-4 flex gap-2"
            onClick={switchCamera}
            variant="default"
          >
            <SwitchCamera />
          </Button>
        </div>
      </div>

      <div className="w-full flex justify-center items-center gap-2">
        <Button onClick={generateCorbonFootprint}>Identify & Redirect</Button>
      </div>
      {loading ? (
        <img src={somegood} className="my-7" />
      ) : (
        <>
          <img src={loaders} className="my-7" />
        </>
      )}
    </>
  );
}

export default Scan;
