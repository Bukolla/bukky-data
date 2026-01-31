
import React, { useState, useEffect, useMemo } from 'react';
import { GameState, Topic, Question, SessionResult } from './types';
import { TOPICS } from './constants';
import { Header } from './components/Header';
import { TopicCard } from './components/TopicCard';
import { QuizView } from './components/QuizView';
import { DashboardView } from './components/DashboardView'; // New Import
import { generateQuestionBatch } from './geminiService';
import { archiveManager } from './archiveManager';
import { getMockQuestions } from './src/data/mockQuestions.ts';
import { resultsManager } from './src/managers/resultsManager'; // New Import
import { historyManager } from './src/managers/historyManager'; // New Import
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BrainCircuit, Rocket, Trophy, Play, RefreshCw, Loader2, Sparkles, Database, Download, LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SessionResult[]>([]);
  const [archiveStats, setArchiveStats] = useState<Record<string, number>>({});
  const [syncProgress, setSyncProgress] = useState<{ current: number, total: number, module: string } | null>(null);

  // Initial Seeding & Results Load
  useEffect(() => {
    const seedData = () => {
      let updated = false;
      TOPICS.forEach(topic => {
        const existing = archiveManager.getArchive(topic.id);
        if (existing.length < 100) {
          const mocks = getMockQuestions(topic.id, topic.title);
          archiveManager.saveQuestions(topic.id, mocks);
          updated = true;
        }
      });
      if (updated || Object.keys(archiveStats).length === 0) {
        setArchiveStats(archiveManager.getStats());
      }
    };

    seedData();
    // Load persisted results
    setResults(resultsManager.getResults());

    // One-time Migration/Cleanup for new text-based tracking
    const isMigrated = localStorage.getItem('ai_mastery_migrated_v1');
    if (!isMigrated) {
      historyManager.resetHistory(); // Clear old ID-based history
      // Clear archives to remove potential internal duplicates from gen- IDs
      TOPICS.forEach(t => archiveManager.clearArchive(t.id));
      localStorage.setItem('ai_mastery_migrated_v1', 'true');
    }
  }, []);

  useEffect(() => {
    setArchiveStats(archiveManager.getStats());
  }, [gameState]);

  const totalScore = useMemo(() => {
    return results.reduce((sum: number, r: SessionResult) => sum + r.score * 5, 0);
  }, [results]);

  const handleStartGame = () => {
    setGameState(GameState.TOPIC_SELECT);
  };

  const handleStartMixedGame = () => {
    const allQuestions = archiveManager.getAllQuestions();
    if (allQuestions.length === 0) {
      handleSyncAll();
      return;
    }

    const seenTexts = new Set(historyManager.getSeenTexts());
    let filtered = allQuestions.filter(q => !seenTexts.has(q.text.trim().toLowerCase()));

    // If we don't have enough unseen questions, reset history for this pool
    if (filtered.length < 10) { // Reduced threshold slightly
      historyManager.resetHistory();
      filtered = allQuestions;
    }

    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 20);
    setQuestions(selected);
    setSelectedTopic({
      id: 'mixed_mode',
      title: 'Mixed Simulation',
      description: 'Randomized evaluation across all available modules.',
      time: 'Now',
      difficulty: 'Hard',
      color: 'bg-gradient-to-r from-blue-600 to-purple-600'
    });
    setGameState(GameState.QUIZ);
  };

  const handleSelectTopic = async (topic: Topic) => {
    const allQuestions = archiveManager.getArchive(topic.id);
    if (allQuestions.length > 0) {
      const seenTexts = new Set(historyManager.getSeenTexts());
      let filtered = allQuestions.filter(q => !seenTexts.has(q.text.trim().toLowerCase()));

      // If we don't have enough unseen questions for this topic, reset history 
      if (filtered.length < 5) {
        historyManager.resetHistory();
        filtered = allQuestions;
      }

      setSelectedTopic(topic);
      const shuffled = [...filtered].sort(() => 0.5 - Math.random());
      setQuestions(shuffled.slice(0, 10));
      setGameState(GameState.QUIZ);
    } else {
      setIsLoading(true);
      try {
        const batch = await generateQuestionBatch(topic.id, topic.title, topic.description, 10);
        if (batch.length > 0) {
          archiveManager.saveQuestions(topic.id, batch);
          setArchiveStats(archiveManager.getStats());
          setQuestions(batch);
          setSelectedTopic(topic);
          setGameState(GameState.QUIZ);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSyncAll = async () => {
    setIsLoading(true);
    const targetCount = 100;
    for (let i = 0; i < TOPICS.length; i++) {
      const topic = TOPICS[i];
      let currentArchive = archiveManager.getArchive(topic.id);
      if (currentArchive.length < targetCount) {
        setSyncProgress({ current: currentArchive.length, total: targetCount, module: topic.title });
        const mocks = getMockQuestions(topic.id, topic.title);
        archiveManager.saveQuestions(topic.id, mocks);
        setArchiveStats(archiveManager.getStats());
      }
    }
    setSyncProgress(null);
    setIsLoading(false);
  };

  const handleQuizComplete = (score: number) => {
    const newResult: SessionResult = {
      topicId: selectedTopic?.id || '',
      score,
      total: questions.length,
      timestamp: Date.now()
    };

    // Persist result
    resultsManager.saveResult(newResult);
    setResults(resultsManager.getResults());

    // Mark items as seen by text
    historyManager.markAsSeen(questions.map(q => q.text));

    setGameState(GameState.RESULTS);
  };

  const handleBackToTopics = () => {
    setGameState(GameState.TOPIC_SELECT);
    setSelectedTopic(null);
  };

  const chartData = useMemo(() => {
    return results.map(r => {
      const topic = TOPICS.find(t => t.id === r.topicId);
      return {
        name: topic?.title?.split(' ')[0] || 'Unknown',
        score: (r.score / r.total) * 100,
        color: topic?.color?.replace('bg-', '#') || '#3b82f6'
      };
    });
  }, [results]);

  return (
    <div className="min-h-screen pt-20 pb-12 bg-slate-950 text-slate-100">
      <Header
        totalScore={totalScore}
        onLogoClick={() => setGameState(GameState.START)}
      />

      <main className="container mx-auto px-4 max-w-7xl">
        {gameState === GameState.START && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
            <div className="relative mb-12">
              <div className="absolute -inset-4 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <BrainCircuit className="w-32 h-32 text-blue-500 animate-float relative z-10" />
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
              Elevate Your <br />AI Career Path
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Fast, offline-ready AI mastery. All modules are now pooled into a cross-discipline simulator to test your versatility.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleStartGame}
                className="group flex items-center gap-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 px-10 rounded-2xl text-xl transition-all transform hover:scale-105 shadow-2xl shadow-blue-600/30"
              >
                Initialize Mixed Simulator
                <Play className="w-6 h-6 fill-white group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={handleStartMixedGame}
                className="group flex items-center gap-3 bg-purple-600 hover:bg-purple-500 text-white font-bold py-5 px-10 rounded-2xl text-xl transition-all shadow-xl shadow-purple-600/20"
              >
                <Sparkles className="w-6 h-6 fill-white" />
                Mixed 20-Drill
              </button>
            </div>

            <div className="mt-8 flex gap-4 justify-center">
              <button
                onClick={() => setGameState(GameState.DASHBOARD)} // Temporary cast until types updated
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors border border-slate-800 hover:bg-slate-900 px-6 py-3 rounded-xl"
              >
                <LayoutDashboard className="w-5 h-5" /> View Analytics
              </button>
              <button
                onClick={handleSyncAll}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors border border-slate-800 hover:bg-slate-900 px-6 py-3 rounded-xl"
              >
                <RefreshCw className="w-5 h-5" /> Re-Seed Data
              </button>
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40">
              <div className="flex flex-col items-center gap-2"><Sparkles className="w-8 h-8" /><span>Cross-Topic Mix</span></div>
              <div className="flex flex-col items-center gap-2"><Database className="w-8 h-8" /><span>Local Archive</span></div>
              <div className="flex flex-col items-center gap-2"><Rocket className="w-8 h-8" /><span>Instant Load</span></div>
              <div className="flex flex-col items-center gap-2"><RefreshCw className="w-8 h-8" /><span>Unified Drills</span></div>
            </div>
          </div>
        )}

        {/* Handling DASHBOARD state manually for now */}
        {gameState === GameState.DASHBOARD && (
          <DashboardView
            results={results}
            onBack={() => setGameState(GameState.START)}
          />
        )}

        {gameState === GameState.TOPIC_SELECT && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Neural Assessment Core</h2>
                <p className="text-slate-400">Select any module to begin a mixed-discipline evaluation from the total archive.</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setGameState(GameState.DASHBOARD)}
                  className="bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl border border-slate-800 text-sm flex items-center gap-2 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-purple-400" />
                  Stats
                </button>
                <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-sm">
                  <span className="text-slate-500 mr-2">Global Scenarios:</span>
                  <span className="font-bold">
                    {Object.values(archiveStats).reduce((a: number, b: number) => a + b, 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {TOPICS.map((topic) => {
                const sessionResult = results.find(r => r.topicId === topic.id);
                return (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    onSelect={handleSelectTopic}
                    isCompleted={!!sessionResult}
                    score={sessionResult?.score}
                    archiveSize={archiveStats[topic.id] || 0}
                  />
                );
              })}
            </div>
          </div>
        )}

        {gameState === GameState.QUIZ && selectedTopic && (
          <QuizView
            topic={selectedTopic}
            questions={questions}
            onComplete={handleQuizComplete}
            onExit={handleBackToTopics}
          />
        )}

        {gameState === GameState.RESULTS && (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-2xl text-center">
              <div className="inline-flex items-center justify-center p-4 bg-green-500/20 rounded-full mb-6">
                <Trophy className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-4xl font-bold mb-2">Assessment Results</h2>
              <p className="text-slate-400 mb-10">Neural sync complete. You performed a randomized cross-topic drill.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
                  <div className="text-3xl font-bold text-blue-400">
                    {results.find(r => r.topicId === selectedTopic?.id && r.timestamp === results[0]?.timestamp)?.score || 0} / {questions.length}
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest mt-2 font-bold">Session Accuracy</div>
                </div>
                <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
                  <div className="text-3xl font-bold text-orange-400">+{((results.find(r => r.topicId === selectedTopic?.id)?.score || 0) * 10)}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest mt-2 font-bold">PTS Gained</div>
                </div>
                <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:bg-slate-800 cursor-pointer transition-colors" onClick={() => setGameState(GameState.DASHBOARD)}>
                  <div className="flex flex-col items-center justify-center h-full">
                    <LayoutDashboard className="w-8 h-8 text-purple-400 mb-2" />
                    <span className="text-sm font-bold text-purple-300">View Dashboard</span>
                  </div>
                </div>
              </div>

              {chartData.length > 0 && (
                <div className="h-64 mb-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={40}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => selectedTopic && handleSelectTopic(selectedTopic)}
                  className="group flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-4 px-12 rounded-2xl transition-all border border-slate-700"
                >
                  <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  New Mixed Drill
                </button>
                <button
                  onClick={handleBackToTopics}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-12 rounded-2xl transition-all shadow-xl shadow-blue-600/20"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[100] flex flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-8">
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
              <div className="absolute inset-0 blur-xl bg-blue-500 opacity-30 animate-pulse"></div>
            </div>
            <h3 className="text-2xl font-bold mb-2">
              {syncProgress ? `Restoring Knowledge Base: ${syncProgress.module}` : 'Loading Simulation'}
            </h3>
            <p className="text-slate-400 max-w-md mx-auto">
              {syncProgress
                ? `Populating offline archive (${syncProgress.current}/${syncProgress.total})...`
                : `Preparing neural environment...`}
            </p>
            {syncProgress && (
              <div className="w-64 bg-slate-800 h-2 rounded-full mt-6 overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${(syncProgress.current / syncProgress.total) * 100}%` }}
                />
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-slate-900 pt-12 text-center text-slate-600 text-sm">
        <p>&copy; 2024 AI Mastery CBT. Unified cross-discipline evaluation for high-performance engineers.</p>
      </footer>
    </div>
  );
};

export default App;
