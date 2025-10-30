// src/features/cart/useCartStore.ts
import { create } from 'zustand';
import type { Book } from '../types/book';

interface CartItem extends Book {
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    addToCart: (book: Book) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],
    addToCart: (book) => {
        set((state) => {
            const existing = state.items.find((i) => i.id === book.id);
            if (existing) {
                return {
                    items: state.items.map((i) =>
                        i.id === book.id ? { ...i, quantity: i.quantity + 1 } : i
                    ),
                };
            }
            return { items: [...state.items, { ...book, quantity: 1 }] };
        });
    },
    removeFromCart: (id) =>
        set((state) => ({
            items: state.items.filter((i) => i.id !== id),
        })),
    clearCart: () => set({ items: [] }),
    getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    getTotalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));