import { useMutation } from "@tanstack/react-query"
import { deleteComment } from "../services"

export const useDeleteCommentsMutation = () => {
  return useMutation({
    mutationFn: (id: number) => deleteComment(id),
  })
}
