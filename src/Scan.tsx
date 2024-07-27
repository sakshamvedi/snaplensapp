import React from "react";
import { Link } from "react-router-dom";
type Props = {};

function Scan({}: Props) {
  return (
    <>
      <div className="flex h-ninty w-full flex-col justify-between items-center">
        <Link
          to="/food"
          className="h-1/3 w-full flex justify-center items-center bg-custom-image"
        ></Link>
        <Link
          to="/products"
          className="h-1/3 w-full flex justify-center items-center bg-blue-200 bg-custum-2-image"
        ></Link>
        <Link
          to="/medicine"
          className="h-1/3 w-full flex justify-center items-center bg-green-200 bg-custum-3-image"
        ></Link>
      </div>
    </>
  );
}

export default Scan;
