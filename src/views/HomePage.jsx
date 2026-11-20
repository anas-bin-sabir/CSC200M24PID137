import React from "react";
import { useNavigate } from "react-router-dom";
import { Play, Book, X } from "lucide-react"; // Import Lucide icons

export default function HomePage() {
  const navigate = useNavigate();

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
        <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl font-extrabold mb-4 sm:mb-6 text-yellow-400 drop-shadow-xl animate-fadeIn">
          ♠ The Pseudo Solitaire
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-12 max-w-2xl text-white drop-shadow-md animate-fadeIn delay-200">
          Welcome to Anas's Klondike Solitaire! Play the classic card game with
          a modern twist: draw three cards at a time, undo moves, and track your
          score & time.
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 w-full max-w-xs md:max-w-none md:w-auto">
          {/* Start Game */}
          <button
            onClick={() => navigate("/game")}
            className="
              bg-linear-to-r from-blue-500 to-blue-700
              hover:scale-105 transform transition duration-300
              px-8 sm:px-12 py-3 sm:py-4 rounded-3xl text-white text-xl sm:text-2xl font-semibold
              shadow-xl hover:shadow-2xl flex items-center justify-center gap-3
            "
          >
            <Play size={24} /> Start Game
          </button>

          {/* How to Play */}
          <button
            onClick={() => navigate("/rules")}
            className="
              bg-linear-to-r from-green-500 to-green-700
              hover:scale-105 transform transition duration-300
              px-8 sm:px-12 py-3 sm:py-4 rounded-3xl text-white text-xl sm:text-2xl font-semibold
              shadow-xl hover:shadow-2xl flex items-center justify-center gap-3
            "
          >
            <Book size={24} /> How to Play
          </button>

          {/* Exit */}
          <button
            onClick={() => navigate("/leave")}
            className="
              bg-linear-to-r from-red-500 to-red-700
              hover:scale-105 transform transition duration-300
              px-8 sm:px-12 py-3 sm:py-4 rounded-3xl text-white text-xl sm:text-2xl font-semibold
              shadow-xl hover:shadow-2xl flex items-center justify-center gap-3
            "
          >
            <X size={24} /> Exit
          </button>
        </div>

        {/* Floating Cards Animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="animate-float absolute top-20 left-1/4 w-16 h-24 bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d3/Playing_card_spade_A.svg')] bg-contain bg-no-repeat opacity-50"></div>
          <div className="animate-float-slow absolute top-40 right-1/3 w-16 h-24 bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d3/Playing_card_spade_A.svg')] bg-contain bg-no-repeat opacity-50"></div>
          <div className="animate-float absolute bottom-24 left-1/2 w-16 h-24 bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d3/Playing_card_spade_A.svg')] bg-contain bg-no-repeat opacity-50"></div>
        </div>
      </div>
    </div>
  );
}
