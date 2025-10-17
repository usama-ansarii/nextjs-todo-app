import { z } from "zod";

export const signUpSchema = z.object({
  fullname: z
    .string()
    .trim()
    .min(1, "Please enter your full name") // 👈 ensures not empty
    .max(25, "Full name too long"),
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().trim().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email")
    .email("Please enter a valid email address"),
  password: z.string().trim().min(6, "Password must be at least 6 characters"),
});

export const todoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Todo title must be at least 3 characters")
    .max(50, "Title too long"),
  description: z
    .string()
    .trim()
    .trim()
    .min(6, "Todo description must be at least 6 characters"),
});
