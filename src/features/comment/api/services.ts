// - `POST /api/comments/add` - 댓글 생성
// - `PUT /api/comments/${id}` - 댓글 수정
// - `DELETE /api/comments/${id}` - 댓글 삭제
// - `PATCH /api/comments/${id}` - 댓글 좋아요 (likes 업데이트)

import { axiosInstance } from "../../../shared/lib/axios-instance"

export type CreateCommentRequestBody = {
  body: string
  postId: number
  userId: number
}
export const createComment = (body: CreateCommentRequestBody) => {
  return axiosInstance.post(`/comments/add`, body)
}

export type UpdateCommentRequestBody = {
  body: string
}
export const updateComment = (id: number, body: UpdateCommentRequestBody) => {
  return axiosInstance.put(`/comments/${id}`, body)
}

export const deleteComment = (id: number) => {
  return axiosInstance.delete(`/comments/${id}`)
}

export type LikeCommentRequestBody = {
  likes: number
}
export const likeComment = (id: number, body: LikeCommentRequestBody) => {
  return axiosInstance.patch(`/comments/${id}`, body)
}
