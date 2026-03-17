import { create } from 'zustand';
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

// @ts-ignore
const storage = new MMKV({ id: 'fideli-storage' });

const zustandStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => storage.delete(name),
};

export type LoyaltyCard = {
  id: string;
  brandName: string;
  website: string;
  barcodeType: string;
  barcodeValue: string;
  brandPrimaryColorHex: string;
  dateAdded: string; // ISO string
  code: string;
  notes: string;
};

interface CardStore {
  cards: LoyaltyCard[];
  addCard: (card: Omit<LoyaltyCard, 'id' | 'dateAdded'>) => void;
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
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
