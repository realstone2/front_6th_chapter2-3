import React from "react"
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/ui"
import { useGetPosts } from "../api/hooks/use-get-post-list"
import { usePostListFilterSearchParams } from "../model/hooks/use-post-list-filter-search-params"

/**
 * PostPagination
 **/
export const PostPagination = React.memo(function PostPagination() {
  const { postListFilterSearchParams, setPostListFilterSearchParams } = usePostListFilterSearchParams()

  const { data: postList } = useGetPosts(postListFilterSearchParams)

  const limit = postListFilterSearchParams.limit ?? 30
  const skip = postListFilterSearchParams.skip ?? 0
  const total = postList?.total || 0

  return (
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
        <Button disabled={skip + limit >= total} onClick={() => setPostListFilterSearchParams({ skip: skip + limit })}>
          다음
        </Button>
      </div>
    </div>
  )
})
