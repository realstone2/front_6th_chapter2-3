import { queryOptions } from "@tanstack/react-query"
import { GetPostQuery } from "../model/types"
import { getPosts } from "./services"

export const postQueryKeys = {
  all: ["posts"] as const,
  lists: () => [...postQueryKeys.all, "list"] as const,
  list: (query: GetPostQuery) =>
    queryOptions({
      queryKey: postQueryKeys.lists(),
      queryFn: () => getPosts(query),
    }),
}
