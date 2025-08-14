import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postQueryKeys } from "../../../../entities/post"
import { PostListResponse } from "../../../../widgets/post-dashboard/api/hooks/use-get-post-list"
import { usePostListFilterSearchParams } from "../../../../entities/post/model/hooks/use-post-list-filter-search-params"
import { createPost, CreatePostRequest } from "../services"

// 게시물 생성 Mutation
export const useCreatePostMutation = () => {
  const { postListFilterSearchParams } = usePostListFilterSearchParams()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePostRequest) => createPost(data),
    onSuccess: (response) => {
      const postID = new Date().getTime()

      queryClient.setQueryData(postQueryKeys.detail(postID), response)

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
    onError: (error) => {
      console.error("게시글 생성 실패", error)
    },
  })
}
