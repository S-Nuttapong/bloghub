import { Moment } from "moment";

export type Period = "today" | "this week" | "this month";

export interface Post {
  id: number;
  title: string;
  markdown: string;
  html: string;
  authorId: number;
  authorName?: string;
  created: Moment;
}

export interface User {
  id: number;
  username: string;
  password: string;
}

export interface Author {
  id: number;
  username: string;
}

export interface Tag {
  tag: string;
}
