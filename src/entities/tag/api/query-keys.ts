import { queryOptions } from "@tanstack/react-query"
import { getTags } from "./services"

export const tagQueryKeys = {
  all: ["tags"] as const,
  list: () =>
    queryOptions({
      queryKey: [...tagQueryKeys.all, "list"],
      queryFn: () => getTags(),
    }),
}
