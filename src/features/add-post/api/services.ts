import { axiosInstance } from "../../../shared/lib/axios-instance"

export interface CreatePostRequest {
  title: string
  body: string
  userId: number
}

// 게시물 생성
export const createPost = (data: CreatePostRequest) => {
  return axiosInstance.post(`/posts/add`, data)
}
