import {z} from "zod";

export const LoginRequest = z.object({
    email: z.email().min(4).max(255),
    password: z.string().min(8).max(128),
});

