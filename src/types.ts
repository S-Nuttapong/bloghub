import { Moment } from "moment";
import { readonly } from "vue";

export type Period = "today" | "this week" | "this month";

export interface Post {
  id: number;
  title: string;
  markdown: string;
  html: string;
  authorId: number;
  authorName?: string;
  tags?: string[];
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
