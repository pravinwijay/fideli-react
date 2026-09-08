import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { LoyaltyCard, NewLoyaltyCard } from '@/types/card';

export type { LoyaltyCard, NewLoyaltyCard };

interface CardStore {
  cards: LoyaltyCard[];
  addCard: (card: NewLoyaltyCard) => void;
  updateCard: (id: string, card: Partial<LoyaltyCard>) => void;
  removeCard: (id: string) => void;
}

export const useCardStore = create<CardStore>()(
  persist(
    (set) => ({
      cards: [],
      addCard: (cardData) =>
        set((state) => ({
          cards: [
            ...state.cards,
            {
              ...cardData,
              id: uuidv4(),
              dateAdded: new Date().toISOString(),
            },
          ],
        })),
      updateCard: (id, cardUpdate) =>
        set((state) => ({
          cards: state.cards.map((c) => (c.id === id ? { ...c, ...cardUpdate } : c)),
        })),
      removeCard: (id) =>
        set((state) => ({
          cards: state.cards.filter((c) => c.id !== id),
        })),
    }),
    {
      name: 'fideli-cards',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
