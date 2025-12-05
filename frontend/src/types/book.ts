import type { Genre } from "./Genre";
import type { Review } from "./Review";

// src/types/book.ts
export interface Book {
    book_id: number;
    title: string;
    description: string;
    price: number;
    stock: number;
    cover_image: string;
    release_date: string;
    isbn: string;
    publisher: string;
    authors: string;
    genres: Genre[];
    avg_rating: number;
    reviews: Review[];
}

export interface CardBook {
    book_id: number;
    title: string;
    authors: string;
    price: number;
    cover_image: string;
}