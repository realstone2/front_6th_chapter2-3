import { axiosInstance } from "../../../shared/lib/axios-instance"
import {
  GetPostQuery,
  PostsResponse,
  Post,
  SearchPostQuery,
  CreatePostRequest,
  UpdatePostRequest,
} from "../model/types"

// 게시물 조회
export const getPosts = (query: GetPostQuery) => {
  return axiosInstance.get<PostsResponse>(`/posts`, { params: query })
}

// 게시물 검색
export const searchPosts = (query: SearchPostQuery) => {
  return axiosInstance.get<PostsResponse>(`/posts/search`, { params: query })
}

// 태그별 게시물 조회
export const getPostsByTag = (tag: string) => {
  return axiosInstance.get<PostsResponse>(`/posts/tag/${tag}`)
}
