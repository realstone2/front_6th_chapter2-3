import { useQuery } from "@tanstack/react-query"
import { tagQueryKeys } from "../query-keys"

export const useGetTags = () => {
  return useQuery(tagQueryKeys.list())
}
