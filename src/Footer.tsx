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
          
          <Link to="/home" className="flex justify-center flex-col items-center gap-2"> <Home /> Home</Link>
        </div>
        <div >
          
          <Link  to="/scan" className="flex justify-center flex-col items-center gap-2"> <ScanIcon />Scan</Link>
        </div>
        <div className="flex justify-center flex-col items-center gap-2">
          
          <Link to="/chat" className="flex justify-center flex-col items-center gap-2"> <MessageCircleIcon />Chat</Link>
        </div>
        <div className="flex justify-center flex-col items-center gap-2">
          
          <Link to="/profile" className="flex justify-center flex-col items-center gap-2"> <User2Icon />Profile</Link>
        </div>
      </div>
    </>
  );
}

export default Footer;
