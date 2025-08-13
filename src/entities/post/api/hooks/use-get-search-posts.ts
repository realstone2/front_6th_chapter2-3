import { useQuery } from "@tanstack/react-query"
import { SearchPostQuery } from "../../model/types"
import { postQueryKeys } from "../query-keys"

// 게시물 검색
export const useGetSearchPosts = (query: SearchPostQuery) => {
  return useQuery(postQueryKeys.search(query))
}
