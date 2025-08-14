import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postQueryKeys } from "../../../../entities/post/api/query-keys"
import { PostListResponse } from "../../../../widgets/post-dashboard/api/hooks/use-get-post-list"
import { usePostListFilterSearchParams } from "../../../../widgets/post-dashboard/model/hooks/use-post-list-filter-search-params"
import { createPost, CreatePostRequest } from "../services"

// 게시물 생성 Mutation
export const useCreatePostMutation = () => {
  const { postListFilterSearchParams } = usePostListFilterSearchParams()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePostRequest) => createPost(data),
    onSuccess: (_, data) => {
      const postID = new Date().getTime()

      queryClient.setQueryData(postQueryKeys.detail(postID), data)

      queryClient.setQueriesData(
        { queryKey: postQueryKeys.list(postListFilterSearchParams) },
        (old: PostListResponse) => {
          return {
            ...old,
            postIds: [...old.postIds, postID],
          }
        },
      )
    },
  })
}
