import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postQueryKeys } from "../../../../entities/post/api/query-keys"
import { UpdatePostRequest } from "../../../../entities/post/model/types"
import { updatePost } from "../services"

// 게시물 수정 Mutation
export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePostRequest }) => updatePost(id, data),
    onSuccess: (_, request) => {
      // 단건 캐시만 업데이트
      queryClient.setQueryData(postQueryKeys.detail(request.id), request)
    },
  })
}
