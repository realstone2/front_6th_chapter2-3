import { User } from "../../user/model/types"

// Query 타입들
export interface GetPostQuery {
  limit?: number
  skip?: number
  q?: string
  tag?: string
  sortBy?: "none" | "id" | "title" | "reactions"
  order?: "asc" | "desc"
}

export interface SearchPostQuery {
  q?: string
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
