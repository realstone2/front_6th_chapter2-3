export interface Comment {
  id: number
  body: string
  postId: number
  userId: number
  likes: number
  user: {
    username: string
  }
}

export interface CommentsResponse {
  comments: Comment[]
}

