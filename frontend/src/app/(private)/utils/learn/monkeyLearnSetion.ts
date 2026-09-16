
interface SessionData {
  session: {
    id: string;
    textContent: {
      text: string;
      wordCount: number;
    };
    timeLimit: number;
    status: string;
  };
}

export const MOCK_SESSION_DATA: SessionData = {
  session: {
    id: "sess-123",
    textContent: {
      text: "The quick brown fox jumps over the lazy dog",
      wordCount: 9,
    },
    timeLimit: 60,
    status: "active",
  },
};