import { z } from "zod";

export const UpdateProfileRequest = z.object({
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    phone: z.string().min(7).max(20).optional(),
    avatarUrl: z.string().url().optional(),
    company: z.string().min(1).max(100).optional(),
    bio: z.string().min(1).max(500).optional(),
});