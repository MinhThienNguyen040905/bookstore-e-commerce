// src/types/book.ts
export interface Book {
    id: number;
    title: string;
    author: string;
    price: number;
    cover: string;
    discount?: number;
    isFeatured?: boolean;
    category?: string;
}

export interface CardBook {
    id: number;
    title: string;
    author: string;
    price: number;
    cover: string;
}