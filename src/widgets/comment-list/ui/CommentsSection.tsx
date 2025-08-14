import { Edit2, Plus, ThumbsUp, Trash2 } from "lucide-react"
import { Button } from "../../../shared/ui"
import { Comment } from "../../../entities/comment"
import { useGetComments } from "../../../entities/comment/api/hooks/use-get-comments"
import { usePostListFilterSearchParams } from "../../post-dashboard/model/hooks/use-post-list-filter-search-params"
import { highlightText } from "../../../shared/lib/highlight-text"
import { AddCommentDialog } from "../../../features/add-comment/ui/AddCommentDialog"
import { useState } from "react"

export const CommentsSection = ({ postId }: { postId: number }) => {
  const [isAddCommentDialogOpen, setIsAddCommentDialogOpen] = useState(false)

  const { data: comments } = useGetComments(postId)

  const { postListFilterSearchParams } = usePostListFilterSearchParams()
  const searchQuery = postListFilterSearchParams.q || ""

  const handleAddComment = () => {
    setIsAddCommentDialogOpen(true)
  }

  const handleLikeComment = (commentId: number) => {
    console.log("like comment", commentId)
  }

  const handleEditComment = (comment: Comment) => {
    console.log("edit comment", comment)
  }

  const handleDeleteComment = (commentId: number) => {
    console.log("delete comment", commentId)
  }

  return (
    <>
      <div className="mt-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">댓글</h3>
          <Button size="sm" onClick={handleAddComment}>
            <Plus className="w-3 h-3 mr-1" />
            댓글 추가
          </Button>
        </div>
        <div className="space-y-1">
          {comments?.comments.map((comment) => (
            <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
              <div className="flex items-center space-x-2 overflow-hidden">
                <span className="font-medium truncate">{comment.user.username}:</span>
                <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" onClick={() => handleLikeComment(comment.id)}>
                  <ThumbsUp className="w-3 h-3" />
                  <span className="ml-1 text-xs">{comment.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleEditComment(comment)}>
                  <Edit2 className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteComment(comment.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AddCommentDialog isOpen={isAddCommentDialogOpen} setIsOpen={setIsAddCommentDialogOpen} postId={postId} />
    </>
  )
}
