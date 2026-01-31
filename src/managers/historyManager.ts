
const STORAGE_KEY = 'ai_mastery_seen_texts';

export const historyManager = {
    getSeenTexts(): string[] {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    markAsSeen(texts: string[]) {
        const seen = new Set(this.getSeenTexts());
        texts.forEach(text => seen.add(text.trim().toLowerCase()));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(seen)));
    },

    resetHistory() {
        localStorage.removeItem(STORAGE_KEY);
    },

    isAllSeen(availableTexts: string[]): boolean {
        const seen = new Set(this.getSeenTexts());
        return availableTexts.every(text => seen.has(text.trim().toLowerCase()));
    }
};
