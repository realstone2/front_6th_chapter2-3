import { useQuery } from "@tanstack/react-query"
import { userQueryKeys } from "../query-keys"
import { GetUserQuery } from "../../model/types"

export const useGetUsers = (query: GetUserQuery) => {
  return useQuery(userQueryKeys.list(query))
}
