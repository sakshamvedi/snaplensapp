import {
  ChefHatIcon,
  CircleDashedIcon,
  Home,
  MessageCircleIcon,
  PowerOffIcon,
  ScanIcon,
  User2Icon,
} from "lucide-react";
import React, { Profiler } from "react";
import { Link } from "react-router-dom";
type Props = {};

function Footer({}: Props) {
  return (
    <>
      <div className="flex justify-between footerbottom">
        <div className="flex justify-center flex-col items-center gap-2">
          <Home />
          <Link to="/home"> Home</Link>
        </div>
        <div className="flex justify-center flex-col items-center gap-2">
          <ScanIcon />
          <Link to="/scan"> Scan</Link>
        </div>
        <div className="flex justify-center flex-col items-center gap-2">
          <MessageCircleIcon />
          <Link to="/chat"> Chat</Link>
        </div>
        <div className="flex justify-center flex-col items-center gap-2">
          <User2Icon />
          <Link to="/profile"> Profile</Link>
        </div>
      </div>
    </>
  );
}

export default Footer;
