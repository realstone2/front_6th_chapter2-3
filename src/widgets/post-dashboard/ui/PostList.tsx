import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../shared/ui"
import { usePostListFilterSearchParams } from "../model/hooks/use-post-list-filter-search-params"

import { highlightText } from "../../../shared/lib/highlight-text"
import React, { useState } from "react"
import { useGetPostDetail } from "../../../entities/post/api/hooks/use-get-post-detail"
import { PostDetailDialog } from "../../../widgets/post-dashboard/ui/PostDetailDialog"
import { useGetPosts } from "../api/hooks/use-get-post-list"
import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import { deletePost } from "../../../features/post/api/services"
import { EditPostDialog } from "../../../features/edit-post/ui/EditPostDialog"
import { UserDetailDialog } from "../../../entities/user/ui"
import { useGetUserDetail } from "../../../entities/user/api/hooks/use-get-user-detail"

export function PostTable() {
  const { postListFilterSearchParams } = usePostListFilterSearchParams()
  const { data: postList, isLoading } = useGetPosts(postListFilterSearchParams)
  const postIds = postList?.postIds || []

  if (isLoading) {
    return <div className="flex justify-center p-4">로딩 중...</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className="w-[150px]">작성자</TableHead>
          <TableHead className="w-[150px]">반응</TableHead>
          <TableHead className="w-[150px]">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {postIds.map((postId) => (
          <ProductTableRow key={postId} postId={postId} />
        ))}
      </TableBody>
    </Table>
  )
}

/**
 *ProductTableRow
 **/
const ProductTableRow = React.memo(function ProductTableRow({ postId }: { postId: number }) {
  const { data: postDetail } = useGetPostDetail(postId)

  const { data: user } = useGetUserDetail(postDetail?.userId ?? 0)

  const post = React.useMemo(() => {
    return {
      ...postDetail,
      author: user,
    }
  }, [postDetail, user])

  const { postListFilterSearchParams, setPostListFilterSearchParams } = usePostListFilterSearchParams()

  const [showPostDetailDialog, setShowPostDetailDialog] = useState<boolean>(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState<boolean>(false)
  const [showUserModal, setShowUserModal] = useState<boolean>(false)

  const selectedTag = postListFilterSearchParams.tag ?? ""

  if (!post) return null

  return (
    <>
      <TableRow key={post.id}>
        <TableCell>{post.id}</TableCell>
        <TableCell>
          <div className="space-y-1">
            <div>{highlightText(post.title, postListFilterSearchParams.q ?? "")}</div>

            <div className="flex flex-wrap gap-1">
              {post.tags?.map((tag) => (
                <span
                  key={tag}
                  className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                    selectedTag === tag
                      ? "text-white bg-blue-500 hover:bg-blue-600"
                      : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                  }`}
                  onClick={() => {
                    setPostListFilterSearchParams({ tag })
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setShowUserModal(true)}>
            <img src={post.author?.image} alt={post.author?.username} className="w-8 h-8 rounded-full" />
            <span>{post.author?.username}</span>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <ThumbsUp className="w-4 h-4" />
            <span>{post.reactions?.likes || 0}</span>
            <ThumbsDown className="w-4 h-4" />
            <span>{post.reactions?.dislikes || 0}</span>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowPostDetailDialog(true)}>
              <MessageSquare className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowEditCommentDialog(true)
              }}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => deletePost(post.id ?? 0)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
      <PostDetailDialog isOpen={showPostDetailDialog} setIsOpen={setShowPostDetailDialog} postId={postId} />
      <EditPostDialog isOpen={showEditCommentDialog} setIsOpen={setShowEditCommentDialog} postId={postId} />
      <UserDetailDialog isOpen={showUserModal} setIsOpen={setShowUserModal} user={post.author ?? null} />
    </>
  )
})
