import { ThumbsUp } from "lucide-react"
import { Comment } from "../../../entities/comment"
import { Button } from "../../../shared/ui"
import { useLikeCommentMutation } from "../api"

export const LikeCommentButton = ({ comment }: { comment: Comment }) => {
  const { mutate: likeComment } = useLikeCommentMutation(comment.postId)

  const handleLikeComment = () => {
    likeComment({ id: comment.id, body: { likes: comment.likes + 1 } })
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLikeComment}>
      <ThumbsUp className="w-3 h-3" />
      <span className="ml-1 text-xs">{comment.likes}</span>
    </Button>
  )
}
