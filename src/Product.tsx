import { Link } from "react-router-dom";
import React, { useCallback, useRef, useState } from "react";
import {
  CameraIcon,
  CameraOff,
  MoveLeftIcon,
  ScanLine,
  SwitchCamera,
  TargetIcon,
} from "lucide-react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  LabelList,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import Webcam from "react-webcam";
import { Button } from "./components/ui/button";
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAi = new GoogleGenerativeAI("apikey");
const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });

import somegood from "./assets/leaf.png";
import qrcode from "./assets/QhBk2.png";
import { Badge } from "@/components/ui/badge";

type Props = {};

function Product({}: Props) {
  const [facemode, setFaceMode] = useState("environment");
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

  function getRandomHslColor() {
    const hue = Math.floor(Math.random() * 360); // Random hue between 0 and 360
    const saturation = Math.floor(Math.random() * 50) + 50; // Random saturation between 50% and 100%
    const lightness = Math.floor(Math.random() * 20) + 80; // Random lightness between 80% and 100%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

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
    const prompt = `
Certainly! Here’s a converted prompt for analyzing the carbon emissions of a product and how to dispose of it in an environmentally friendly manner:

As an expert in environmental sustainability, analyze the following product image and provide:

Name of the product
1.Key carbon emission facts (list 2 main points)
2.Recommendations for reducing carbon footprint (list 2 suggestions)
3.Overall environmental impact conclusion
4.Disposal instructions for minimizing environmental harm (no text data here - just the disposal methods)
5.Score the product image on a scale of 1-10 based on its environmental impact


Format the response as JSON with "name", "carbonEmissionFacts", "footprintRecommendations", "environmentalImpact", "disposalInstructions": [{ "method": "" }], "score" arrays ,  and please push data in these arrays even only 1 string is there ,  Do not use any markdown formatting in your response.`;
    const image = {
      inlineData: {
        data: imageSrc.split(",")[1],
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([prompt, image]);
    const response = result.response;
    const responseText = response.text();
    try {
      const parsedResponse = JSON.parse(responseText);
      console.log(parsedResponse);
      setFoodName(parsedResponse.name);
      setDietaryRecommendations(parsedResponse.carbonEmissionFacts);
      setHealthImpact(parsedResponse.footprintRecommendations);
      setMicronutrients(parsedResponse.environmentalImpact);
      setNutritionalFacts(parsedResponse.disposalInstructions);
      setScore(parsedResponse.score);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="container p-4 flex justify-between">
        <Link to="/">
          <MoveLeftIcon />
        </Link>
        <h1 className="text-xl font-extrabold">Product Analysis</h1>
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
        <Drawer>
          <DrawerTrigger
            onClick={generateCorbonFootprint}
            className="custom-button flex justify-center items-center gap-4"
          >
            <ScanLine />
            Scan Captured Item
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Carbon Emission Report with ❤️</DrawerTitle>
              <DrawerDescription>
                <p className="text-xl font-bold m-4 bg-indigo-100 rounded-full p-2 text-gray-800">
                  Product : {foodName} <p>Score : {score}</p>
                </p>
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 overflow-y-auto h-full">
              <section className="mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  Carbon Emission Facts
                </h3>
                <ul className="flex flex-col gap-2 font-bold  p-2 rounded-md">
                  {micronutrients}
                </ul>
              </section>

              <section className="mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  Foot Print Recommendations
                </h3>
                <ul className="flex flex-col gap-2 font-bold  p-2 rounded-md">
                  {nutritionalFacts.map((fact, index) => (
                    <li
                      key={index}
                      className="flex gap-4 font-bold bg-indigo-100 p-2 rounded-md"
                    >
                      <p>{index + 1}.</p> {fact.method}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  Environmental Impact
                </h3>
                <ul className="flex flex-col gap-2 font-bold  p-2 rounded-md">
                  {dietaryRecommendations.map((recommendation, index) => (
                    <li
                      key={index}
                      className="flex gap-4 font-bold bg-green-200 p-2 rounded-md"
                    >
                      <p>{index + 1}.</p> {recommendation}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  Disposal Instructions
                </h3>
                <p className="bg-green-200 p-2 rounded-md">{healthImpact}</p>
              </section>

              <div className="my-20"></div>
            </div>

            <DrawerFooter>
              <DrawerClose>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      <img src={somegood} className="my-7" />
    </>
  );
}

export default Product;
