import { axiosInstance } from "../../../shared/lib/axios-instance"

export interface UpdatePostRequest {
  title?: string
  body?: string
  userId?: number
}

// 게시물 수정
export const updatePost = (id: number, data: UpdatePostRequest) => {
  return axiosInstance.put(`/posts/${id}`, data)
}
