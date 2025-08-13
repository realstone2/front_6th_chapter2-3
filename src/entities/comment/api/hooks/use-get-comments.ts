import { useQuery } from "@tanstack/react-query"
import { commentQueryKeys } from "../query-keys"

export const useGetComments = (postId: number) => {
  return useQuery(commentQueryKeys.list(postId))
}
