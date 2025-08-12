import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deletePost } from "../services"
import { postQueryKeys } from "../query-keys"

// 게시물 삭제 Mutation
export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: postQueryKeys.all })
    },
  })
}
