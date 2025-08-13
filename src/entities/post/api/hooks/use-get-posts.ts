import { useQuery } from "@tanstack/react-query"
import { GetPostQuery } from "../../model/types"
import { postQueryKeys } from "../query-keys"

// 게시물 목록 조회
export const useGetPosts = (query: GetPostQuery) => {
  return useQuery(postQueryKeys.list(query))
}
