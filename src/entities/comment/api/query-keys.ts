import { queryOptions } from "@tanstack/react-query"
import { getComments } from "./services"

// Query Keys
export const commentQueryKeys = {
  all: ["comments"] as const,
  lists: () => [...commentQueryKeys.all, "list"] as const,
  list: (postId: number) =>
    queryOptions({
      queryKey: [...commentQueryKeys.lists(), postId],
      queryFn: () => getComments(postId),
    }),
}
