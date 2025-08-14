import { axiosInstance } from "../../../shared/lib/axios-instance"

export const deleteComment = (id: number) => {
  return axiosInstance.delete(`/comments/${id}`)
}
