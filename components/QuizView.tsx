
import React, { useState, useEffect } from 'react';
import { Question, Topic } from '../types';
import { CheckCircle2, XCircle, AlertCircle, ArrowRight, X, Sparkles } from 'lucide-react';

interface QuizViewProps {
  topic: Topic;
  questions: Question[];
  onComplete: (score: number) => void;
  onExit: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ topic, questions, onComplete, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const currentQuestion = questions[currentIndex];
  const isMixedMode = new Set(questions.map(q => q.topic)).size > 1;

  useEffect(() => {
    if (isAnswered || timeLeft === 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isAnswered]);

  useEffect(() => {
    if (timeLeft === 0 && !isAnswered) {
      handleAnswer(-1); // Timeout
    }
  }, [timeLeft]);

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(30);
    } else {
      onComplete(score);
    }
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="text-blue-400 font-bold uppercase tracking-widest text-[10px] bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                Sequence {currentIndex + 1} of {questions.length}
              </span>
              {isMixedMode && (
                <span className="flex items-center gap-1 text-emerald-400 font-bold uppercase tracking-widest text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <Sparkles className="w-2.5 h-2.5" />
                  Mixed Mastery Pool
                </span>
              )}
              <button 
                onClick={onExit}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-400 transition-colors uppercase tracking-wider group"
              >
                <X className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
                Abort CBT
              </button>
            </div>
            <h2 className="text-2xl font-bold mt-2 text-slate-100">
              {isMixedMode ? 'Unified Assessment' : topic.title}
            </h2>
            <div className="text-[10px] text-slate-500 font-mono mt-1 uppercase">
              Current Focus: {currentQuestion.topic}
            </div>
          </div>
          <div className={`text-2xl font-mono font-bold px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl shadow-inner ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`}>
            {timeLeft.toString().padStart(2, '0')}s
          </div>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden border border-slate-700/50">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-700 ease-out" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 -mr-32 -mt-32 rounded-full blur-3xl pointer-events-none" />
        
        <p className="text-xl leading-relaxed text-slate-100 mb-8 relative z-10">
          {(currentQuestion.text.split("]")[1] || currentQuestion.text).trim()}
        </p>

        {currentQuestion.codeSnippet && (
          <div className="mb-8 p-5 bg-slate-950 border border-slate-800 rounded-2xl overflow-x-auto shadow-inner relative z-10">
            <pre className="mono text-sm text-blue-300">
              <code>{currentQuestion.codeSnippet}</code>
            </pre>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 relative z-10">
          {currentQuestion.options.map((option, idx) => {
            let statusClass = "bg-slate-800/40 border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/80 hover:translate-x-1";
            if (isAnswered) {
              if (idx === currentQuestion.correctAnswer) {
                statusClass = "bg-green-500/20 border-green-500 text-green-100 translate-x-1";
              } else if (idx === selectedOption) {
                statusClass = "bg-red-500/20 border-red-500 text-red-100";
              } else {
                statusClass = "bg-slate-800/20 border-slate-800 opacity-40";
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleAnswer(idx)}
                className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300 text-left group ${statusClass}`}
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:text-blue-400 transition-colors">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="font-medium">{option}</span>
                </div>
                {isAnswered && idx === currentQuestion.correctAnswer && <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />}
                {isAnswered && idx === selectedOption && idx !== currentQuestion.correctAnswer && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
            <div className={`p-6 rounded-2xl flex gap-5 shadow-lg ${selectedOption === currentQuestion.correctAnswer ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
              <div className={`p-2 rounded-xl h-fit ${selectedOption === currentQuestion.correctAnswer ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                <AlertCircle className={`w-6 h-6 shrink-0 ${selectedOption === currentQuestion.correctAnswer ? 'text-green-400' : 'text-red-400'}`} />
              </div>
              <div>
                <h4 className={`font-bold mb-1.5 text-lg ${selectedOption === currentQuestion.correctAnswer ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedOption === currentQuestion.correctAnswer ? 'Verified Logic' : 'Neural Divergence'}
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed font-medium">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
            
            <div className="mt-10 flex justify-end">
              <button
                onClick={handleNext}
                className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-10 py-4 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-blue-600/30"
              >
                {currentIndex === questions.length - 1 ? 'Analyze Telemetry' : 'Sequence Next'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
