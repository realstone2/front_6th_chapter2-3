import { UpdatePostRequest } from "../../../entities/post"
import { axiosInstance } from "../../../shared/lib/axios-instance"

// 게시물 수정
export const updatePost = (id: number, data: UpdatePostRequest) => {
  return axiosInstance.put(`/posts/${id}`, data)
}

// 게시물 삭제
export const deletePost = (id: number) => {
  return axiosInstance.delete(`/posts/${id}`)
}
