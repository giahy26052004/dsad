import { BrowserRouter } from "react-router-dom";

import {
  Hero,
  Navbar,
  Contact,
  CanvasLoader,
  EarthCanvas,
  BallCanvas,
  ComputersCanvas,
} from "./components";
import Login from "./components/auth/Login";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted");
    closeModal();
  };
  return (
    <BrowserRouter>
      <div className="relative z-0 bg-primary">
        <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
          {/* <Login
            isOpen={isModalOpen}
            onClose={closeModal}
            onSubmit={handleSubmit}
          /> */}

          <Navbar />
          <Hero />
        </div>

        <div className="relative z-0">
          <Contact />
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
