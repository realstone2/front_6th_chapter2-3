import { axiosInstance } from "../../../shared/lib/axios-instance"
import { GetUserQuery, User, UsersResponse } from "../model/types"

export const getUser = (query: GetUserQuery) => {
  return axiosInstance.get<UsersResponse>(`/users`, { params: query })
}

export const getUserById = (id: number) => {
  return axiosInstance.get<User>(`/users/${id}`)
}
