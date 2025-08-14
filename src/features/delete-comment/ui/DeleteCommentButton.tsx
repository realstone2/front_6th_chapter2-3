import { Trash2 } from "lucide-react"
import { Button } from "../../../shared/ui"
import { useDeleteCommentMutation } from "../api/hooks/use-delete-comment-mutation"

interface DeleteCommentButtonProps {
  id: number
  postId: number
}

export const DeleteCommentButton = ({ id, postId }: DeleteCommentButtonProps) => {
  const { mutate: deleteComment } = useDeleteCommentMutation()

  const handleDelete = () => {
    deleteComment({ id, postId })
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete}>
      <Trash2 className="w-3 h-3" />
    </Button>
  )
}
