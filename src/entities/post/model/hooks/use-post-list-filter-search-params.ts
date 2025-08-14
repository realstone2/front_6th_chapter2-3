import React from "react"
import { useSearchParams } from "react-router-dom"
import { postListQuerySchema } from "../../../../entities/post/model/post-list-query-schema"
import { GetPostQuery } from "../../../../entities/post"
import { createQueryString, parseQueryString } from "@toss/utils"

/**
 * searchParams를 Order requestType에 맞는 타입으로 변환해서 return
 */
export function usePostListFilterSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filterSearchParams: GetPostQuery = React.useMemo(() => {
    // URLSearchParams를 일반 객체로 변환
    const paramsObject = parseQueryString(searchParams.toString())
    const validSearchParams = postListQuerySchema.safeParse(paramsObject)

    if (!validSearchParams.success) {
      return {}
    }

    return {
      ...validSearchParams.data,
    }
  }, [searchParams])

  const setFilterSearchParams = (value: Partial<GetPostQuery>) => {
    const newSearchParams = {
      ...filterSearchParams,
      ...value,
    }

    setSearchParams(createQueryString(newSearchParams))
  }

  return {
    postListFilterSearchParams: filterSearchParams,
    setPostListFilterSearchParams: setFilterSearchParams,
  }
}
