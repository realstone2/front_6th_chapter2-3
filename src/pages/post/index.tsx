import { Plus, Search } from "lucide-react"
import { useState } from "react"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shared/ui/index"

import { useGetTags } from "../../entities/tag/api"
import { AddPostDialog } from "../../features/add-post/ui/AddPostDialog"
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

  // 상태 관리
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false)

  const { data: tags } = useGetTags()

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
    </Card>
  )
}

export default PostsManager
