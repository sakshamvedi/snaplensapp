import React, { useEffect, useState } from "react";
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
import charss from "./assets/charss.jpg";
import { FerrisWheelIcon, LucideRocket } from "lucide-react";
import { Button } from "./components/ui/button";
import { storage, db } from "./firebase.config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

type Props = {};

function Chat({}: Props) {
  const [xpscore, setXpScore] = useState<string>("");
  const [indc, setIndv] = useState<string>("");
  const [recom, setRecom] = useState<string>("");
  const [quote, setQuote] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

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
      // Upload file to Firebase Storage
      const storageRef = ref(storage, `photos/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Add metadata to Firestore
      await addDoc(collection(db, "photos"), {
        caption: caption,
        url: downloadURL,
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

  useEffect(() => {
    getLocalData();
  }, []);

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
      <div>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <input
          type="text"
          value={caption}
          onChange={handleCaptionChange}
          placeholder="Enter a caption"
        />
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Photo"}
        </button>
      </div>
    </div>
  );
}

export default Chat;
