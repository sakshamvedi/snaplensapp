import React from "react";
import charss from "./assets/good.png";
type Props = {};

function Profile({}: Props) {
  return (
    <div>
      <div className="flex flex-col justify-center items-center h-ninty w-full">
        <h1 className="text-3xl font-bold absolute top-2 right-7">Profile</h1>
        <img src={charss}></img>
        <h2 className="text-xl font-bold">Hey Good Looking, What's Cooking?</h2>
        <p className="my-7">P.S we are Working to save your profile :)</p>
      </div>
    </div>
  );
}

export default Profile;
