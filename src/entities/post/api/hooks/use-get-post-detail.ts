import { useQuery, useQueryClient } from "@tanstack/react-query"
import { postQueryKeys } from "../query-keys"
import { Post } from "../../model/types"

export const useGetPostDetail = (id: number) => {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: postQueryKeys.detail(id),
    queryFn: () => {
      // 캐시에서 직접 데이터 가져오기
      const cachedData = queryClient.getQueryData<Post>(postQueryKeys.detail(id))

      if (!cachedData) {
        return null
      }

      return cachedData
    },
    enabled: !!id,
    // 캐시된 데이터만 사용
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}
