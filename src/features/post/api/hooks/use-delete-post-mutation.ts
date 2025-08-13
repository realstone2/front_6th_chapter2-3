import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postQueryKeys } from "../../../../entities/post/api/query-keys"
import { deletePost } from "../services"

// 게시물 삭제 Mutation
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: postQueryKeys.all })
    },
  })
}
