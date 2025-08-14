import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CommentsResponse } from "../../../../entities/comment"
import { commentQueryKeys } from "../../../../entities/comment/api/query-keys"
import { likeComment, LikeCommentRequestBody } from "../services"

export const useLikeCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: LikeCommentRequestBody }) => likeComment(id, body),
    onSuccess: (response) => {
      const prevData = queryClient.getQueryData<CommentsResponse>(commentQueryKeys.list(response.postId).queryKey)

      if (prevData) {
        queryClient.setQueryData(commentQueryKeys.list(response.postId).queryKey, {
          comments: prevData.comments.map((comment) =>
            comment.id === response.id ? { ...comment, likes: comment.likes + 1 } : comment,
          ),
        })
      }
    },
  })
}
