import React, { useEffect, useState, useRef } from "react";
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
import Cardss from "./assets/card.jpg";
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCaption(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    setUploading(true);

    try {
      const storageRef = ref(storage, `photos/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, "photos"), {
        caption: caption,
        imageUrl: downloadURL,
        createdAt: new Date(),
      });

      alert("Photo uploaded successfully!");
      setFile(null);
      setCaption("");
    } catch (error) {
      console.error("Error uploading photo: ", error);
      alert("An error occurred while uploading the photo.");
    } finally {
      setUploading(false);
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

Respond to their question as a caring friend who's fully aware of their recent lifestyle. Use your knowledge of their habits if it's relevant to the current question do not mix previour interaction with current one if not required , but don't force this information if it's not necessary. Focus on answering their current question directly.

Only bring up past conversations if ${name} specifically asks about something from the past or if it's crucial to answer their current question.
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
      <div className="mt-5 p-4">
        <Swiper spaceBetween={10} slidesPerView={1.1}>
          <SwiperSlide>
            <div className="flex flex-col customyellow p-4 rounded-3xl">
              <p className="font-md ml-2 text-left font-bold">Progress</p>
              <div className="flex ml-2 mt-2 mb-2 content-center items-center gap-1">
                <FerrisWheelIcon className="mr-2" size={40} />
                <p className="ml-2 font-bold text-4xl">
                  {localStorage.getItem("proteineaten")}g
                </p>
                <span className="text-sm ml-2 flex-col">
                  <p>235 friends on P-streak</p>
                  <p className="font-bold">#10 among friends</p>
                </span>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex flex-col customgreen p-4 rounded-3xl">
              <p className="font-md ml-2 text-left font-bold">Progress</p>
              <div className="flex ml-2 mt-2 mb-2 content-center items-center gap-1">
                <p className="mr-2 text-4xl underline">XP</p>
                <p className="ml-2 font-bold text-4xl ">{xpscore}</p>
                <span className="text-sm ml-2 flex-col">
                  <Dialog>
                    <DialogTrigger className="p-2 flex customgreen border border-gray-800 rounded-full font-bold">
                      iDOLS Insights
                      <LucideRocket className="ml-2" size={20} />
                    </DialogTrigger>
                    <DialogContent className="w-80">
                      <DialogHeader>
                        <DialogTitle>Your Idol's Thought</DialogTitle>
                        <DialogDescription>
                          <p className="text-sm italic font-bold underline">
                            {quote}
                          </p>
                          <h1>Recommendation : {recom}</h1>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </span>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      <h1 className="ml-3 font-bold text-2xl">Feed</h1>
      <div className="ml-3 mt-4 mr-3">
        <Tabs defaultValue="feed">
          <TabsList className="w-full">
            <TabsTrigger value="feed" className="w-1/2">
              <CircleDotDashed />
            </TabsTrigger>
            <TabsTrigger value="idols" className="w-1/2 bg">
              <MessageSquareDashed />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="feed">
            <div className="mb-4">
              <div className="flex flex-col gap-4 mt-7 ">
                <img src={imageMeds} className="rounded-2xl mb-10"></img>
                <div className="flex flex-col jutsify-start gap-4 p-4 rounded-2xl boxshadowUi">
                  <img
                    src={imageCoffee}
                    className="rounded-2xl imageheight"
                  ></img>
                  <span className="flex flex-col gap-2">
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button variant="outline">
                          {" "}
                          See What Inside the Coffee at Microsoft 🌟
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <div className="mx-auto w-full max-w-sm">
                          <DrawerHeader>
                            <DrawerTitle>Coffee Mania</DrawerTitle>
                            <DrawerDescription>
                              Just Finshed few gulp of caffiene Let's See ....
                            </DrawerDescription>
                          </DrawerHeader>
                          <div className="p-4 pb-0">
                            <p className="font-bold">Caffeine</p>
                            <p>
                              Caffeine is a central nervous system stimulant of
                              the methylxanthine class. It is the world's most
                              widely consumed psychoactive drug. Unlike many
                              other psychoactive substances, it is legal and
                              unregulated in nearly all parts of the world.
                            </p>
                          </div>
                          <DrawerFooter>
                            <DrawerClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </div>
                      </DrawerContent>
                    </Drawer>
                  </span>
                </div>
                <div className="flex flex-col jutsify-start gap-4 p-4 rounded-2xl boxshadowUi">
                  <img src={imageMan} className="rounded-2xl imageheight"></img>
                  <span className="flex flex-col gap-2">
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button variant="outline"> Hee Hee Hee 🌟</Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <div className="mx-auto w-full max-w-sm">
                          <DrawerHeader>
                            <DrawerTitle>Capacitors .....</DrawerTitle>
                            <DrawerDescription></DrawerDescription>
                          </DrawerHeader>
                          <div className="p-4 pb-0">
                            <p className="font-bold">Caffeine</p>
                            <p>
                              Caffeine is a central nervous system stimulant of
                              the methylxanthine class. It is the world's most
                              widely consumed psychoactive drug. Unlike many
                              other psychoactive substances, it is legal and
                              unregulated in nearly all parts of the world.
                            </p>
                          </div>

                          <div className="mt-2 rounded-2xl"></div>
                          <DrawerFooter>
                            <DrawerClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </div>
                      </DrawerContent>
                    </Drawer>
                  </span>
                </div>
                <div className="flex flex-col jutsify-start gap-4 p-4 rounded-2xl boxshadowUi">
                  <img src={Cardss} className="rounded-2xl imageheight"></img>
                  <span className="flex flex-col gap-2">
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button variant="outline">
                          {" "}
                          okay !! lets see what it contains🌟
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <div className="mx-auto w-full max-w-sm">
                          <DrawerHeader>
                            <DrawerTitle>OX day Card...</DrawerTitle>
                            <DrawerDescription></DrawerDescription>
                          </DrawerHeader>
                          Carbon Emission Facts The overall environmental impact
                          of a plastic card like this is moderate. The card's
                          relatively small size and limited materials contribute
                          to a lower carbon footprint compared to larger
                          products. However, the production and disposal
                          processes still have environmental implications.
                          <div className="mt-2 rounded-2xl"></div>
                          <DrawerFooter>
                            <DrawerClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </div>
                      </DrawerContent>
                    </Drawer>
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {feedPosts.map((post) => (
                <div key={post.id} className="border p-4 rounded-lg">
                  <img
                    src={post.imageUrl}
                    alt="Post"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <p className="mt-2 font-bold">{post.caption}</p>
                  <p className="text-sm text-gray-500">
                    {/* {post.createdAt.toDate().toLocaleString()} */}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="idols">
            <div className="flex flex-col">
              <div className="flex flex-col">
                <p className="font-bold text-xl mt-2 ml-3 mb-2">Chats</p>
                <div
                  className="flex flex-col fixedchatsectionforchat overflow-y-auto"
                  ref={chatContainerRef}
                >
                  {previousChats.map((chat, index) => (
                    <>
                      <div key={index} className="flex gap-10 s">
                        <div
                          key={index}
                          className="bg-violet-old mt-10 p-4 rounded-xl relative top-7"
                        >
                          <p>{chat}</p>
                        </div>
                        <div key={index}>
                          <div className="bg-violet-new p-4 mt-10 rounded-3xl">
                            {userChats[index]}
                          </div>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Chat;
