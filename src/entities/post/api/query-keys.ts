import { queryOptions } from "@tanstack/react-query"
import { GetPostQuery, SearchPostQuery } from "../model/types"
import { getPosts, getPostsByTag, searchPosts } from "./services"

// Query Keys
export const postQueryKeys = {
  all: ["posts"] as const,
  lists: () => [...postQueryKeys.all, "list"] as const,
  list: (query: GetPostQuery) =>
    queryOptions({
      queryKey: [...postQueryKeys.lists(), query],
      queryFn: () => getPosts(query),
    }),
  search: (query: SearchPostQuery) =>
    queryOptions({
      queryKey: [...postQueryKeys.all, "search", query],
      queryFn: () => searchPosts(query),
    }),
  byTag: (tag: string) =>
    queryOptions({
      queryKey: [...postQueryKeys.all, "tag", tag],
      queryFn: () => getPostsByTag(tag),
    }),
}
