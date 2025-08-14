import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deletePost } from "../services"
import { postQueryKeys } from "../../../../entities/post/api/query-keys"

// 게시물 삭제 Mutation
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: (_, deletedId) => {
      // 단건 캐시에서 제거
      queryClient.removeQueries({
        queryKey: postQueryKeys.detail(deletedId),
      })

      // 리스트 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: postQueryKeys.lists(),
      })
    },
  })
}
