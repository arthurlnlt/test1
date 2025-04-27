import { Topic } from './topic';

export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  author: string;
  createdAt: string;
  upvotes: number;
  comments: number;
  liked: boolean;
  topic: Topic;
}