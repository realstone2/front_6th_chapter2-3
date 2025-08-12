import { useMutation, useQueryClient } from "@tanstack/react-query"
import { UpdatePostRequest } from "../../model/types"
import { updatePost } from "../services"
import { postQueryKeys } from "../query-keys"

// 게시물 수정 Mutation
export const useUpdatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePostRequest }) => updatePost(id, data),
    onSuccess: (updatedPost) => {
      queryClient.invalidateQueries({ queryKey: postQueryKeys.all })
    },
  })
}
