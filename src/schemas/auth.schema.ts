import {z} from "zod";

export const LoginRequest = z.object({
    email: z.email().min(4).max(255),
    password: z.string().min(8).max(128),
});

export const SignupRequest = z.object({
    email: z.email().min(4).max(255),
    password: z.string().min(8).max(128),
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    phone: z.string().min(5).max(20),
    company: z.string().min(1).max(200),
});

