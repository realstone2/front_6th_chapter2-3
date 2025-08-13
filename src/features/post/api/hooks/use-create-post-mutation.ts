import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postQueryKeys } from "../../../../entities/post/api/query-keys"
import { CreatePostRequest } from "../../../../entities/post/model/types"
import { createPost } from "../services"

// 게시물 생성 Mutation
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePostRequest) => createPost(data),
    onSuccess: () => {
      // 게시물 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: postQueryKeys.all })
    },
  })
}
