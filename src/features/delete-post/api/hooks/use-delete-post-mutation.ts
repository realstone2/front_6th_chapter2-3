import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postQueryKeys } from "../../../../entities/post/api/query-keys"
import { usePostListFilterSearchParams } from "../../../../entities/post/model/hooks/use-post-list-filter-search-params"
import { deletePost } from "../services"
import { PostListResponse } from "../../../../widgets/post-dashboard/api/hooks/use-get-post-list"

// 게시물 삭제 Mutation
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient()
  const { postListFilterSearchParams } = usePostListFilterSearchParams()

  return useMutation({
    mutationFn: (id: number) => deletePost(id),
    onMutate: (deletedId) => {
      // 단건 캐시에서 제거
      queryClient.removeQueries({
        queryKey: postQueryKeys.detail(deletedId),
      })

      queryClient.setQueriesData(
        { queryKey: postQueryKeys.list(postListFilterSearchParams) },
        (old: PostListResponse) => {
          return {
            ...old,
            postIds: old.postIds.filter((id) => id !== deletedId),
          }
        },
      )
    },
  })
}
