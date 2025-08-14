import React, { useState } from "react"
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/ui"
import { Search } from "lucide-react"
import { useGetTags } from "../../../entities/tag"
import { usePostListFilterSearchParams } from "../../../entities/post/model/hooks/use-post-list-filter-search-params"
import { useDebouncedCallback } from "../../../shared/lib/use-debounce"

/**
 * PostFilter
 **/
export const PostFilter = React.memo(function PostFilter() {
  const { postListFilterSearchParams, setPostListFilterSearchParams } = usePostListFilterSearchParams()
  const { data: tags } = useGetTags()

  const [searchQuery, setSearchQuery] = useState(postListFilterSearchParams.q ?? "")

  const debouncedSetSearchQuery = useDebouncedCallback((value: string) => {
    setPostListFilterSearchParams({ q: value })
  }, 500)

  const sortBy = postListFilterSearchParams.sortBy ?? "none"
  const sortOrder = postListFilterSearchParams.order ?? "asc"
  const selectedTag = postListFilterSearchParams.tag ?? ""

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="게시물 검색..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              debouncedSetSearchQuery(e.target.value)
            }}
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
        disabled={sortBy === "none"}
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
  )
})
