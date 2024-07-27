import React from "react";
import vitalogo from "./assets/vita.jpg";
import profilelogo from "./assets/saksham.jpeg";
import {
  AppleIcon,
  BananaIcon,
  CarrotIcon,
  CherryIcon,
  Grape,
  GrapeIcon,
  LeafIcon,
  Pill,
  PillIcon,
  Rocket,
  RocketIcon,
  Sandwich,
  ScanFaceIcon,
  SunIcon,
} from "lucide-react";
import { Button } from "./components/ui/button";
type Props = {};
import { Link } from "react-router-dom";
function getCurrentDayAndDate() {
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
  return (
    <>
      <div className="flex p-4 justify-between w-full">
        <img src={vitalogo} alt="logo" className="logoofvita" />
        <div className="rounded-full">
          <img
            src={profilelogo}
            alt="logo"
            className="logoofvita rounded-full"
          />
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
        <Button variant={"outline"}>
          {" "}
          <RocketIcon size={14} />{" "}
          <span>
            <pre> </pre>
          </span>
          All Data
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

          <p className="text-md">
            Based on your overview food Intake, your score is 8 and consider
            good..
          </p>

          <div className="badge">
            <span className="badge-number">8</span>
          </div>
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
    </>
  );
}

export default Home;
