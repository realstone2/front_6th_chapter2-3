// #### 댓글 CRUD

import { axiosInstance } from "../../../shared/lib/axios-instance"

export const getComments = (postId: number) => {
  return axiosInstance.get(`/comments/post/${postId}`)
}
