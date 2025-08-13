import { CreatePostRequest, Post, UpdatePostRequest } from "../../../entities/post"
import { axiosInstance } from "../../../shared/lib/axios-instance"

// 게시물 생성
export const createPost = (data: CreatePostRequest) => {
  return axiosInstance.post<Post>(`/posts/add`, data)
}

// 게시물 수정
export const updatePost = (id: number, data: UpdatePostRequest) => {
  return axiosInstance.put<Post>(`/posts/${id}`, data)
}

// 게시물 삭제
export const deletePost = (id: number) => {
  return axiosInstance.delete<void>(`/posts/${id}`)
}
