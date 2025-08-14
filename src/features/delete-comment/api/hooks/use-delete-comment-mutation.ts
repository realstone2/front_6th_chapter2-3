import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CommentsResponse } from "../../../../entities/comment"
import { commentQueryKeys } from "../../../../entities/comment"
import { deleteComment } from "../services"

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, postId }: { id: number; postId: number }) => deleteComment(id),
    onSuccess: (_, { postId, id }) => {
      const prevData = queryClient.getQueryData<CommentsResponse>(commentQueryKeys.list(postId).queryKey)

      if (prevData) {
        queryClient.setQueryData(commentQueryKeys.list(postId).queryKey, {
          comments: prevData.comments.filter((comment) => comment.id !== id),
        })
      }
    },
    onError: (error) => {
      console.error("댓글 삭제 실패", error)
    },
  })
}
