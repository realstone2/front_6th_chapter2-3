import { useQuery } from "@tanstack/react-query"
import { postQueryKeys } from "../query-keys"

// 태그별 게시물 조회
export const useGetPostsByTag = (tag: string) => {
  return useQuery(postQueryKeys.byTag(tag))
}
