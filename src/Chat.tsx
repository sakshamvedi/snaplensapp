import React, { useEffect, useState, useRef } from "react";
import ReadAloudButton from "./ReadAloudButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router-dom";
import {
  CircleDotDashed,
  FerrisWheelIcon,
  HeartHandshake,
  LucideMessageCircle,
  LucideRocket,
  MessageCircleIcon,
  MessageSquare,
  MessageSquareDashed,
  MessageSquareDashedIcon,
  SendIcon,
} from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./components/ui/button";
import { storage, db } from "./firebase.config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { GoogleGenerativeAI } from "@google/generative-ai";
import imageCoffee from "./assets/coffee.jpg";
import imageMeds from "./assets/medscc.png";
import imageMan from "./assets/micone.jpg";
import snappyy from "./assets/tinkuu.png";
const genAi = new GoogleGenerativeAI("AIzaSyBI5B23RXprsQeqPuER3xVzFDzmp8-ZM28");
const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });

import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Product from "./Product";
import { LucideMessageSquareDashed } from "lucide-react";
import { MoveLeftIcon } from "lucide-react";

type Props = {};

interface FeedPost {
  id: string;
  caption: string;
  imageUrl: string;
  createdAt: Date;
}

function Chat({}: Props) {
  const [xpscore, setXpScore] = useState<string>("");
  const [indc, setIndv] = useState<string>("");
  const [recom, setRecom] = useState<string>("");
  const [quote, setQuote] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);
  const [previousChats, setPreviousChats] = useState<string[]>([]);
  const [userChats, setUserChat] = useState<string[]>([]);
  const [userInput, setuserInput] = useState<string>("");
  const [loading, setloading] = useState(false);
  const [background, setBackground] = useState(true);
  useEffect(() => {
    getLocalData();
    // fetchFeedPosts();
  }, []);

  // Make sure to define the ref at the top of your component
  const chatContainerRef = useRef(null);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [previousChats, loading]);

  const getLocalData = () => {
    const responseText = localStorage.getItem("scoreComparison");
    if (responseText) {
      try {
        const parsedResponse = JSON.parse(responseText);
        setXpScore(parsedResponse.xp || "");
        setIndv(parsedResponse.individual || "");
        setRecom(parsedResponse.recomm || "");
        setQuote(parsedResponse.quotes || "");
      } catch (error) {
        console.error("Error parsing local data: ", error);
      }
    }
  };

  const fetchFeedPosts = () => {
    const q = query(
      collection(db, "photos"),
      orderBy("createdAt", "desc"),
      limit(20)
    );

    onSnapshot(q, (snapshot) => {
      const posts: FeedPost[] = [];
      snapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() } as FeedPost);
      });
      setFeedPosts(posts);
    });
  };

  async function returnansofchat(userInput: string) {
    setloading(true);
    setBackground(false);
    const foodheeaten = localStorage.getItem("foodName");
    const medicine = localStorage.getItem("medicineName");
    const product = localStorage.getItem("product");
    const gender = localStorage.getItem("gender");
    const name = localStorage.getItem("name");
    const prompt = `
You are an AI assistant acting as ${name}'s close friend. You know everything about their recent lifestyle, including what they've eaten, products they've used, and medications they've taken. Use this knowledge naturally in your responses.

You have access to recent interactions: ${previousChats}

Speak in Hinglish (a mix of Hindi and English) in a casual, friendly tone.

Detailed info about ${name}'s recent habits:
- All food consumed: ${foodheeaten}
- All products used: ${product}
- All medications taken: ${medicine}

${name} just asked: "${userInput}"

Respond to their question as a caring friend who's fully aware of their recent lifestyle. Use your knowledge of their habits if it's relevant to the current question. Do not mix previous interaction with current one if not required , but don't force this information if it's not necessary. Focus on answering their current question directly.

Only bring up past conversations if ${name} specifically asks about something from the past or if it's crucial to answer their current question. Do not ask too many questions from the user. Instead, try to answer them directly.
`;
    const result = await model.generateContent([prompt]);
    const response = result.response;
    const responseText = response.text();
    setUserChat([...userChats, userInput]);
    setloading(false);
    setuserInput("");
    setPreviousChats([...previousChats, responseText]);
  }

  return (
    <div>
      <div className="container p-4 flex justify-between">
        <Link to="/home">
          <MoveLeftIcon />
        </Link>
        <h1 className="text-xl font-extrabold">Chat</h1>
      </div>
      <div className="p-4 ">
        {background ? (
          <>
            <div className="flex flex-col">
              <img src={snappyy} className="mb-7"></img>
              <h1 className="flex gap-7 font-bold justify-center">
                Tell Snappyyy... how you feeling today:){" "}
              </h1>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col">
              <div className="flex flex-col">
                <div
                  className="flex flex-col fixedchatsectionforchat overflow-y-auto marginbottom"
                  ref={chatContainerRef}
                >
                  {previousChats.map((chat, index) => (
                    <>
                      <div key={index} className="flex flex-col gap-2  s">
                        <div key={index}>
                          <div className="bg-violet-new p-4 mt-10 w-fit rounded-xl relative">
                            {userChats[index]}
                          </div>
                        </div>
                        <div
                          key={index}
                          className="bg-violet-old p-4 rounded-xl w-fit relative "
                        >
                          <p>{chat}</p>
                          <ReadAloudButton text={chat} />
                        </div>
                      </div>
                    </>
                  ))}
                  {loading && (
                    <div className="border p-4 rounded-lg mt-2">
                      <p className="loader  ml-4"></p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex flex-col mt-4 fixedchatsection">
          <div className="flex gap-2  justify-center items-center mt-2">
            <input
              type="text"
              placeholder="Chat Here..."
              value={userInput}
              className="border p-2 ml-2 w-full"
              onChange={(e) => setuserInput(e.target.value)}
            />
            <Button
              className="bg-black-800 border hover:bg-blue-100"
              onClick={() => returnansofchat(userInput)}
            >
              <SendIcon color="black" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
