import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CommentsResponse } from "../../../../entities/comment"
import { commentQueryKeys } from "../../../../entities/comment"
import { createComment, CreateCommentRequestBody } from "../services"

export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCommentRequestBody) => createComment(data),
    onSuccess: (response) => {
      const prevData = queryClient.getQueryData<CommentsResponse>(commentQueryKeys.list(response.postId).queryKey)

      queryClient.setQueryData(commentQueryKeys.list(response?.postId).queryKey, {
        comments: (prevData?.comments ?? []).concat([
          {
            ...response,
          },
        ]),
      })
    },
    onError: (error) => {
      console.error("댓글 생성 실패", error)
    },
  })
}
