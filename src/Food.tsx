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
const genAi = new GoogleGenerativeAI("AIzaSyBI5B23RXprsQeqPuER3xVzFDzmp8-ZM28");
const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });

import somegood from "./assets/somegood.png";
import qrcode from "./assets/QhBk2.png";
import { Badge } from "@/components/ui/badge";

type Props = {};

function Food({}: Props) {
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

  const chartData = micronutrients.map((nutrient, index) => ({
    nutrient: nutrient.name,
    percentage: parseFloat(nutrient.percentage),
    fill: getRandomHslColor(),
  }));

  console.log(chartData);
  const chartConfig = {
    percentage: {
      label: "Percentage",
    },
    ...Object.fromEntries(
      micronutrients.map((nutrient, index) => [
        nutrient.name.toLowerCase().replace(/\s+/g, "_"),
        {
          label: nutrient.name,
          color: getRandomHslColor(),
        },
      ])
    ),
  } satisfies ChartConfig;

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
    const prompt = `As an expert nutritionist, analyze the following food image and provide:
  0. Name of the food
  1. Key nutritional facts (list 2 main points)
  2. Recommendations for a balanced diet (list 2 suggestions)
  3. Overall health impact conclusion
  4. Micronutrients present in the food with their percentage (no text data here - just the names and percentages)
  5. Score the food image on a scale of 1-10 based on its health impact

  Food Image: [IMAGE]

  Format the response as JSON with "name " ,"nutritionalFacts", "dietaryRecommendations", "healthImpact"  ,  "micronutrients": [{ "name": "", "percentage": "" }], "score" arrays. Do not use any markdown formatting in your response.`;
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
      setDietaryRecommendations(parsedResponse.dietaryRecommendations);
      setHealthImpact(parsedResponse.healthImpact);
      setMicronutrients(parsedResponse.micronutrients);
      setNutritionalFacts(parsedResponse.nutritionalFacts);
      setScore(parsedResponse.score); // Assuming there's a score in the response
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
        <h1 className="text-xl font-extrabold">Food Analysis</h1>
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
            Scan Captured Food
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Food Report with ❤️</DrawerTitle>
              <DrawerDescription>
                <p className="text-xl font-bold m-4 bg-indigo-100 rounded-full p-2 text-gray-800">
                  Food : {foodName}
                </p>
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 overflow-y-auto h-full">
              <section className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Micronutrients</h3>
                <ul className="flex flex-col gap-2 font-bold  p-2 rounded-md">
                  {micronutrients.map((nutrient, index) => (
                    <li
                      key={index}
                      className="flex gap-4 font-bold bg-red-200 p-2 rounded-md"
                    >
                      <p>{index + 1}.</p> {nutrient.name}: {nutrient.percentage}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  Key Nutritional Facts
                </h3>
                <ul className="flex flex-col gap-2 font-bold  p-2 rounded-md">
                  {nutritionalFacts.map((fact, index) => (
                    <li
                      key={index}
                      className="flex gap-4 font-bold bg-indigo-100 p-2 rounded-md"
                    >
                      <p>{index + 1}.</p> {fact}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  Dietary Recommendations
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
                <h3 className="text-lg font-semibold mb-2">Health Impact</h3>
                <p className="bg-green-200 p-2 rounded-md">{healthImpact}</p>
              </section>

              <div className="my-20">
                <Card>
                  <CardHeader>
                    <CardTitle>Micro Nutrients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig}>
                      <RadialBarChart
                        data={chartData}
                        startAngle={-90}
                        endAngle={380}
                        innerRadius={30}
                        outerRadius={110}
                      >
                        <ChartTooltip
                          cursor={false}
                          content={
                            <ChartTooltipContent hideLabel nameKey="nutrient" />
                          }
                        />
                        <RadialBar dataKey="percentage" background>
                          <LabelList
                            position="insideStart"
                            dataKey="nutrient"
                            className="fill-black capitalize mix-blend-luminosity"
                            fontSize={16}
                          />
                        </RadialBar>
                      </RadialBarChart>
                    </ChartContainer>
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 font-medium leading-none">
                      Nutrient intake improved by 5.2% this month{" "}
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="leading-none text-muted-foreground">
                      Showing micronutrient percentages based on recommended
                      daily intake
                    </div>
                  </CardFooter>
                </Card>
              </div>
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

export default Food;
