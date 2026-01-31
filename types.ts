
export enum GameState {
  START = 'START',
  TOPIC_SELECT = 'TOPIC_SELECT',
  QUIZ = 'QUIZ',
  RESULTS = 'RESULTS',
  ARCHIVING = 'ARCHIVING',
  DASHBOARD = 'DASHBOARD'
}

export interface Question {
  id: string;
  topic: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  codeSnippet?: string;
}

export interface Topic {
  time: string;
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  color: string;
}

export interface SessionResult {
  topicId: string;
  score: number;
  total: number;
  timestamp: number;
}

export interface TopicArchive {
  topicId: string;
  questions: Question[];
  lastUpdated: number;
}
