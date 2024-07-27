import React from "react";

type Props = {};
import charss from "./assets/charss.jpg";

function Chat({}: Props) {
  return (
    <div>
      <div className="flex flex-col justify-center items-center h-ninty w-full">
        <h1 className="text-3xl font-bold absolute top-2 right-7">Chat</h1>
        <img src={charss}></img>
        <h2 className="text-xl font-bold">
          We Are Working , Rolling it soon !!!!
        </h2>
      </div>
    </div>
  );
}

export default Chat;
