import { useMutation } from "@tanstack/react-query"
import { LikeCommentRequestBody } from "../services"
import { likeComment } from "../services"

export const useLikeCommentMutation = () => {
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: LikeCommentRequestBody }) => likeComment(id, body),
  })
}
