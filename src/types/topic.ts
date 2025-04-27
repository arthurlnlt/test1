export interface Topic {
  id: number;
  name: string;
  description: string;
}

export const TOPICS: Topic[] = [
  { id: 1, name: 'Topic-1', description: 'Technology and Programming' },
  { id: 2, name: 'Topic-2', description: 'Science and Research' },
  { id: 3, name: 'Topic-3', description: 'Art and Design' },
  { id: 4, name: 'Topic-4', description: 'Music and Entertainment' },
  { id: 5, name: 'Topic-5', description: 'Health and Fitness' },
];