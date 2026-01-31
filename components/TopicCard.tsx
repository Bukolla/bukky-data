
import React from 'react';
import { Topic } from '../types';
import { Clock, ChevronRight, BarChart3, Info, Database } from 'lucide-react';

interface TopicCardProps {
  topic: Topic;
  onSelect: (topic: Topic) => void;
  isCompleted: boolean;
  score?: number;
  archiveSize: number;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, onSelect, isCompleted, score, archiveSize }) => {
  const difficultyColors = {
    Easy: 'text-green-400',
    Medium: 'text-yellow-400',
    Hard: 'text-red-400',
  };

  const isLow = archiveSize < 10;

  return (
    <div className="group relative">
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200 pointer-events-none z-50 text-xs leading-relaxed">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800">
          <Clock className="w-3 h-3 text-blue-400" />
          <span className="font-bold text-slate-200">{topic.time} Session</span>
        </div>
        <p className="text-slate-300">
          <span className="text-blue-400 font-semibold">Full Context:</span> {topic.description}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-slate-500 italic">Difficulty: {topic.difficulty}</span>
          <span className={`font-bold ${isLow ? 'text-orange-400' : 'text-emerald-400'}`}>
            {archiveSize} Scenarios
          </span>
        </div>
        {/* Tooltip Arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-r border-b border-slate-700 rotate-45 -mt-1.5"></div>
      </div>

      <button
        onClick={() => onSelect(topic)}
        className="relative flex flex-col items-start p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 group-hover:border-blue-500 transition-all duration-300 rounded-2xl text-left overflow-hidden h-full w-full"
      >
        <div className={`absolute top-0 right-0 w-32 h-32 ${topic.color} opacity-5 -mr-16 -mt-16 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
        
        <div className="flex justify-between items-start w-full mb-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/50 rounded-full border border-slate-700 text-xs font-medium text-slate-400">
            <Clock className="w-3 h-3" />
            {topic.time}
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-900 rounded-md border border-slate-800">
            <Database className={`w-3 h-3 ${isLow ? 'text-orange-500' : 'text-emerald-500'}`} />
            <span className="text-[10px] font-bold text-slate-300">{archiveSize}</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors mb-2 flex items-center gap-2">
          {topic.title}
          <Info className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </h3>
        <p className="text-sm text-slate-400 line-clamp-2 mb-6">
          {topic.description}
        </p>

        <div className="mt-auto flex items-center justify-between w-full">
          {isCompleted ? (
            <div className="flex items-center gap-2 text-green-400 text-sm font-bold">
              <BarChart3 className="w-4 h-4" />
              Score: {score}/10
            </div>
          ) : (
            <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-300 flex items-center gap-1">
              Start Evaluation <ChevronRight className="w-3 h-3" />
            </span>
          )}
        </div>
      </button>
    </div>
  );
};
