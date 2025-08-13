import { useMutation } from "@tanstack/react-query"
import { UpdateCommentRequestBody, updateComment } from "../services"

export const useUpdateCommentsMutation = () => {
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateCommentRequestBody }) => updateComment(id, body),
  })
}
