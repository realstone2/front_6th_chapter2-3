import { axiosInstance } from "../../../shared/lib/axios-instance"
import { Tag } from "../model/types"

export const getTags = () => {
  return axiosInstance.get<Tag[]>(`/posts/tags`)
}
