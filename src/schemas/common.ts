import {z} from "zod";

export const OffsetPaginationSchema = z.object({
    query: z.string().min(2),
    limit: z.coerce.number().int().min(1).max(15).optional(),
})

