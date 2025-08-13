import { useMutation } from "@tanstack/react-query"
import { CreateCommentRequestBody } from "../services"
import { createComment } from "../services"

export const usePostCommentsMutation = () => {
  return useMutation({
    mutationFn: (body: CreateCommentRequestBody) => createComment(body),
  })
}
