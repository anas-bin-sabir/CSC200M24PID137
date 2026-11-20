import React from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react"; // Lucide icon for the button

export default function LeavePage() {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <div className="relative min-h-dvh w-full font-[Poppins] text-amber-50 overflow-x-hidden">
      {/* Background Image */}
      <div
        className="
          fixed inset-0
          bg-[url('https://img.freepik.com/premium-photo/dark-blue-abstract-background-with-geometric-pattern_1105541-1623.jpg')]
          bg-cover bg-center bg-no-repeat
          filter brightness-50
        "
      ></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh px-4 sm:px-6 py-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-cinzel md:text-6xl font-extrabold mb-4 sm:mb-6 text-yellow-400 drop-shadow-xl animate-fadeIn">
          Thank You for Playing!
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-12 max-w-2xl text-white drop-shadow-md animate-fadeIn delay-200">
          We hope you enjoyed the game. Come back anytime to play again and
          improve your score!
        </p>

        <button
          onClick={handleBackHome}
          className="
            bg-linear-to-r from-yellow-400 to-yellow-500
            hover:scale-105 transform transition duration-300
            px-8 sm:px-12 py-3 sm:py-4 rounded-3xl text-gray-900 text-xl sm:text-2xl font-semibold
            shadow-xl hover:shadow-2xl flex items-center justify-center gap-3
          "
        >
          <Home size={24} /> Back to Home
        </button>

        {/* Optional floating card animations for consistency */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="animate-float absolute top-20 left-1/4 w-16 h-24 bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d3/Playing_card_spade_A.svg')] bg-contain bg-no-repeat opacity-50"></div>
          <div className="animate-float-slow absolute top-40 right-1/3 w-16 h-24 bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d3/Playing_card_spade_A.svg')] bg-contain bg-no-repeat opacity-50"></div>
          <div className="animate-float absolute bottom-24 left-1/2 w-16 h-24 bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d3/Playing_card_spade_A.svg')] bg-contain bg-no-repeat opacity-50"></div>
        </div>
      </div>
    </div>
  );
}
