import { axiosInstance } from "../../../shared/lib/axios-instance"
import { GetPostQuery, PostsResponse } from "../model/types"

export const getPosts = (query: GetPostQuery) => {
  return axiosInstance.get<PostsResponse>(`/posts?limit=${query.limit}&skip=${query.skip}`)
}
