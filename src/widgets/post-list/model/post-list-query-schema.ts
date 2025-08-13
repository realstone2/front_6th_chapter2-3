import { z } from "zod"

export const postListQuerySchema = z.object({
  q: z.string().optional(),
  tag: z.string().optional(),
  limit: z.number().optional(),
  skip: z.number().optional(),
  sortBy: z.enum(["none", "id", "title", "reactions"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
})
