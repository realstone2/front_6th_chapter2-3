import { z } from "zod"
import { transformToNumber } from "../../../shared/lib/search-params-helpler"

export const postListQuerySchema = z.object({
  q: z.string().optional(),
  tag: z.string().optional(),
  limit: z.string().transform(transformToNumber).optional(),
  skip: z.string().transform(transformToNumber).optional(),
  sortBy: z.enum(["none", "id", "title", "reactions"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
})
