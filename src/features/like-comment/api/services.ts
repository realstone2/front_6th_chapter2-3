import { axiosInstance } from "../../../shared/lib/axios-instance"
import { Comment } from "../../../entities/comment"

export type LikeCommentRequestBody = {
  likes: number
}

export const likeComment = (id: number, body: LikeCommentRequestBody) => {
  return axiosInstance.patch<Comment>(`/comments/${id}`, body)
}
