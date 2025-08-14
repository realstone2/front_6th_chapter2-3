import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CommentsResponse } from "../../../../entities/comment"
import { commentQueryKeys } from "../../../../entities/comment"
import { updateComment, UpdateCommentRequestBody } from "../services"

export const useUpdateCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCommentRequestBody }) => updateComment(id, data),
    onSuccess: (response) => {
      const prevData = queryClient.getQueryData<CommentsResponse>(commentQueryKeys.list(response.postId).queryKey)

      if (prevData) {
        queryClient.setQueryData(commentQueryKeys.list(response.postId).queryKey, {
          comments: prevData.comments.map((comment) =>
            comment.id === response.id
              ? {
                  ...response,
                  likes: comment.likes,
                }
              : comment,
          ),
        })
      }
    },
    onError: (error) => {
      console.error("댓글 수정 실패", error)
    },
  })
}
