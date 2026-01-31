
import React from 'react';
import { Brain, Trophy, Zap } from 'lucide-react';

interface HeaderProps {
  totalScore: number;
}

export const Header: React.FC<HeaderProps> = ({ totalScore }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent hidden sm:block">
          AI MASTERY CBT
        </h1>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-slate-800 px-4 py-1.5 rounded-full border border-slate-700">
          <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-semibold">Career Level: Junior Architect</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 px-4 py-1.5 rounded-full border border-slate-700">
          <Trophy className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-bold text-slate-200">{totalScore} PTS</span>
        </div>
      </div>
    </header>
  );
};
