import React from "react"
import { useGetPostDetail } from "../../../entities/post"
import { highlightText } from "../../../shared/lib/highlight-text"
import { Dialog } from "../../../shared/ui"
import { CommentsSection } from "../../comment-list/ui/CommentsSection"
import { usePostListFilterSearchParams } from "../../post-dashboard/model/hooks/use-post-list-filter-search-params"

/**
 *PostDetailDialog
 **/
export const PostDetailDialog = React.memo(function PostDetailDialog({
  isOpen,
  setIsOpen,
  postId,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  postId: number
}) {
  const { postListFilterSearchParams } = usePostListFilterSearchParams()
  const searchQuery = postListFilterSearchParams.q || ""

  const { data: post } = useGetPostDetail(postId)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Content className="max-w-3xl">
        <Dialog.Header>
          <Dialog.Title>{highlightText(post?.title ?? "", searchQuery)}</Dialog.Title>
        </Dialog.Header>
        <CommentList postId={postId} />
      </Dialog.Content>
    </Dialog>
  )
})

/**
 * CommentList
 **/
const CommentList = React.memo(function CommentList({ postId }: { postId: number }) {
  const { data: post } = useGetPostDetail(postId)

  const { postListFilterSearchParams } = usePostListFilterSearchParams()

  const searchQuery = postListFilterSearchParams.q || ""

  return (
    <div className="space-y-4">
      <p>{highlightText(post?.body, searchQuery)}</p>
      {post && <CommentsSection postId={post.id} />}
    </div>
  )
})
