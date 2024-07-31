import React, { useEffect } from "react";
import charss from "./assets/good.png";
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAi = new GoogleGenerativeAI("AIzaSyBI5B23RXprsQeqPuER3xVzFDzmp8-ZM28");
const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AppleIcon,
  ArrowBigLeft,
  ArrowRight,
  CircuitBoardIcon,
  EggFriedIcon,
  FlameIcon,
  HandIcon,
  HeartIcon,
  Link,
  LucidePower,
  LucideSparkle,
  MapPin,
  PanelTopClose,
  PowerOffIcon,
  ScanFace,
  ScanFaceIcon,
  SpadeIcon,
  SparkleIcon,
  SparklesIcon,
  Terminal,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

import { set } from "react-hook-form";
import { Button } from "./components/ui/button";

type Props = {};

function Profile({}: Props) {
  const [avatar, setAvatar] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [prodDesc, setProdDesc] = React.useState("");
  const [FoodDesc, setFoodDesc] = React.useState("");
  const [watchId, setWatchId] = React.useState(null);
  const [productScan, setProductScan] = React.useState(["hey"]);
  const [FriendScan, setFriendScan] = React.useState([
    "Whey Protein",
    "Yoga Protein Bar",
    "Apple",
    "Banana",
  ]);
  useEffect(() => {
    const food = localStorage.getItem("foodName") || "";
    const product = localStorage.getItem("product") || "";
    const finalList = food
      .split(",")
      .concat(product.split(","))
      .map((item) => item.replace(/[\[\]"]/g, "").trim());
    setProductScan(finalList);
  }, []);
  const getColor = (aqi) => {
    if (aqi <= 50) return "green";
    if (aqi <= 100) return "yellowgreen";
    if (aqi <= 150) return "orange";
    if (aqi <= 200) return "red";
    if (aqi <= 300) return "purple";
    return "maroon";
  };
  useEffect(() => {
    setAvatar(localStorage.getItem("name"));
    const SIX_HOURS_IN_MS = 1 * 60 * 60 * 1000; // 6 hours in milliseconds
    const lastExecutionTime = localStorage.getItem("lastReportGenerationTimes");
    const currentTime = new Date().getTime();

    if (
      !lastExecutionTime ||
      currentTime - parseInt(lastExecutionTime, 10) >= SIX_HOURS_IN_MS
    ) {
      generatePersonReport();
      generatePersonProductReport();
      generatePersonHealthReport();
      localStorage.setItem("lastReportGenerationTimes", currentTime.toString());
    } else {
      setDesc(localStorage.getItem("lastReportGenerationReport"));
      setProdDesc(localStorage.getItem("lastProductReport"));
      setFoodDesc(localStorage.getItem("lastFoodsReport"));
    }
  }, []);
  const [location, setLocation] = React.useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [address, setAddress] = React.useState<string | null>(null);
  const [isLocationLoading, setIsLocationLoading] = React.useState(true);
  async function refreshLocation() {
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const fetchAQI = async () => {
            const response = await fetch(
              `https://api.waqi.info/feed/geo:${latitude};${longitude}/?token=63fbad7f983f936ae63f828d7c99c250252714d9`
            );
            const data = await response.json();
            if (data.status === "ok") {
              setAqi(data.data.aqi);
            } else {
              console.error("Error retrieving AQI data:", data.data);
            }
          };
          fetchAQI();
          setLocation({ latitude, longitude });

          fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=5e303a432a7f423d8703818685b019a1`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data.results && data.results.length > 0) {
                setAddress(data.results[0].formatted);
              } else {
                setAddress("Address not found");
              }
            })
            .catch((error) => {
              console.error("Error fetching address: ", error);
              setAddress("Error fetching address");
            });
        },
        (error) => {
          console.error("Error getting location: ", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
      setWatchId(id);
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }
  const [aqi, setAqi] = React.useState(0);
  useEffect(() => {
    refreshLocation();
  }, []);

  async function generatePersonReport() {
    const foodheeaten = localStorage.getItem("foodName");
    const medicine = localStorage.getItem("medicineName");
    const product = localStorage.getItem("product");
    const gender = localStorage.getItem("gender");
    const prompt = `Based on the user's scanned items as a daily routune checker in the database  act as a as a doctor, including ${foodheeaten} ,${product} and ${medicine}, along with their ${gender}, generate a brief, personality profile . Consider their food preferences, technology usage, and health indicators. Highlight potential interests and lifestyle habits. Limit the response to 1-2 sentences and add emoji in the response.`;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();
    setDesc(responseText);
    localStorage.setItem("lastReportGenerationReport", response.text());
  }

  async function generatePersonProductReport() {
    const foodheeaten = localStorage.getItem("foodName");
    const medicine = localStorage.getItem("medicineName");
    const product = localStorage.getItem("product");
    const gender = localStorage.getItem("gender");
    const prompt = `Analyze: Name: ${avatar}, Gender: ${gender}, Food: ${foodheeaten}, Products: ${product}
As a environmentalist, create a 50-word personality profile considering:

Environmental impact of habits

Focus on key  eco-footprint. Use respectful, gender-appropriate language. Prioritize accuracy and relevance in this brief description."
This prompt:
Clearly specifies the 50-word limit
Give a clear focus on the eco-footprint
How much percentage of the profile should be dedicated to the eco-footprint [important ]
Encourages a balance of health, lifestyle, and environmental insights
Stresses the importance of respect and accuracy in the brief profile

This structure should help generate more focused and precise personality profiles within the given constraints add emoji in the response.`;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();
    setProdDesc(responseText);
    localStorage.setItem("lastProductReport", response.text());
  }

  async function generatePersonHealthReport() {
    const foodheeaten = localStorage.getItem("foodName");
    const gender = localStorage.getItem("gender");
    const prompt = `Create a brief, engaging 'About Me' profile for:
Name: ${avatar}
Gender: ${gender}
Recent food choices: ${foodheeaten}
In 50 words or less, craft a lively snapshot of this person's character, health habits, and lifestyle based on their food choices. Include:
One personality trait or value (e.g., adventurous, health-conscious)
One health insight
One lifestyle habit

Use a friendly, upbeat tone. Be respectful and avoid extreme assumptions, add emoji in the response.`;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();
    setFoodDesc(responseText);
    localStorage.setItem("lastFoodsReport", response.text());
  }
  return (
    <div>
      <div className="w-full take-padding">
        <div className="w-full h-1/6 flex justify-center items-center bg-abstract ">
          <div className="avatar font-bold text-4xl bg-indigo-500 flex-col text-white p-4 flex justify-center items-center h-15 absolute  h-20 w-20 text-center rounded-full border-white absvalue threedlook">
            {avatar.slice(0, 1).toUpperCase()}
          </div>
          <Button className="bg-gray-100 text-gray-900 text-xl font-bold absolute right-7 btnpower  ">
            <LucideSparkle /> 150 XP
          </Button>
        </div>
        <div className="profile-name text-2xl font-bold mt-7 text-start ml-4">
          {avatar.slice(0, 1).toUpperCase()}
          {""}
          {avatar.slice(1, avatar.length).toLowerCase()}
        </div>
        <div className="flex gap-2">
          <h1 className="text-xs ml-4 justify-center items-center flex mt-2 font-bold rounded-xl w-fit p-2">
            <div>Helath-Streak : 0 days</div>
          </h1>
          <h1 className="text-xs flex ml-4 mt-2 font-bold rounded-xl w-fit p-2">
            Green-Streak : 0 days
          </h1>
        </div>

        <Swiper
          className="mycustomheight"
          spaceBetween={10}
          slidesPerView={1.2}
          grabCursor={true}
          pagination={{ clickable: true }}
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => console.log(swiper)}
        >
          <SwiperSlide>
            <div className="profile-name text-md text-gray-500 font-bold mt-4 text-center flex flex-col justify-center items-center p-2 rounded-md w-90">
              <Alert>
                <AlertTitle className="mb-7 bg-green-100 p-2 w-fit rounded-xl">
                  About {avatar}
                </AlertTitle>
                <AlertDescription className="w-fit text-left">
                  {desc}
                </AlertDescription>
              </Alert>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="profile-name text-md text-gray-500 font-bold mt-4 text-center flex flex-col justify-center items-center p-2 rounded-md w-90">
              <Alert>
                <AlertTitle className="mb-7 bg-indigo-100 p-2 w-fit rounded-xl">
                  About {avatar} Responsibility
                </AlertTitle>
                <AlertDescription className="w-fit text-left">
                  {prodDesc}
                </AlertDescription>
              </Alert>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="profile-name text-md text-gray-500 font-bold mt-4 text-center flex flex-col justify-center items-center p-2 rounded-md w-90">
              <Alert>
                <AlertTitle className="mb-7 bg-red-100 p-2 w-fit rounded-xl flex gap-2 justify-center items-center">
                  <AppleIcon />
                  Food Choices
                </AlertTitle>
                <AlertDescription className="w-fit text-left">
                  {FoodDesc}
                </AlertDescription>
              </Alert>
            </div>
          </SwiperSlide>
        </Swiper>

        <div className="profile-name text-md text-gray-500 font-bold mt-4 p-2 text-center flex flex-col justify-center items-center rounded-md w-90">
          <AlertTitle className="text-white-900 bg-green-800 p-2 w-fit rounded-xl flex content-center items-center gap-3">
            <MapPin color="white" />{" "}
            <p
              className="text-xs text-gray-100 text-start"
              onClick={refreshLocation}
            >
              {address != null ? address : "Click to Snap Location"}
            </p>
          </AlertTitle>
        </div>
        <div
          style={{ textAlign: "start", marginLeft: "5px" }}
          className="font-bold flex flex-col justify-center items-center p-2 rounded-md w-90"
        >
          <div
            style={{
              width: "100%",
              height: "10px",
              margin: "0 auto",
              background: "lightgrey",
              borderRadius: "15px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${aqi / 5}%`,
                height: "100%",
                background: getColor(aqi),
                transition: "width 0.5s",
              }}
            ></div>
          </div>
          <p style={{ marginTop: "5px", fontSize: "20px" }}>AQI: {aqi}</p>
        </div>
      </div>
      <div className="ml-7">
        <h1 className="flex gap-4 font-bold text-xl text-gray-600 justify-start items-center">
          <ScanFace /> Last Scans
        </h1>
        <Swiper
          spaceBetween={10}
          slidesPerView={2.5}
          grabCursor={true}
          pagination={{ clickable: true }}
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => console.log(swiper)}
        >
          {productScan.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col justify-center border h-20  items-center p-2 rounded-md  w-fill mt-7">
                <AlertTitle className="w-full text-center">{item}</AlertTitle>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="ml-7 mt-7">
        <h1 className="flex gap-4 text-violet-800 font-bold text-xl text-gray-600 justify-start items-center">
          <HeartIcon /> Partner Scans
        </h1>
        <Swiper
          spaceBetween={10}
          slidesPerView={3}
          grabCursor={true}
          pagination={{ clickable: true }}
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => console.log(swiper)}
        >
          {FriendScan.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col justify-center border h-20  items-center p-2 rounded-md  w-fill mt-7">
                <AlertTitle className="w-full text-center">{item}</AlertTitle>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default Profile;
