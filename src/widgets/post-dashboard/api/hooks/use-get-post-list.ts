import { useQuery, useQueryClient } from "@tanstack/react-query"
import { postQueryKeys } from "../../../../entities/post/api/query-keys"
import { getPosts, getPostsByTag, searchPosts } from "../../../../entities/post/api/services"
import { GetPostQuery } from "../../../../entities/post/model/types"

export interface PostListResponse {
  postIds: number[]
  total: number
}

// 게시물 목록 조회 (ID만 반환하고 단건 데이터는 캐시에 저장)
export const useGetPosts = (query: GetPostQuery) => {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: postQueryKeys.list(query),
    queryFn: async () => {
      let postsResponse

      if (!!query.tag && query.tag !== "all") {
        postsResponse = await getPostsByTag(query.tag, query)
      } else if (query.q) {
        postsResponse = await searchPosts(query)
      } else {
        postsResponse = await getPosts(query)
      }

      postsResponse.posts.forEach((post) => {
        queryClient.setQueryData(postQueryKeys.detail(post.id), post)
      })

      return {
        postIds: postsResponse.posts.map((post) => post.id),
        total: postsResponse.total,
      }
    },
  })
}
