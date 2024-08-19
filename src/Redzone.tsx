import React, { useEffect, useState } from "react";
import { Button } from "./components/ui/button";

const WebSocketURL = "ws://localhost:8080"; // Replace with your WebSocket server URL

const Redzone = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(WebSocketURL);

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "danger") {
        console.log("Danger alert received: from", data.message, data.location);
      } else {
        console.log("Message received:", data);
      }
    };
    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    socket.onmessage = (event) => {
      console.log("Message received:", event.data);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const sendDangerAlert = () => {
    if (ws) {
      const message = JSON.stringify({
        type: "danger",
        name: localStorage.getItem("name"),
        location: localStorage.getItem("location"),
      });
      ws.send(message);
    } else {
      console.error("WebSocket is not connected");
    }
  };
  const [address, setAddress] = React.useState<string | null>(null);
  const [location, setLocation] = React.useState<{}>();

  const [isLocationLoading, setIsLocationLoading] = React.useState(true);
  useEffect(() => {
    const refreshLocation = async () => {
      if (navigator.geolocation) {
        const id = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });

            fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=5e303a432a7f423d8703818685b019a1`
            )
              .then((response) => response.json())
              .then((data) => {
                if (data.results && data.results.length > 0) {
                  setAddress(data.results[0].formatted);
                  localStorage.setItem("location", data.results[0].formatted);
                } else {
                  setAddress("Address not found");
                }
              })
              .catch((error) => {
                console.error("Error fetching address: ", error);
                setAddress("Error fetching address");
              });
          },
          (error) => {
            console.error("Error getting location: ", error);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    refreshLocation();
  }, []);

  return (
    <div>
      <div className="flex justify-center items-center h-screen">
        <Button onClick={sendDangerAlert}>I am Not Feeling Safe !!!</Button>
      </div>
    </div>
  );
};

export default Redzone;
