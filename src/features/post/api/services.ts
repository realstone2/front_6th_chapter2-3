import { axiosInstance } from "../../../shared/lib/axios-instance"

// 게시물 삭제
export const deletePost = (id: number) => {
  return axiosInstance.delete(`/posts/${id}`)
}
