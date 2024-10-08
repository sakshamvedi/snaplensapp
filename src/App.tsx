import Home from "../src/Home";
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "../src/Footer";
import Chat from "../src/Chat";
import Scan from "../src/Scan";
import Profile from "../src/Profile";
import Product from "../src/Product";
import Food from "../src/Food";
import Medicine from "../src/Medicine";
import { loadavg } from "os";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import LanguageSelection from "./LanguageSelection";
import { Toast } from "./components/ui/toast";
import { Toaster } from "./components/ui/toaster";
import Redzone from "./Redzone";
import Streaks from "./Streaks";

function App() {
  const [login, setLogin] = React.useState(false);

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") === "true") {
      setLogin(true);
    }
  }, []);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={login ? [<Home />, <Footer />] : [<SignIn />]}
          />
          <Route path="/home" element={[<Home />, <Footer />]} />
          <Route path="/streaks" element={[<Streaks />, <Footer />]} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/chat" element={[<Chat />]} />
          <Route path="/scan" element={[<Footer />, <Scan />]} />
          <Route path="/profile" element={[<Footer />, <Profile />]} />
          <Route path="/products" element={[<Footer />, <Product />]} />
          <Route path="/food" element={[<Footer />, <Food />]} />
          <Route path="/medicine" element={[<Footer />, <Medicine />]} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
