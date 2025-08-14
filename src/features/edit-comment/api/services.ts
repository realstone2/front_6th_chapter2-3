import { axiosInstance } from "../../../shared/lib/axios-instance"
import { Comment } from "../../../entities/comment"

export type UpdateCommentRequestBody = {
  body: string
}

export const updateComment = (id: number, body: UpdateCommentRequestBody) => {
  return axiosInstance.put<Comment>(`/comments/${id}`, body)
}
