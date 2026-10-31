import React from "react";
import {
  RefreshCcw,
  LogOut,
  Clock,
  Activity,
  Star,
  Percent,
} from "lucide-react";

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
    <div className="bg-linear-to-b from-slate-950/80 via-navy-900/70 to-blue-950/70 text-white rounded-2xl p-6 shadow-2xl flex flex-col justify-between border border-teal-700/40 backdrop-blur-md w-64">
      {/* Stats Section */}
      <div className="flex flex-col gap-5">
        <h2 className="text-2xl font-cinzel text-center mb-2 tracking-wide text-yellow-400">
          YOUR STATS
        </h2>

        <div className="flex justify-between text-lg font-poppins">
          <span className="flex items-center gap-1">
            <Clock size={18} />
            Time:
          </span>
          <span>
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        </div>

        <div className="flex justify-between text-xl font-poppins">
          <span className="flex items-center gap-1">
            <Activity size={18} /> Moves:
          </span>
          <span>{moves}</span>
        </div>

        <div className="flex justify-between text-lg font-poppins">
          <span className="flex items-center gap-1">
            <Star size={18} />
            Score:
          </span>
          <span>{score}</span>
        </div>

        <div>
          <span className="flex items-center gap-1 mb-1 text-lg font-poppins">
            <Percent />
            Progress
          </span>
          <div className="w-full bg-blue-950 h-3 rounded-full overflow-hidden">
            <div
              className="bg-linear-to-r from-sky-400 via-blue-500 to-indigo-600 h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-right text-sm mt-1 block text-blue-300">
            {progress}%
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-col gap-3 mt-6">
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

// Reusable Sidebar Button Component
function SidebarButton({ icon, label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-semibold 
      bg-linear-to-r ${color} text-white shadow-md hover:shadow-lg 
      transition-all duration-200 hover:-translate-y-0.5 active:scale-95`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
