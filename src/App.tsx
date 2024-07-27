import Home from "../src/Home";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "../src/Footer";
import Chat from "../src/Chat";
import Scan from "../src/Scan";
import Profile from "../src/Profile";
import Product from "../src/Product";
import Food from "../src/Food";
import Medicine from "../src/Medicine";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={[<Home />, <Footer />]} />
          <Route path="/chat" element={[<Footer />, <Chat />]} />
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
