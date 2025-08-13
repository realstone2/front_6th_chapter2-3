import { useQuery } from "@tanstack/react-query"
import { userQueryKeys } from "../query-keys"

export const useGetUserDetail = (id: number) => {
  return useQuery(userQueryKeys.detail(id))
}
