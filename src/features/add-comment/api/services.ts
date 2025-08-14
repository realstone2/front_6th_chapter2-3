import { Comment } from "../../../entities/comment"
import { axiosInstance } from "../../../shared/lib/axios-instance"

export type CreateCommentRequestBody = {
  body: string
  postId: number
  userId: number
}

export const createComment = (body: CreateCommentRequestBody) => {
  return axiosInstance.post<Comment>(`/comments/add`, body)
}
