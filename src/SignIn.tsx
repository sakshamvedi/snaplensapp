import React from "react";
import welcomeImage from "./assets/welcomepage.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";

import "swiper/css/pagination";
type Props = {};

function SignIn({}: Props) {
  return (
    <div className="h-fit">
      <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
        <SwiperSlide>
          <div className="w-full bg-gray-200 flex items-center justify-center">
            <img src={welcomeImage} alt="Welcome" />
          </div>
        </SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
      </Swiper>
    </div>
  );
}

export default SignIn;
