import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CreatePostRequest, Post } from "../../../../entities/post/model/types"
import { createPost } from "../services"
import { postQueryKeys } from "../../../../entities/post/api/query-keys"

// 게시물 생성 Mutation
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePostRequest) => createPost(data),
    onSuccess: (newPost: Post) => {
      // 새 포스트를 단건 캐시에 저장
      queryClient.setQueryData(postQueryKeys.detail(newPost.id), newPost)

      // 리스트 캐시 무효화 (새 포스트가 추가되었으므로)
      queryClient.invalidateQueries({
        queryKey: postQueryKeys.lists(),
      })
    },
  })
}
