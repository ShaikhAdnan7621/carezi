import { z } from 'zod';

export const textPostSchema = z.object({
  content: z.string()
    .min(1, 'Content is required')
    .max(5000, 'Content must be less than 5000 characters')
});

export const imagePostSchema = z.object({
  imageUrl: z.string().min(1, 'Image URL is required'),
  caption: z.string().max(1000, 'Caption must be less than 1000 characters').optional()
});

export const questionPostSchema = z.object({
  question: z.string()
    .min(1, 'Question is required')
    .max(5000, 'Question must be less than 5000 characters')
});

export const articlePostSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  content: z.string()
    .min(1, 'Content is required')
    .max(50000, 'Content must be less than 50000 characters')
});
