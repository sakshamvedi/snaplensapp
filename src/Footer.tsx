import {
  ChefHatIcon,
  CircleDashedIcon,
  HeartHandshake,
  HeartOffIcon,
  Home,
  LucideSpeaker,
  MessageCircleIcon,
  PowerIcon,
  PowerOffIcon,
  ScanIcon,
  SpadeIcon,
  SparklesIcon,
  StopCircleIcon,
  StretchVertical,
  User2Icon,
} from "lucide-react";
import React, { Profiler } from "react";
import { CgDanger } from "react-icons/cg";
import { Link } from "react-router-dom";
type Props = {};

function Footer({}: Props) {
  return (
    <>
      <div className="flex justify-between footerbottom">
        <div className="flex justify-center flex-col items-center gap-2">
          <Link
            to="/home"
            className="flex justify-center flex-col items-center gap-2 text-sm"
          >
            {" "}
            <Home size={20} /> Home
          </Link>
        </div>
        <div>
          <Link
            to="/scan"
            className="flex justify-center flex-col items-center gap-2 text-sm"
          >
            {" "}
            <ScanIcon />
            Scan
          </Link>
        </div>
        <div className="flex justify-center flex-col items-center gap-2 text-sm">
          <Link
            to="/streaks"
            className="flex justify-center flex-col items-center gap-2 "
          >
            {" "}
            <HeartHandshake />
            Streaks
          </Link>
        </div>
        <div className="flex justify-center flex-col items-center gap-2">
          <Link
            to="/profile"
            className="flex justify-center flex-col items-center gap-2 text-sm"
          >
            {" "}
            <User2Icon />
            Profile
          </Link>
        </div>
      </div>
    </>
  );
}

export default Footer;
