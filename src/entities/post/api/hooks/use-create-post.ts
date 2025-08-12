import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CreatePostRequest } from "../../model/types"
import { createPost } from "../services"
import { postQueryKeys } from "../query-keys"

// 게시물 생성 Mutation
export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePostRequest) => createPost(data),
    onSuccess: () => {
      // 게시물 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: postQueryKeys.all })
    },
  })
}
