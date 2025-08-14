// #### 댓글 CRUD

import { axiosInstance } from "../../../shared/lib/axios-instance"
import { Comment, CommentsResponse } from "../model/types"

export const getComments = (postId: number) => {
  return axiosInstance.get<CommentsResponse>(`/comments/post/${postId}`)
}
