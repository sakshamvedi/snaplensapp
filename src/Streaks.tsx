import React from "react";

type Props = {};
import { HeartHandshake } from "lucide-react";
function Streaks({}: Props) {
  return (
    <>
      <div className="h-screen flex flex-col gap-10 justify-center items-center">
        <HeartHandshake size={100} color="green" />
        <h1 className="text-xl font-bold text-center">
          Streaks: Soon to be implemented
        </h1>
      </div>
    </>
  );
}

export default Streaks;
