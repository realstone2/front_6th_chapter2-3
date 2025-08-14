import { useMutation, useQueryClient } from "@tanstack/react-query"
import { UpdatePostRequest, Post } from "../../../../entities/post/model/types"
import { updatePost } from "../services"
import { postQueryKeys } from "../../../../entities/post/api/query-keys"

// 게시물 수정 Mutation
export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePostRequest }) => updatePost(id, data),
    onSuccess: (updatedPost: Post) => {
      // 단건 캐시만 업데이트
      queryClient.setQueryData(postQueryKeys.detail(updatedPost.id), updatedPost)
      queryClient.invalidateQueries({
        queryKey: postQueryKeys.lists(),
      })
    },
  })
}
