import create from "zustand";

interface ScoreState {
  score: number;
  increaseScore: (amount: number) => void;
  decreaseScore: (amount: number) => void;
  resetScore: () => void;
}

const useScoreStore = create<ScoreState>((set) => ({
  score: 200, // Initial score set to 0
  increaseScore: (amount: number) =>
    set((state) => ({ score: state.score + amount })),
  decreaseScore: (amount: number) =>
    set((state) => ({ score: state.score - amount })),
  resetScore: () => set({ score: 0 }),
}));

export default useScoreStore;
