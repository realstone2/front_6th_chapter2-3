import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { postQueryKeys } from "../../../../entities/post/api/query-keys"
import { getPosts, getPostsByTag, searchPosts } from "../../../../entities/post/api/services"
import { GetPostQuery } from "../../../../entities/post/model/types"
import { useGetUsers } from "../../../../entities/user/api"

// 게시물 목록 조회
export const useGetPosts = (query: GetPostQuery) => {
  const userQuery = useGetUsers({
    limit: 0,
    select: ["username", "image"],
  })

  const postQuery = useQuery({
    queryKey: postQueryKeys.list(query),
    queryFn: () => {
      if (query.tag) {
        return getPostsByTag(query.tag)
      }
      if (query.q) {
        return searchPosts(query)
      }
      return getPosts(query)
    },
  })

  const posts = useMemo(() => {
    if (postQuery.data) {
      return postQuery.data.posts.map((post) => ({
        ...post,
        author: userQuery.data?.find((user) => user.id === post.userId),
      }))
    }
    return []
  }, [postQuery.data, userQuery.data])

  return {
    ...postQuery,
    posts,
    isLoading: postQuery.isLoading || userQuery.isLoading,
    isError: postQuery.isError || userQuery.isError,
  }
}
