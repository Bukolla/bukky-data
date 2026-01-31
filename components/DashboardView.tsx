import React, { useMemo } from 'react';
import { SessionResult } from '../types';
import { resultsManager } from '../src/managers/resultsManager';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { Trophy, TrendingUp, Target, Activity, ArrowLeft } from 'lucide-react';
import { TOPICS } from '../constants';

interface DashboardViewProps {
  onBack: () => void;
  results: SessionResult[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onBack, results }) => {
  const stats = useMemo(() => resultsManager.getStats(), [results]);

  const topicPerformance = useMemo(() => {
    const data: Record<string, { total: number; count: number }> = {};
    results.forEach(r => {
      // Clean topic ID if it has suffixes or extra data
      const cleanId = r.topicId.split('-')[0];
      if (!data[cleanId]) data[cleanId] = { total: 0, count: 0 };
      data[cleanId].total += (r.score / r.total) * 100;
      data[cleanId].count += 1;
    });

    return Object.entries(data).map(([id, val]) => {
      const topic = TOPICS.find(t => t.id === id);
      return {
        subject: topic?.title.split(' ')[0] || id,
        A: Math.round(val.total / val.count),
        fullMark: 100
      };
    }).slice(0, 6); // Take top 6 for Radar
  }, [results]);

  const recentActivity = useMemo(() => {
    return [...results].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
  }, [results]);

  return (
    <div className="min-h-screen pt-20 pb-12 bg-slate-950 text-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="container mx-auto px-4 max-w-6xl">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Simulation
        </button>

        <h1 className="text-4xl font-bold mb-2">Neural Performance Analytics</h1>
        <p className="text-slate-400 mb-10">Real-time telemetry of your AI mastery progression.</p>

        {/* Key Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Total Drills</span>
            </div>
            <div className="text-4xl font-mono font-bold">{stats.totalQuizzes}</div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                <Target className="w-6 h-6" />
              </div>
              <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Avg. Accuracy</span>
            </div>
            <div className="text-4xl font-mono font-bold">{stats.avgScore}%</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                <Trophy className="w-6 h-6" />
              </div>
              <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Best Module</span>
            </div>
            <div className="text-xl font-bold truncate">{stats.bestTopic}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Mastery Score</span>
            </div>
            <div className="text-4xl font-mono font-bold">{stats.mastery}</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-lg min-h-[400px]">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" /> Skill Radar
            </h3>
            <div className="h-[300px] w-full">
              {topicPerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={topicPerformance}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#475569' }} />
                    <Radar name="Accuracy" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500">Not enough data for radar analysis</div>
              )}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-lg">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" /> Recent Drills
            </h3>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((r, i) => {
                   const topic = TOPICS.find(t => t.id === r.topicId);
                   const isMixed = r.topicId === 'mixed_mode';
                   const title = isMixed ? 'Mixed Simulation' : (topic?.title || 'Unknown Module');
                   const accuracy = Math.round((r.score / r.total) * 100);
                   
                   return (
                     <div key={i} className="flex justify-between items-center p-4 bg-slate-800/40 rounded-xl border border-slate-800 hover:bg-slate-800 transition-colors">
                       <div>
                         <div className="font-bold text-slate-200">{title}</div>
                         <div className="text-xs text-slate-500 mt-1">{new Date(r.timestamp).toLocaleDateString()} • {new Date(r.timestamp).toLocaleTimeString()}</div>
                       </div>
                       <div className="text-right">
                         <div className={`text-xl font-bold font-mono ${accuracy >= 80 ? 'text-emerald-400' : accuracy >= 50 ? 'text-blue-400' : 'text-red-400'}`}>
                           {accuracy}%
                         </div>
                         <div className="text-xs text-slate-500">{r.score}/{r.total} Correct</div>
                       </div>
                     </div>
                   );
                })
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 py-20">No recent activity detected</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
