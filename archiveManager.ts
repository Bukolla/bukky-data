
import { Question, TopicArchive } from './types';

const STORAGE_PREFIX = 'ai_mastery_archive_';

export const archiveManager = {
  getArchive(topicId: string): Question[] {
    const data = localStorage.getItem(`${STORAGE_PREFIX}${topicId}`);
    if (!data) return [];
    try {
      const archive: TopicArchive = JSON.parse(data);
      return archive.questions;
    } catch (e) {
      return [];
    }
  },

  getAllQuestions(): Question[] {
    const all: Question[] = [];
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            const archive: TopicArchive = JSON.parse(data);
            all.push(...archive.questions);
          }
        } catch (e) {
          console.error("Error reading archive key:", key);
        }
      }
    });
    return all;
  },

  saveQuestions(topicId: string, newQuestions: Question[]) {
    const existing = this.getArchive(topicId);
    const seen = new Set(existing.map(q => q.text.trim().toLowerCase()));

    // Deduplicate within the new batch AND against existing
    const uniqueNew: Question[] = [];
    newQuestions.forEach(q => {
      const normalizedText = q.text.trim().toLowerCase();
      if (!seen.has(normalizedText)) {
        seen.add(normalizedText);
        uniqueNew.push(q);
      }
    });

    if (uniqueNew.length === 0) return;

    const archive: TopicArchive = {
      topicId,
      questions: [...existing, ...uniqueNew],
      lastUpdated: Date.now()
    };
    localStorage.setItem(`${STORAGE_PREFIX}${topicId}`, JSON.stringify(archive));
  },

  clearArchive(topicId: string) {
    localStorage.removeItem(`${STORAGE_PREFIX}${topicId}`);
  },

  getStats() {
    const stats: Record<string, number> = {};
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        const id = key.replace(STORAGE_PREFIX, '');
        const questions = this.getArchive(id);
        stats[id] = questions.length;
      }
    });
    return stats;
  }
};
