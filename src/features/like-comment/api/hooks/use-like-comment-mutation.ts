import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CommentsResponse } from "../../../../entities/comment"
import { commentQueryKeys } from "../../../../entities/comment"
import { likeComment, LikeCommentRequestBody } from "../services"

export const useLikeCommentMutation = (postId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: LikeCommentRequestBody }) => likeComment(id, body),
    onMutate: (request) => {
      const prevData = queryClient.getQueryData<CommentsResponse>(commentQueryKeys.list(postId).queryKey)

      if (prevData) {
        queryClient.setQueryData(commentQueryKeys.list(postId).queryKey, {
          comments: prevData.comments.map((comment) =>
            comment.id === request.id ? { ...comment, likes: comment.likes + 1 } : comment,
          ),
        })
      }
    },
  })
}
