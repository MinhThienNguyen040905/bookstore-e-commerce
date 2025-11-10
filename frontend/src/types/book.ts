import type { Genre } from "./Genre";
import type { Review } from "./Review";

// src/types/book.ts
export interface Book {
    id: number;
    title: string;
    description: string;
    price: number;
    stock: number;
    cover: string;
    releaseDate: string;
    isbn: string;
    publisher: string;
    author: string;
    genres: Genre[];
    avg_rating: number;
    reviews: Review[];
}

export interface CardBook {
    id: number;
    title: string;
    author: string;
    price: number;
    cover: string;
}