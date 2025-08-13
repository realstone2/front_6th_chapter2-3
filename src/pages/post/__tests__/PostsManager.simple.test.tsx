import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import PostsManager from "../index"

// Mock fetch globally
global.fetch = vi.fn()

// Mock React Router hooks
const mockNavigate = vi.fn()
const mockLocation = {
  pathname: "/posts",
  search: "",
  hash: "",
  state: null,
  key: "default",
}

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  }
})

// Helper function to render component with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe("PostsManager Basic Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(global.fetch as any).mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("기본 렌더링 테스트", () => {
    it("should render the component without crashing", () => {
      // Mock basic API responses
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: [], total: 0 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: [] }),
        })
        .mockResolvedValueOnce({
          json: async () => [],
        })

      renderWithRouter(<PostsManager />)

      // Check if main elements are rendered
      expect(screen.getByText("게시물 관리자")).toBeInTheDocument()
      expect(screen.getByText("게시물 추가")).toBeInTheDocument()
      expect(screen.getByPlaceholderText("게시물 검색...")).toBeInTheDocument()
    })

    it("should show loading state initially", () => {
      // Mock delayed response to see loading state
      ;(global.fetch as any).mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)))

      renderWithRouter(<PostsManager />)

      // Should show loading initially
      expect(screen.getByText("로딩 중...")).toBeInTheDocument()
    })

    it("should render table headers correctly", () => {
      // Mock basic API responses
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: [], total: 0 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: [] }),
        })
        .mockResolvedValueOnce({
          json: async () => [],
        })

      renderWithRouter(<PostsManager />)

      // Check table headers
      expect(screen.getByText("ID")).toBeInTheDocument()
      expect(screen.getByText("제목")).toBeInTheDocument()
      expect(screen.getByText("작성자")).toBeInTheDocument()
      expect(screen.getByText("반응")).toBeInTheDocument()
      expect(screen.getByText("작업")).toBeInTheDocument()
    })

    it("should render pagination controls", () => {
      // Mock basic API responses
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: [], total: 0 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: [] }),
        })
        .mockResolvedValueOnce({
          json: async () => [],
        })

      renderWithRouter(<PostsManager />)

      // Check pagination elements
      expect(screen.getByText("표시")).toBeInTheDocument()
      expect(screen.getByText("항목")).toBeInTheDocument()
      expect(screen.getByText("이전")).toBeInTheDocument()
      expect(screen.getByText("다음")).toBeInTheDocument()
    })

    it("should render filter controls", () => {
      // Mock basic API responses
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: [], total: 0 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: [] }),
        })
        .mockResolvedValueOnce({
          json: async () => [],
        })

      renderWithRouter(<PostsManager />)

      // Check filter elements
      expect(screen.getByDisplayValue("태그 선택")).toBeInTheDocument()
      expect(screen.getByDisplayValue("정렬 기준")).toBeInTheDocument()
      expect(screen.getByDisplayValue("오름차순")).toBeInTheDocument()
    })
  })

  describe("API 호출 테스트", () => {
    it("should call initial APIs on mount", async () => {
      // Mock API responses
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: [], total: 0 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: [] }),
        })
        .mockResolvedValueOnce({
          json: async () => [],
        })

      renderWithRouter(<PostsManager />)

      // Wait for API calls to be made
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Verify API calls were made
      expect(global.fetch).toHaveBeenCalledWith("/api/posts?limit=10&skip=0")
      expect(global.fetch).toHaveBeenCalledWith("/api/users?limit=0&select=username,image")
      expect(global.fetch).toHaveBeenCalledWith("/api/posts/tags")
    })

    it("should handle API errors gracefully", async () => {
      // Mock API error
      ;(global.fetch as any).mockRejectedValueOnce(new Error("Network error"))

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      renderWithRouter(<PostsManager />)

      // Wait for error to be handled
      await new Promise((resolve) => setTimeout(resolve, 100))

      expect(consoleSpy).toHaveBeenCalledWith("게시물 가져오기 오류:", expect.any(Error))

      consoleSpy.mockRestore()
    })
  })

  describe("상태 관리 테스트", () => {
    it("should initialize with correct default values", () => {
      // Mock basic API responses
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: [], total: 0 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: [] }),
        })
        .mockResolvedValueOnce({
          json: async () => [],
        })

      renderWithRouter(<PostsManager />)

      // Check default values are displayed
      expect(screen.getByDisplayValue("10")).toBeInTheDocument() // default limit
      expect(screen.getByDisplayValue("오름차순")).toBeInTheDocument() // default sort order
    })
  })
})

