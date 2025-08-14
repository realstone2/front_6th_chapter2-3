import { GetPostQuery } from "../model/types"

// Query Keys
export const postQueryKeys = {
  all: ["posts"] as const,
  lists: () => [...postQueryKeys.all, "list"] as const,
  list: (query: GetPostQuery) => [...postQueryKeys.lists(), query],
  details: () => [...postQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...postQueryKeys.details(), id] as const,
}
