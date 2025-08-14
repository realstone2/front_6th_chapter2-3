import { useQuery, useQueryClient } from "@tanstack/react-query"
import { postQueryKeys } from "../../../../entities/post/api/query-keys"
import { getPosts, getPostsByTag, searchPosts } from "../../../../entities/post/api/services"
import { GetPostQuery } from "../../../../entities/post/model/types"

// 게시물 목록 조회 (ID만 반환하고 단건 데이터는 캐시에 저장)
export const useGetPosts = (query: GetPostQuery) => {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: postQueryKeys.list(query),
    queryFn: async () => {
      // 1. 포스트 리스트 조회
      let postsResponse

      if (query.tag) {
        postsResponse = await getPostsByTag(query.tag)
      } else if (query.q) {
        postsResponse = await searchPosts(query)
      } else {
        postsResponse = await getPosts(query)
      }

      // 2. 각 포스트를 단건 캐시에 저장
      postsResponse.posts.forEach((post) => {
        queryClient.setQueryData(postQueryKeys.detail(post.id), post)
      })

      // 3. ID만 반환 (실제 데이터는 캐시에 저장됨)
      return {
        posts: postsResponse.posts.map((post) => ({ id: post.id })),
        total: postsResponse.total,
      }
    },
  })
}
