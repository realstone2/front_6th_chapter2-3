import { useQuery } from "@tanstack/react-query"
import { GetPostQuery } from "../../model/types"
import { postQueryKeys } from "../query-keys"
import { getPosts, getPostsByTag, searchPosts } from "../services"

// 게시물 목록 조회
export const useGetPosts = (query: GetPostQuery) => {
  return useQuery({
    queryKey: postQueryKeys.list(query),
    queryFn: () => {
      if (query.tag) {
        return getPostsByTag(query.tag)
      }
      if (query.q) {
        return searchPosts(query)
      }
      return getPosts(query)
    },
  })
}
