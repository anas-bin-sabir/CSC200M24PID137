import React from "react";
import { Undo2, Redo2, Lightbulb } from "lucide-react";

export default function Header({ viewModel }) {
  const handleHint = () => {
    const hint = viewModel.provideHint();
    if (!hint) {
      alert("No possible moves!");
    } else {
      viewModel.highlightHint(hint);
    }
  };

  return (
    <header
      className="font-cinzel mx-auto mt-4 w-[90%] max-w-5xl bg-linear-to-r from-slate-900/70 via-navy-900/60 to-blue-950/60 
      text-amber-50 flex flex-row items-center justify-between gap-4 px-8 py-4 
      shadow-2xl border border-teal-700/30 backdrop-blur-md rounded-2xl"
    >
      <h1 className="text-3xl font-bold tracking-wide drop-shadow-lg text-yellow-400 select-none text-center">
        ♠ The Pseudo Solitaire
      </h1>

      <div className="flex gap-4 items-center justify-center">
        <HeaderButton
          icon={<Undo2 size={18} />}
          label="Undo"
          onClick={() => viewModel.undo()}
          color="from-slate-700/70 to-slate-600/70 hover:from-slate-700/80 hover:to-slate-800/80"
        />
        <HeaderButton
          icon={<Redo2 size={18} />}
          label="Redo"
          onClick={() => viewModel.redo()}
          color="from-slate-700/70 to-slate-600/70 hover:from-slate-700/80 hover:to-slate-800/80"
        />
        <HeaderButton
          icon={<Lightbulb size={18} />}
          label="Hint"
          onClick={handleHint}
          color="from-amber-500/70 to-yellow-400/70 hover:from-amber-400/80 hover:to-yellow-300/80"
        />
      </div>
    </header>
  );
}

function HeaderButton({ icon, label, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-poppins text-base font-semibold text-white 
      bg-linear-to-br ${color} shadow-lg shadow-black/30 backdrop-blur-sm
      hover:shadow-amber-500/30 hover:scale-105 transition-all duration-300`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
