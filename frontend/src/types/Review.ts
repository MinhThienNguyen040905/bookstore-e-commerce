import type { CommentUser } from "./User";

export interface Review {
    id: number;
    rating: number;
    comment: string;
    date: string;
    user: CommentUser
}