import { queryOptions } from "@tanstack/react-query"
import { GetUserQuery } from "../model/types"
import { getUser, getUserById } from "./services"

export const userQueryKeys = {
  all: ["users"] as const,
  lists: () => [...userQueryKeys.all, "list"] as const,
  list: (query: GetUserQuery) =>
    queryOptions({
      queryKey: [...userQueryKeys.lists(), query],
      queryFn: () => getUser(query),
      select: (data) => data.users,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      refetchOnMount: false,
    }),
  detail: (id: number) =>
    queryOptions({
      queryKey: [...userQueryKeys.all, "detail", id],
      queryFn: () => getUserById(id),
    }),
}
