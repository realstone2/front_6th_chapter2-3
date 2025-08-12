import { User } from "../../user/model/types"

export interface GetPostQuery {
  limit: number
  skip: number
}
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
