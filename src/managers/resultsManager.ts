import { SessionResult, Topic } from '../../types';
import { TOPICS } from '../../constants';

const STORAGE_KEY = 'ai_mastery_results';

export const resultsManager = {
  getResults(): SessionResult[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveResult(result: SessionResult) {
    const results = this.getResults();
    // Prevent exact duplicates (simple check by timestamp/topic)
    const exists = results.some(r => r.timestamp === result.timestamp && r.topicId === result.topicId);
    if (!exists) {
        // Limit history to 500 entries to prevent overflow
        const newResults = [result, ...results].slice(0, 500); 
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newResults));
    }
  },

  getStats() {
    const results = this.getResults();
    const totalQuizzes = results.length;
    
    if (totalQuizzes === 0) {
      return { totalQuizzes: 0, avgScore: 0, bestTopic: 'N/A', mastery: 0 };
    }

    const totalScorePct = results.reduce((acc, r) => acc + (r.score / r.total) * 100, 0);
    const avgScore = totalScorePct / totalQuizzes;

    // Calculate best topic
    const topicScores: Record<string, { total: number, count: number }> = {};
    results.forEach(r => {
      if (!topicScores[r.topicId]) topicScores[r.topicId] = { total: 0, count: 0 };
      topicScores[r.topicId].total += (r.score / r.total) * 100;
      topicScores[r.topicId].count += 1;
    });

    let bestTopicId = '';
    let highestAvg = -1;

    Object.entries(topicScores).forEach(([id, data]) => {
      const avg = data.total / data.count;
      if (avg > highestAvg) {
        highestAvg = avg;
        bestTopicId = id;
      }
    });

    const bestTopic = TOPICS.find(t => t.id === bestTopicId)?.title || 'Mixed Mode';

    return {
      totalQuizzes,
      avgScore: Math.round(avgScore),
      bestTopic,
      mastery: Math.min(100, Math.round(totalQuizzes * 2 + avgScore * 0.5)) // Arbitrary "Mastery" algo
    };
  }
};
