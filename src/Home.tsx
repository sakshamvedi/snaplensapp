import React, { useState, useEffect } from "react";
import vitalogo from "./assets/vita.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { AiFillMessage } from "react-icons/ai";
import "swiper/css";
import profilelogo from "./assets/saksham.jpeg";
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAi = new GoogleGenerativeAI("AIzaSyBI5B23RXprsQeqPuER3xVzFDzmp8-ZM28");
const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });
import {
  AppleIcon,
  BananaIcon,
  Bold,
  CarrotIcon,
  CherryIcon,
  Grape,
  GrapeIcon,
  LeafIcon,
  MessageCircleIcon,
  MessageSquareDashedIcon,
  Pill,
  PillIcon,
  Rocket,
  RocketIcon,
  Sandwich,
  ScanFaceIcon,
  SunIcon,
} from "lucide-react";
import { LuMessagesSquare } from "react-icons/lu";
import { Button } from "./components/ui/button";
type Props = {};
import { Link } from "react-router-dom";
const WebSocketURL = "ws://localhost:8080";

import { MessageSquarePlusIcon } from "lucide-react";
import { Toaster } from "./components/ui/toaster";
import { toast, useToast } from "@/components/ui/use-toast";

function getCurrentDayAndDate() {
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(WebSocketURL);

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "danger") {
        toast({
          variant: "destructive",
          title:
            "Hey !! Danger Alert" +
            data.name +
            "is in danger and his location is " +
            data.location,
        });
      } else {
        console.log("Message received:", data);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const date = new Date();
  const day = daysOfWeek[date.getDay()];
  const formattedDate = date.toLocaleDateString();
  return `${day}, ${formattedDate}`;
}

function Home({}: Props) {
  const [desc, setDesc] = useState("");
  const [generalInfor, setGeneralInfo] = useState("");
  const [healthScore, setHealthScore] = useState("");
  const [healthyMeals, setHealthyMeals] = useState("");
  const [avatar, setAvatar] = useState("");
  const [carbs, setCarbs] = useState("");
  const [protein, setProtein] = useState("");
  const [fat, setFat] = useState("");
  const toast = useToast();
  React.useEffect(() => {
    setAvatar(localStorage.getItem("name"));
    const SIX_HOURS_IN_MS = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
    const lastExecutionTime = localStorage.getItem("lastReportGenerationTimes");
    const currentTime = new Date().getTime();

    if (
      !lastExecutionTime ||
      currentTime - parseInt(lastExecutionTime, 10) >= SIX_HOURS_IN_MS
    ) {
      generatePersonReport();
      generateCorbonFootprint();
      localStorage.setItem("lastReportGenerationTimes", currentTime.toString());
    } else {
      const parsedResponse = JSON.parse(
        localStorage.getItem("mypersonalfoodreport")
      );
      try {
        console.log(parsedResponse.generalinfo[0]);
        setDesc(parsedResponse.generalinfo[0]);
        setHealthScore(parsedResponse.healthscore[0]);
        setHealthyMeals(parsedResponse.healthymeals[0]);
        setCarbs(parsedResponse.carbs[0]);
        setProtein(parsedResponse.protein[0]);
        localStorage.setItem("proteineaten", parsedResponse.protein[0]);
        setFat(parsedResponse.fat[0]);
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  function refreshReport() {
    generatePersonReport();
    generateCorbonFootprint();
  }
  async function generatePersonReport() {
    const foodheeaten = localStorage.getItem("foodName");
    const medicine = localStorage.getItem("medicineName");
    const product = localStorage.getItem("product");
    const gender = localStorage.getItem("gender");
    const prompt = `Analyze the following food consumption data for an individual:
Food items consumed: ${foodheeaten}
Based on this information, provide a concise report including:

Food Score: Calculate a score from 0-100, where 100 represents a perfectly balanced, nutritious diet. Consider factors such as variety, nutrient density, and balance of food groups.
Total Carbs: Estimate the total carbohydrate intake in grams.
Healthy Meals: Count the number of meals that can be considered 'healthy'. A healthy meal should include a good balance of proteins, complex carbohydrates, healthy fats, and vegetables.
Brief Commentary: In 1-2 sentences, provide an overall assessment of the diet, highlighting strengths and areas for improvement.

Present the information in a JSON format with 'generalinfo', 'healthscore', 'healthymeals', and 'carbs' arrays. Do not include any other information, just provide the JSON data. Use general nutritional guidelines and avoid making extreme judgments based on this limited data set.
The JSON structure should be as follows:
{
"generalinfo": ["Brief overall assessment"],
"healthscore": [numerical score],
"healthymeals": [number of healthy meals],
"carbs": [total carbs in grams]
 "protein" : [total protein in grams]
  "fat" : [total fat in grams]
}
Ensure that the response is a valid JSON object with these exact keys and array values, and Do not use any markdown formatting in your response. even if the arrays contain only one element and When you use this in your JSON,`;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();
    console.log(responseText);
    const parsedResponse = JSON.parse(responseText);
    localStorage.setItem("mypersonalfoodreport", responseText);
    setDesc(parsedResponse.generalinfo[0]);
    setHealthScore(parsedResponse.healthscore[0]);
    setHealthyMeals(parsedResponse.healthymeals[0]);
    setCarbs(parsedResponse.carbs[0]);
    localStorage.setItem("proteineaten", parsedResponse.protein[0]);
    setProtein(parsedResponse.protein[0]);
    setFat(parsedResponse.fat[0]);
  }

  async function generateCorbonFootprint() {
    const food = localStorage.getItem("foodName");
    const healthyFoods = [
      // Fruits
      "Apple",
      "Banana",
      "Orange",
      "Grapes",
      "Strawberry",
      "Blueberry",
      "Raspberry",
      "Blackberry",
      "Pineapple",
      "Mango",
      "Papaya",
      "Kiwi",
      "Peach",
      "Plum",
      "Nectarine",
      "Apricot",
      "Cherry",
      "Watermelon",
      "Cantaloupe",
      "Honeydew",
      "Pomegranate",
      "Grapefruit",
      "Lemon",
      "Lime",
      "Tangerine",
      "Mandarin",
      "Avocado",
      "Fig",
      "Date",
      "Guava",
      "Passion Fruit",
      "Dragon Fruit",
      "Starfruit",
      "Persimmon",
      "Lychee",
      "Longan",
      "Mulberry",
      "Gooseberry",
      "Currant",
      "Jujube",
      "Jackfruit",
      "Durian",
      "Salak",
      "Cherimoya",
      "Soursop",
      "Ackee",
      "Plantain",
      "Prickly Pear",

      // Indian Foods
      "Paneer Tikka",
      "Chana Masala",
      "Dal Tadka",
      "Vegetable Biryani",
      "Palak Paneer",
      "Aloo Gobi",
      "Rajma",
      "Bhindi Masala",
      "Aloo Paratha",
      "Dosa",
      "Idli",
      "Vada",
      "Chappati",
      "Butter Chicken",
      "Chicken Curry",
      "Rogan Josh",
      "Biryani",
      "Pulao",
      "Lentil Soup",
      "Khichdi",
      "Pani Puri",
      "Dhokla",
      "Kachori",
      "Tandoori Chicken",
      "Fish Curry",
      "Kebabs",

      // Non-Vegetarian Foods
      "Chicken Breast",
      "Turkey Breast",
      "Salmon",
      "Tuna",
      "Shrimp",
      "Crab",
      "Lobster",
      "Beef Steak",
      "Pork Tenderloin",
      "Ground Turkey",
      "Chicken Thighs",
      "Chicken Wings",
      "Duck",
      "Quail",
      "Lamb Chops",
      "Eggs",
      "Chicken Liver",
      "Beef Liver",
      "Pork Chops",
      "Fish Fillet",
      "Chicken Sausage",
      "Cod",
      "Sea Bass",
      "Halibut",
      "Octopus",
      "Squid",
    ];

    const prompt = `Analyze the following items consumed by an individual:
- Person's Food Consumed: ${food}
- Idol's Food Consumed: ${healthyFoods}

Compare the individual's food consumption with that of the idol's food choices. Assess how closely the person's food aligns with the healthy options consumed by the idol. Provide a comparison score in XP (experience points) based on this alignment and answer in JSON. 

The JSON structure should be as follows:
{
"Individual's Diet": ["Brief overall assessment"],
"Idol's Diet:": ["Brief overall assessment"],
"quotes:": ["A quote for change"],
"XP Score": [number based on comparison of both diets out of 100],
"Recommended diet chart": ["Brief overall assessment"]
}

Please provide the answer using the following keys: "xp", "individual", "idol", "quotes", "recomm". Do not use any markdown formatting in your response.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();
    console.log(responseText);
    localStorage.setItem("scoreComparison", responseText);
  }
  return (
    <div className="padding-bottom">
      <div className="flex  p-4 justify-between w-full">
        <img src={vitalogo} alt="logo" className="logoofvita" />
        <div className="flex gap-4 items-center justify-center">
          <Link to="/profile">
            <div className="rounded-full bg-gray-100  border border-4 border-violet-200 rounded-full w-10 h-10 flex justify-center items-center border-whit">
              <p className="text-2xl text-gray-900 ">{avatar.slice(0, 1)}</p>
            </div>
          </Link>
          <h1 className="text-sm font-bold">
            <Link to="/chat">
              <AiFillMessage size={32} color="black" />
            </Link>
          </h1>
        </div>
      </div>
      <div className="flex justify-start items-center p-4">
        <SunIcon size={22} color="gray" />
        <p className="text-sm font-bold mx-3 text-gray-600">
          {getCurrentDayAndDate()}
        </p>
      </div>
      <div className="p-4 flex justify-between w-full">
        <p className="text-3xl font-bold">Overview</p>
        <Button variant={"outline"} onClick={refreshReport}>
          {" "}
          <RocketIcon size={14} />{" "}
          <span>
            <pre> </pre>
          </span>
          Refresh Report
        </Button>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <p className="text-xl font-medium flex gap-2 items-center">
          {" "}
          <ScanFaceIcon size={32} color="gray" />
          Scan Things to get Insights
        </p>
        <div className="flex gap-2 justify-between w-full">
          <Link
            to="/products"
            className="flex flex-col justify-center items-center gap-2 boxstyle w-1/3 hover:bg-gray-100"
          >
            <LeafIcon size={42} color="green" />
            <p className="text-sm font-bold flex items-center gap-2">
              {" "}
              Products
            </p>
          </Link>

          <Link
            to="/food"
            className="flex flex-col justify-center items-center gap-2 boxstyle w-1/3 hover:bg-gray-100"
          >
            <AppleIcon size={32} color=" black" fontVariant={"filled"} />
            <p className="text-sm font-bold flex items-center gap-2"> Food</p>
          </Link>

          <Link
            to="/medicine"
            className="flex flex-col justify-center items-center gap-2 boxstyle w-1/3 hover:bg-gray-100"
          >
            <PillIcon size={42} color="purple" />
            <p className="text-sm font-bold flex items-center gap-2">
              {" "}
              Medicines
            </p>
          </Link>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-2xl font-bold ">For you </h2>
        <div className="flex flex-col gap-2 justify-between w-full customdiv my-4">
          <h2 className="text-md font-bold">Daily Food Score</h2>

          <p className="text-md">{desc}</p>

          <div className="badge">
            <span className="badge-number">{healthScore}</span>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold my-4">Health Report</h2>
          <Swiper spaceBetween={10} slidesPerView={2.5}>
            <SwiperSlide>
              <div className="flex flex-col gap-2 justify-between ml-2 p-4 border rounded-xl box0shad  w-90  my-4">
                <h2 className="text-md font-bold">🍴 Healthy Meals</h2>
                <p className="text-md font-bold text-lg text-gray-500 ">
                  {healthyMeals} bowls
                </p>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="flex flex-col gap-2 justify-between ml-2 p-4 border rounded-xl box0shad  w-90  my-4">
                <h2 className="text-md font-bold">🧀 Carbs</h2>
                <p className="text-md font-bold text-lg text-gray-500 ">
                  Consumed {carbs}g{" "}
                </p>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="flex flex-col gap-2 justify-between ml-2 p-4 border rounded-xl box0shad  w-90 my-4">
                <h2 className="text-md font-bold">🍛 Protein</h2>
                <p className="text-md font-bold text-lg text-gray-500 ">
                  Consumed {protein}g{" "}
                </p>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="flex flex-col gap-2 justify-between  ml-2 p-4 border rounded-xl box0shad w-90  my-4">
                <h2 className="text-md font-bold">🌭 Fat</h2>
                <p className="text-md font-bold text-lg text-gray-500 ">
                  Consumed {fat}g{" "}
                </p>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        <div className="flex flex-col gap-2 justify-between w-full customdiv my-4">
          <h2 className="text-md font-bold">Daily Corbon Budget</h2>

          <p className="text-md">
            Based on your allocated budget, you have consumed 4.2g of carbon so
            far.
          </p>

          <div className="badge">
            <span className="badge-number">4.2g</span>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default Home;
