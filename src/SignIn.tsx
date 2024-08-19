import React, { useState, useRef, useEffect } from "react";
import welcomeLogo from "./assets/vita.png";
import seePerson from "./assets/manseeworld.png";
import getUserName from "./assets/getusernameactual.png";
import welcomePage from "./assets/getPassword.png";
import lastStep from "./assets/lastStep.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Toaster } from "@/components/ui/toaster";
import { Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { RxTrackNext } from "react-icons/rx";
import {
  LockIcon,
  MailIcon,
  MoveLeftIcon,
  MoveRightIcon,
  User2Icon,
  UserSquareIcon,
} from "lucide-react";
import { set } from "react-hook-form";
import { validatePassword } from "firebase/auth";
import { Input } from "./components/ui/input";
import { useNavigate } from "react-router-dom";
import { Toast, ToastAction } from "@radix-ui/react-toast";
import axios from "axios";
type Props = {};

function SignIn({}: Props) {
  const { toast } = useToast();

  const suggestions = useRef<HTMLHeadingElement>(null);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [signusername, setsighnUsername] = useState<string>("");
  const [signpassword, setsignPassword] = useState<string>("");
  const [signname, setsignName] = useState<string>("");
  const [error, setError] = useState(false);
  const [errorPass, setErrorPass] = useState(false);
  const navigate = useNavigate();
  const click = useRef(null);

  function navigateToHome() {
    localStorage.setItem("isAuthenticated", "false");
    localStorage.setItem("username", "Guest User");
    localStorage.setItem("name", "Guest User");
    navigate("/home");
  }
  const handleButtonClick = () => {
    if (swiper && !error) {
      swiper.slideNext();
      return;
    }
  };

  const handlePassButtonClick = () => {
    if (swiper && !errorPass) {
      swiper.slideNext();
      return;
    }
  };

  const handlePrevButtonClick = () => {
    if (swiper && !errorPass) {
      swiper.slidePrev();
      return;
    }
  };

  const validatePassword = async () => {
    if (password.length === 0) {
      setErrorPass(true);
      return;
    } else {
      setErrorPass(false);
      const data = {
        username: username,
        password: password,
      };

      console.log(data);

      try {
        handlePassButtonClick();
        const response = await axios({
          method: "post",
          url: "https://snaplens-authbackend.onrender.com/login",
          headers: {
            "Content-Type": "application/json",
          },
          data: data, // Use params for GET request
        });
        console.log(response);
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
        localStorage.setItem("name", response.data.name);
        localStorage.setItem("isAuthenticated", "true");
        console.log(localStorage);
        navigate("/home");
      } catch (error) {
        handlePrevButtonClick();
        toast({
          variant: "destructive",
          title: "Sorry , User Not Found Press Back and Sign Up",
        });
        // console.error("Error:", error.message);
      }
    }
  };

  const validateEverything = async () => {
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    localStorage.setItem("name", name);

    await new Promise((resolve) =>
      setTimeout(() => {
        localStorage.setItem("isAuthenticated", "true");
        resolve(null);
      }, 1000)
    );

    navigate("/home");
  };

  const validateEverythingSign = async () => {
    if (signname.length == 0) {
      toast({
        title: "Name cannot be empty",
      });
      return;
    }
    if (signusername.includes(" ")) {
      toast({
        title: "Username cannot have white spaces and extra characters",
      });
      return;
    }
    if (signusername.length == 0) {
      toast({
        title: "Username cannot be empty",
      });
      return;
    }
    if (signpassword.length == 0) {
      toast({
        title: "Password cannot be empty",
      });
      return;
    }
    if (signpassword != password) {
      toast({
        title: "Password Did Not Match",
      });
      return;
    }
    handlePassButtonClick();
    const data = {
      username: signusername,
      password: signpassword,
      name: signname,
    };

    try {
      const response = await axios({
        method: "post",
        url: "https://snaplens-authbackend.onrender.com/signup",
        headers: {
          "Content-Type": "application/json",
        },
        data: data, // Use params for GET request
      });

      localStorage.setItem("username", signusername);
      localStorage.setItem("password", signpassword);
      localStorage.setItem("name", signname);
      localStorage.setItem("isAuthenticated", "true");

      navigate("/home");
    } catch (error) {
      handlePrevButtonClick();
      toast({
        title: "Sorry , Username Already Exists try with " + signusername + "1",
      });
    }
  };

  const validateName = () => {
    if (name.length == 0) {
      return;
    } else {
      handlePassButtonClick();
      validateEverything();
      return;
    }
  };

  const validateUsername = () => {
    //validate there no space in username and it is not empty
    if (username.length == 0) {
      suggestions.current.innerText = "Username cannot be empty";
      suggestions.current?.classList.add("text-red-900");
      setError(true);
      return;
    }
    if (username.trim() === "") {
      suggestions.current.innerText = "Username cannot have white spaces";
      suggestions.current?.classList.add("text-red-900");
      setError(true);
      return;
    }
    if (username.includes(" ")) {
      suggestions.current.innerText = "Username cannot have white spaces";
      suggestions.current?.classList.add("text-red-900");
      setError(true);
      return;
    } else {
      suggestions.current.innerText = "";
      suggestions.current?.classList.add("text-green-900");
      setError(false);
    }
  };

  return (
    <div className="">
      <Swiper
        allowTouchMove={false}
        className="mySwiper overflow-y-hidden"
        onSwiper={(swiperInstance) => setSwiper(swiperInstance)}
      >
        <SwiperSlide>
          <div className="w-full ">
            <div className=" gap-3 bg-customblue items-center justify-center  pb-5 ">
              <div className="healthApple"></div>
              <div className="flex flex-col gap-3 justify-start items-start ml-10 align">
                <img
                  src={welcomeLogo}
                  alt="Welcome"
                  className="object-fill smallLogo"
                />
                <h1 className="text-gray-100 text-3xl font-bold mt-7 leading-snug text-center">
                  India's 1st Health Encouragement App
                </h1>
                <p className="text-gray-300 text-sm mb-7 ">
                  Your Health Guide, Friend and Motivator
                </p>
                <Button
                  className="w-80 p-6 bg-gray-200 text-gray-700 text-lg font-bold hover:bg-black hover:text-white"
                  onClick={handleButtonClick}
                >
                  Get Started
                </Button>
                <Button
                  className="w-80 p-6 bg-black-primary text-white text-lg hover:bg-black hover:text-white"
                  onClick={navigateToHome}
                >
                  Skip
                </Button>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className="h-fill">
          <div className="bg-white h-screen flex flex-col gap-2 ">
            <span className="flex justify-center flex items-center ">
              <img
                src={welcomeLogo}
                alt="Welcome"
                className="object-fill smallLogo"
              />
              {/* <h1 className="text-2xl font-black text-violet-900">SnapLens</h1> */}
            </span>
            <h1 className="text-2xl font-bold text-gray-900 text-center">
              Welcome to SnapLens
            </h1>
            <p className="text-sm w-80 block ml-auto mr-auto  font-thin text-gray-400 text-center mt-1">
              Sign up or login to manage your health , track and compete with
              Friends , manage Streaks and much more
            </p>

            <div className="w-full h-full mt-7">
              <Tabs
                defaultValue="account"
                className="w-full  h-full bg-gray-100"
              >
                <TabsList className="bg-violet-custom">
                  <TabsTrigger
                    value="account"
                    className="w-full widthhalf font-bold"
                  >
                    LogIn
                  </TabsTrigger>
                  <TabsTrigger value="password" className="widthhalf font-bold">
                    SignUp
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="p-4 ">
                  <div className="flex flex-col">
                    <div className="relative">
                      <User2Icon className="absolute top-3 ml-2" />
                      <Input
                        className="p-6 pl-10 text-violet-900 font-bold"
                        placeholder="Enter your username"
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <p
                        ref={suggestions}
                        className="text-gray-300 text-sm mt-2 mb-2"
                      ></p>
                    </div>
                    <div className="relative">
                      <LockIcon className="absolute top-8 ml-2" />
                      <Input
                        className="p-6 pl-10 text-violet-900 font-bold mt-5"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    className="w-full p-6 bg-purple-900 text-purple-200  font-bold text-md mt-10 hover:bg-black hover:text-white"
                    onClick={() => {
                      validateUsername();
                      validatePassword();
                    }}
                  >
                    Login
                  </Button>
                  <p className="mt-5 text-sm text-gray-400 text-center">
                    By Signing up you agree to our Terms of Services and Privacy
                    Policy
                  </p>
                </TabsContent>
                <TabsContent value="password" className="p-5">
                  <div className="flex flex-col">
                    <div className="relative">
                      <User2Icon className="absolute top-3 ml-2" />
                      <Input
                        className="p-6 pl-10 text-violet-900 font-bold"
                        placeholder="Your Name"
                        onChange={(e) => setsignName(e.target.value)}
                      />
                      <p
                        ref={suggestions}
                        className="text-gray-300 text-sm mt-2 mb-2"
                      ></p>
                    </div>
                    <div className="relative">
                      <UserSquareIcon className="absolute top-8 ml-2" />
                      <Input
                        className="p-6 pl-10 text-violet-900 font-bold mt-5"
                        placeholder="Enter your Username"
                        onChange={(e) => setsighnUsername(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <LockIcon className="absolute top-8 ml-2" />
                      <Input
                        type="password"
                        className="p-6 pl-10 text-violet-900 font-bold mt-5"
                        placeholder="Enter your password"
                        onChange={(e) => setsignPassword(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <LockIcon className="absolute top-8 ml-2" />
                      <Input
                        type="password"
                        className="p-6 pl-10 text-violet-900 font-bold mt-5"
                        placeholder="Confirm your password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <Button
                      className="w-full p-6 bg-purple-900 text-purple-200  font-bold text-md mt-10 hover:bg-black hover:text-white"
                      onClick={() => {
                        validateEverythingSign();
                      }}
                    >
                      SignUp
                    </Button>
                    <p className="text-sm mt-7 text-gray-400">
                      By Signing up you are accepting our scan what you consume
                      policy , so we trained our recommendation system to serve
                      better for you
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="h-screen">
            <div className="flex flex-col gap-3 justify-center items-center pl-7 pr-7  h-full">
              <div className="loaders"></div>
              <h1 className="text-gray-900 text-md font-bold mt-20">
                {" "}
                Settings Things For you...
              </h1>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      <Toaster />
    </div>
  );
}

export default SignIn;
