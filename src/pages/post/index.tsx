import { Plus, Search } from "lucide-react"
import { useState } from "react"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "../../shared/ui/index"

import { Comment, CommentsResponse } from "../../entities/comment"
import { Post } from "../../entities/post"
import { useGetTags } from "../../entities/tag/api"
import { User } from "../../entities/user"
import { AddCommentDialog } from "../../features/add-comment"
import { useCreatePostMutation } from "../../features/add-post/api/hooks/use-create-post-mutation"
import { AddPostDialog } from "../../features/add-post/ui/AddPostDialog"
import { useUpdatePostMutation } from "../../features/edit-post/api/hooks/use-update-post-mutation"
import { useDeletePostMutation } from "../../features/post/api/hooks/use-delete-post-mutation"
import { useGetPosts } from "../../widgets/post-dashboard/api/hooks/use-get-post-list"
import { usePostListFilterSearchParams } from "../../widgets/post-dashboard/model/hooks/use-post-list-filter-search-params"
import { PostTable } from "../../widgets/post-dashboard/ui/PostList"

const PostsManager = () => {
  const { postListFilterSearchParams, setPostListFilterSearchParams } = usePostListFilterSearchParams()
  const queryParams = postListFilterSearchParams

  const limit = queryParams.limit ?? 10
  const skip = queryParams.skip ?? 0
  const searchQuery = queryParams.q ?? ""
  const sortBy = queryParams.sortBy ?? "none"
  const sortOrder = queryParams.order ?? "asc"
  const selectedTag = queryParams.tag ?? ""

  const { data: postList, isLoading } = useGetPosts(queryParams)
  const posts = postList?.postIds || []
  const total = postList?.total || 0

  // Mutation hooks
  const createPostMutation = useCreatePostMutation()
  const updatePostMutation = useUpdatePostMutation()
  const deletePostMutation = useDeletePostMutation()

  // 상태 관리
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false)
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false)
  const [newPost, setNewPost] = useState<{ title: string; body: string; userId: number }>({
    title: "",
    body: "",
    userId: 1,
  })

  const { data: tags } = useGetTags()
  const [comments, setComments] = useState<Record<number, Comment[]>>({})
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [showAddCommentDialog, setShowAddCommentDialog] = useState<boolean>(false)
  const [selectedPostIdForComment, setSelectedPostIdForComment] = useState<number | null>(null)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState<boolean>(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState<boolean>(false)
  const [showUserModal, setShowUserModal] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // 게시물 추가
  const addPost = async () => {
    try {
      await createPostMutation.mutateAsync(newPost)
      setShowAddDialog(false)
      setNewPost({ title: "", body: "", userId: 1 })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  // 게시물 업데이트
  const updatePost = async () => {
    if (!selectedPost) return
    try {
      await updatePostMutation.mutateAsync({
        id: selectedPost.id,
        data: { title: selectedPost.title, body: selectedPost.body },
      })
      setShowEditDialog(false)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  // 게시물 삭제
  const deletePost = async (id: number) => {
    try {
      await deletePostMutation.mutateAsync(id)
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  // 댓글 가져오기
  const fetchComments = async (postId: number) => {
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const response = await fetch(`/api/comments/post/${postId}`)
      const data: CommentsResponse = await response.json()
      setComments((prev) => ({ ...prev, [postId]: data.comments }))
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }

  // 댓글 업데이트
  const updateComment = async () => {
    if (!selectedComment) return
    try {
      const response = await fetch(`/api/comments/${selectedComment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: selectedComment.body }),
      })
      const data: Comment = await response.json()
      setComments((prev) => ({
        ...prev,
        [data.postId]: prev[data.postId].map((comment) => (comment.id === data.id ? data : comment)),
      }))
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  // 댓글 삭제
  const deleteComment = async (id: number, postId: number) => {
    try {
      await fetch(`/api/comments/${id}`, {
        method: "DELETE",
      })
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => comment.id !== id),
      }))
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  // 댓글 좋아요
  const likeComment = async (id: number, postId: number) => {
    try {
      const currentComment = comments[postId].find((c) => c.id === id)
      if (!currentComment) return

      const response = await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: currentComment.likes + 1 }),
      })
      const data: Comment = await response.json()
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) =>
          comment.id === data.id ? { ...data, likes: comment.likes + 1 } : comment,
        ),
      }))
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  // 사용자 모달 열기
  const openUserModal = async (user: User) => {
    try {
      const response = await fetch(`/api/users/${user.id}`)
      const userData: User = await response.json()
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  // 댓글 관련 핸들러 함수들
  const handleAddComment = (postId: number) => {
    setSelectedPostIdForComment(postId)
    setShowAddCommentDialog(true)
  }

  const handleEditComment = (comment: Comment) => {
    setSelectedComment(comment)
    setShowEditCommentDialog(true)
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="게시물 검색..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setPostListFilterSearchParams({ q: e.target.value })}
                  //TODO: 검색 debounce 및 내부 state 추가
                />
              </div>
            </div>
            <Select
              value={selectedTag}
              onValueChange={(value) => {
                setPostListFilterSearchParams({ tag: value })
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="태그 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 태그</SelectItem>
                {Array.isArray(tags) &&
                  tags.map((tag) => (
                    <SelectItem key={tag.url} value={tag.slug}>
                      {tag.slug}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select
              value={sortBy}
              onValueChange={(value) =>
                setPostListFilterSearchParams({ sortBy: value as "none" | "id" | "title" | "reactions" })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">없음</SelectItem>
                <SelectItem value="id">ID</SelectItem>
                <SelectItem value="title">제목</SelectItem>
                <SelectItem value="reactions">반응</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortOrder}
              onValueChange={(value) => setPostListFilterSearchParams({ order: value as "asc" | "desc" })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 순서" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">오름차순</SelectItem>
                <SelectItem value="desc">내림차순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 게시물 테이블 */}
          <PostTable />

          {/* 페이지네이션 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>표시</span>
              <Select
                value={limit.toString()}
                onValueChange={(value) => setPostListFilterSearchParams({ limit: Number(value) })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </SelectContent>
              </Select>
              <span>항목</span>
            </div>
            <div className="flex gap-2">
              <Button
                disabled={skip === 0}
                onClick={() => setPostListFilterSearchParams({ skip: Math.max(0, skip - limit) })}
              >
                이전
              </Button>
              <Button
                disabled={skip + limit >= total}
                onClick={() => setPostListFilterSearchParams({ skip: skip + limit })}
              >
                다음
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      <AddPostDialog isOpen={showAddDialog} setIsOpen={setShowAddDialog} />

      {/* 게시물 수정 대화상자 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>게시물 수정</Dialog.Title>
          </Dialog.Header>
          <div className="space-y-4">
            <Input
              placeholder="제목"
              value={selectedPost?.title || ""}
              onChange={(e) => selectedPost && setSelectedPost({ ...selectedPost, title: e.target.value })}
            />
            <Textarea
              rows={15}
              placeholder="내용"
              value={selectedPost?.body || ""}
              onChange={(e) => selectedPost && setSelectedPost({ ...selectedPost, body: e.target.value })}
            />
            <Button onClick={updatePost}>게시물 업데이트</Button>
          </div>
        </Dialog.Content>
      </Dialog>

      {/* 댓글 수정 대화상자 */}
      <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>댓글 수정</Dialog.Title>
          </Dialog.Header>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글 내용"
              value={selectedComment?.body || ""}
              onChange={(e) => selectedComment && setSelectedComment({ ...selectedComment, body: e.target.value })}
            />
            <Button onClick={updateComment}>댓글 업데이트</Button>
          </div>
        </Dialog.Content>
      </Dialog>

      {/* 사용자 모달 */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>사용자 정보</Dialog.Title>
          </Dialog.Header>
          <div className="space-y-4">
            <img src={selectedUser?.image} alt={selectedUser?.username} className="w-24 h-24 rounded-full mx-auto" />
            <h3 className="text-xl font-semibold text-center">{selectedUser?.username}</h3>
            <div className="space-y-2">
              <p>
                <strong>이름:</strong> {selectedUser?.firstName} {selectedUser?.lastName}
              </p>
              <p>
                <strong>나이:</strong> {selectedUser?.age}
              </p>
              <p>
                <strong>이메일:</strong> {selectedUser?.email}
              </p>
              <p>
                <strong>전화번호:</strong> {selectedUser?.phone}
              </p>
              <p>
                <strong>주소:</strong> {selectedUser?.address?.address}, {selectedUser?.address?.city},{" "}
                {selectedUser?.address?.state}
              </p>
              <p>
                <strong>직장:</strong> {selectedUser?.company?.name} - {selectedUser?.company?.title}
              </p>
            </div>
          </div>
        </Dialog.Content>
      </Dialog>
    </Card>
  )
}

export default PostsManager
