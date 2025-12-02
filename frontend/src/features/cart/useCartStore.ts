// src/features/cart/useCartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CardBook } from '@/types/book';

export interface CartItem extends CardBook {
    quantity: number;
    stock: number; // thêm để kiểm tra tồn kho
}

interface CartStore {
    items: CartItem[];
    setItems: (items: CartItem[]) => void;
    addToCart: (book: CardBook) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            setItems: (items) => set({ items }),

            addToCart: (book) =>
                set((state) => {
                    const existing = state.items.find((i) => i.id === book.id);
                    if (existing) {
                        return {
                            items: state.items.map((i) =>
                                i.id === book.id ? { ...i, quantity: i.quantity + 1 } : i
                            ),
                        };
                    }
                    return {
                        items: [...state.items, { ...book, quantity: 1, stock: book.stock || 999 }],
                    };
                }),

            updateQuantity: (id, quantity) =>
                set((state) => ({
                    items: state.items.map((i) =>
                        i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
                    ),
                })),

            removeFromCart: (id) =>
                set((state) => ({
                    items: state.items.filter((i) => i.id !== id),
                })),

            clearCart: () => set({ items: [] }),

            getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
            getTotalPrice: () =>
                get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        }),
        {
            name: 'cart-storage',
        }
    )
);