import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postQueryKeys } from "../../../../entities/post"
import { updatePost, UpdatePostRequest } from "../services"
import { Post } from "../../../../entities/post"

// 게시물 수정 Mutation
export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePostRequest }) => updatePost(id, data),
    onSuccess: (_, request) => {
      const prevData = queryClient.getQueryData<Post>(postQueryKeys.detail(request.id))
      if (prevData) {
        queryClient.setQueryData(postQueryKeys.detail(request.id), {
          ...prevData,
          ...request.data,
        })
      }
    },
    onError: (error) => {
      console.error("게시글 수정 실패", error)
    },
  })
}
