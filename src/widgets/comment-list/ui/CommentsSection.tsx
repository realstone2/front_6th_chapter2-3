import { Edit2, Plus, ThumbsUp, Trash2 } from "lucide-react"
import { Button } from "../../../shared/ui"
import { Comment } from "../../../entities/comment"
import { useGetComments } from "../../../entities/comment/api/hooks/use-get-comments"
import { usePostListFilterSearchParams } from "../../../entities/post/model/hooks/use-post-list-filter-search-params"
import { highlightText } from "../../../shared/lib/highlight-text"
import { AddCommentDialog } from "../../../features/add-comment/ui/AddCommentDialog"
import React, { useState } from "react"
import { EditCommentDialog } from "../../../features/edit-comment"
import { DeleteCommentButton } from "../../../features/delete-comment"
import { LikeCommentButton } from "../../../features/like-comment"

export const CommentsSection = ({ postId }: { postId: number }) => {
  const [isAddCommentDialogOpen, setIsAddCommentDialogOpen] = useState(false)

  const { data: comments } = useGetComments(postId)

  const handleAddComment = () => {
    setIsAddCommentDialogOpen(true)
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
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
      <AddCommentDialog isOpen={isAddCommentDialogOpen} setIsOpen={setIsAddCommentDialogOpen} postId={postId} />
    </>
  )
}

/**
 *CommentItem
 **/
const CommentItem = React.memo(function CommentItem({ comment }: { comment: Comment }) {
  const [isEditCommentDialogOpen, setIsEditCommentDialogOpen] = useState(false)

  const { postListFilterSearchParams } = usePostListFilterSearchParams()
  const searchQuery = postListFilterSearchParams.q || ""

  const handleEditComment = () => {
    setIsEditCommentDialogOpen(true)
  }

  return (
    <>
      <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
        <div className="flex items-center space-x-2 overflow-hidden">
          <span className="font-medium truncate">{comment.user.username}:</span>
          <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <LikeCommentButton comment={comment} />
          <Button variant="ghost" size="sm" onClick={handleEditComment}>
            <Edit2 className="w-3 h-3" />
          </Button>
          <DeleteCommentButton id={comment.id} postId={comment.postId} />
        </div>
      </div>
      <EditCommentDialog isOpen={isEditCommentDialogOpen} setIsOpen={setIsEditCommentDialogOpen} comment={comment} />
    </>
  )
})
