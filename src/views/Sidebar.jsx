import React from "react";
import {
  RefreshCcw,
  LogOut,
  Clock,
  Activity,
  Star,
  Percent,
} from "lucide-react";

// A column of stats beside the board on large screens,
// and a compact bar above it on phones and tablets.
export default function Sidebar({
  moves = 0,
  score = 0,
  progress = 0,
  time = 0, // seconds, counted by GameController
  onNewGame,
  onLeave,
}) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="bg-linear-to-b from-slate-950/80 via-navy-900/70 to-blue-950/70 text-white rounded-2xl p-3 sm:p-4 lg:p-6 shadow-2xl flex flex-col justify-between border border-teal-700/40 backdrop-blur-md w-full">
      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-2 lg:flex lg:flex-col lg:gap-5">
        <h2 className="hidden lg:block text-2xl font-cinzel text-center mb-2 tracking-wide text-yellow-400">
          YOUR STATS
        </h2>

        <Stat icon={<Clock size={18} />} label="Time">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </Stat>
        <Stat icon={<Activity size={18} />} label="Moves">
          {moves}
        </Stat>
        <Stat icon={<Star size={18} />} label="Score">
          {score}
        </Stat>

        <div className="col-span-3">
          <span className="flex items-center gap-1 mb-1 text-sm lg:text-lg font-poppins">
            <Percent size={18} />
            Progress
            <span className="ml-auto text-blue-300 lg:hidden">{progress}%</span>
          </span>
          <div className="w-full bg-blue-950 h-2 lg:h-3 rounded-full overflow-hidden">
            <div
              className="bg-linear-to-r from-sky-400 via-blue-500 to-indigo-600 h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="hidden lg:block text-right text-sm mt-1 text-blue-300">
            {progress}%
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-3 lg:flex lg:flex-col lg:gap-3 lg:mt-6">
        <SidebarButton
          icon={<RefreshCcw size={18} />}
          label="New Game"
          color="from-emerald-800 to-blue-800 hover:from-emerald-600 hover:to-blue-600"
          onClick={onNewGame}
        />
        <SidebarButton
          icon={<LogOut size={18} />}
          label="Leave"
          color="from-red-800 to-rose-700 hover:from-red-700 hover:to-rose-600"
          onClick={onLeave}
        />
      </div>
    </div>
  );
}

function Stat({ icon, label, children }) {
  return (
    <div className="flex flex-col items-center lg:flex-row lg:justify-between text-sm lg:text-lg font-poppins">
      <span className="flex items-center gap-1 text-blue-200 lg:text-white">
        {icon}
        {label}
        <span className="hidden lg:inline">:</span>
      </span>
      <span className="font-semibold lg:font-normal tabular-nums">{children}</span>
    </div>
  );
}

// Reusable Sidebar Button Component
function SidebarButton({ icon, label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 w-full px-2 sm:px-4 py-2 lg:py-3 rounded-xl text-sm sm:text-base font-semibold whitespace-nowrap 
      bg-linear-to-r ${color} text-white shadow-md hover:shadow-lg 
      transition-all duration-200 hover:-translate-y-0.5 active:scale-95`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
