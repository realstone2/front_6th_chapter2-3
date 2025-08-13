import { User } from "../../user/model/types"

// Query 타입들
export interface GetPostQuery {
  limit: number
  skip: number
  q: string
  tag: string
}

export interface SearchPostQuery {
  q: string
}

export interface CreatePostRequest {
  title: string
  body: string
  userId: number
}

export interface UpdatePostRequest {
  title?: string
  body?: string
  userId?: number
}

// Response 타입들
export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags?: string[]
  reactions?: {
    likes: number
    dislikes: number
  }
  author?: User
}

export interface PostsResponse {
  posts: Post[]
  total: number
}
