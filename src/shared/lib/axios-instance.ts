import axios, { AxiosInstance as AxiosInstanceType, AxiosRequestConfig, AxiosResponse } from "axios"

class AxiosInstance {
  private instance: AxiosInstanceType

  constructor() {
    this.instance = axios.create({
      baseURL: "/api",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  // GET 요청
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config)
    return response.data
  }

  // POST 요청
  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config)
    return response.data
  }

  // PUT 요청
  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config)
    return response.data
  }

  // DELETE 요청
  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config)
    return response.data
  }

  // PATCH 요청
  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config)
    return response.data
  }

  // 기본 axios 인스턴스에 직접 접근
  public getInstance(): AxiosInstanceType {
    return this.instance
  }
}

export const axiosInstance = new AxiosInstance()
