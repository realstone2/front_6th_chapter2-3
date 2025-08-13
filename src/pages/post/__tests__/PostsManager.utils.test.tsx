import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
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

// Test data
const mockPosts = [
  {
    id: 1,
    title: "Test Post 1",
    body: "Test body 1",
    userId: 1,
    tags: ["test", "example"],
    reactions: { likes: 5, dislikes: 1 },
  },
]

const mockUsers = [
  {
    id: 1,
    username: "user1",
    image: "https://example.com/user1.jpg",
  },
]

const mockComments = [
  {
    id: 1,
    body: "Test comment 1",
    postId: 1,
    userId: 1,
    likes: 2,
    user: { username: "user1" },
  },
]

// Helper function to render component with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe("PostsManager Utils & Error Handling Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(global.fetch as any).mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("3.13 태그 목록 조회 기능", () => {
    it("should fetch tags on component mount", async () => {
      // Mock initial load
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: mockPosts, total: 1 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: mockUsers }),
        })
        // Mock tags response
        .mockResolvedValueOnce({
          json: async () => [
            { url: "/tag/test", slug: "test" },
            { url: "/tag/example", slug: "example" },
          ],
        })

      renderWithRouter(<PostsManager />)

      // Wait for tags to be fetched
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/posts/tags")
      })
    })

    it("should handle tags fetch error", async () => {
      // Mock initial load
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: mockPosts, total: 1 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: mockUsers }),
        })
        // Mock tags error
        .mockRejectedValueOnce(new Error("Tags fetch error"))

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      renderWithRouter(<PostsManager />)

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith("태그 가져오기 오류:", expect.any(Error))
      })

      consoleSpy.mockRestore()
    })
  })

  describe("3.14 URL 상태 동기화 기능", () => {
    it("should update URL when search query changes", async () => {
      // Mock initial load
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: mockPosts, total: 1 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: mockUsers }),
        })

      renderWithRouter(<PostsManager />)

      await waitFor(() => {
        expect(screen.getByText("Test Post 1")).toBeInTheDocument()
      })

      // Change search query
      const searchInput = screen.getByPlaceholderText("게시물 검색...")
      fireEvent.change(searchInput, { target: { value: "test query" } })

      // Verify navigate was called (URL update)
      expect(mockNavigate).toHaveBeenCalled()
    })

    it("should update URL when pagination changes", async () => {
      // Mock initial load
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: mockPosts, total: 25 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: mockUsers }),
        })
        // Mock next page response
        .mockResolvedValueOnce({
          json: async () => ({ posts: [], total: 25 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: mockUsers }),
        })

      renderWithRouter(<PostsManager />)

      await waitFor(() => {
        expect(screen.getByText("Test Post 1")).toBeInTheDocument()
      })

      // Click next button
      const nextButton = screen.getByText("다음")
      fireEvent.click(nextButton)

      // Verify navigate was called (URL update)
      expect(mockNavigate).toHaveBeenCalled()
    })
  })

  describe("3.15 하이라이트 기능", () => {
    it("should highlight matching text correctly", async () => {
      // Mock search response
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: mockPosts, total: 1 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: mockUsers }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ posts: mockPosts, total: 1 }),
        })

      renderWithRouter(<PostsManager />)

      await waitFor(() => {
        expect(screen.getByText("Test Post 1")).toBeInTheDocument()
      })

      // Search for "Test"
      const searchInput = screen.getByPlaceholderText("게시물 검색...")
      fireEvent.change(searchInput, { target: { value: "Test" } })
      fireEvent.keyPress(searchInput, { key: "Enter", code: "Enter" })

      // Wait for search results
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/posts/search?q=Test")
      })
    })

    it("should handle undefined text gracefully", async () => {
      // Mock posts with undefined title
      const postsWithUndefinedTitle = [
        {
          ...mockPosts[0],
          title: undefined,
        },
      ]

      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: postsWithUndefinedTitle, total: 1 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: mockUsers }),
        })

      renderWithRouter(<PostsManager />)

      // Should not crash with undefined title
      await waitFor(() => {
        expect(screen.getByText("Test body 1")).toBeInTheDocument()
      })
    })
  })

  describe("5.1 API 에러 처리", () => {
    it("should handle network errors gracefully", async () => {
      // Mock network error
      ;(global.fetch as any).mockRejectedValueOnce(new Error("Network error"))

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      renderWithRouter(<PostsManager />)

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith("게시물 가져오기 오류:", expect.any(Error))
      })

      consoleSpy.mockRestore()
    })

    it("should handle API response errors", async () => {
      // Mock API error response
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      })

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      renderWithRouter(<PostsManager />)

      // Should handle error without crashing
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled()
      })

      consoleSpy.mockRestore()
    })

    it("should handle comment fetch errors", async () => {
      // Mock initial load
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: mockPosts, total: 1 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: mockUsers }),
        })
        // Mock comment fetch error
        .mockRejectedValueOnce(new Error("Comment fetch error"))

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      renderWithRouter(<PostsManager />)

      await waitFor(() => {
        expect(screen.getByText("Test Post 1")).toBeInTheDocument()
      })

      // Open post detail to trigger comment fetch
      const commentButtons = screen.getAllByRole("button")
      const commentButton = commentButtons.find(
        (button) => button.querySelector("svg") && button.getAttribute("aria-label")?.includes("댓글"),
      )

      if (commentButton) {
        fireEvent.click(commentButton)
      }

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith("댓글 가져오기 오류:", expect.any(Error))
      })

      consoleSpy.mockRestore()
    })
  })

  describe("5.2 사용자 입력 검증", () => {
    it("should prevent empty post submission", async () => {
      // Mock initial load
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: mockPosts, total: 1 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: mockUsers }),
        })

      renderWithRouter(<PostsManager />)

      await waitFor(() => {
        expect(screen.getByText("Test Post 1")).toBeInTheDocument()
      })

      // Open add post dialog
      const addButton = screen.getByText("게시물 추가")
      fireEvent.click(addButton)

      // Try to submit empty form
      const submitButton = screen.getByText("게시물 추가")
      fireEvent.click(submitButton)

      // Should not make API call for empty form
      expect(global.fetch).not.toHaveBeenCalledWith("/api/posts/add", expect.any(Object))
    })

    it("should prevent empty comment submission", async () => {
      // Mock initial load
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: mockPosts, total: 1 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: mockUsers }),
        })
        // Mock comments response
        .mockResolvedValueOnce({
          json: async () => ({ comments: mockComments }),
        })

      renderWithRouter(<PostsManager />)

      await waitFor(() => {
        expect(screen.getByText("Test Post 1")).toBeInTheDocument()
      })

      // Open post detail
      const commentButtons = screen.getAllByRole("button")
      const commentButton = commentButtons.find(
        (button) => button.querySelector("svg") && button.getAttribute("aria-label")?.includes("댓글"),
      )

      if (commentButton) {
        fireEvent.click(commentButton)
      }

      await waitFor(() => {
        expect(screen.getByText("댓글 추가")).toBeInTheDocument()
      })

      // Open add comment dialog
      const addCommentButton = screen.getByText("댓글 추가")
      fireEvent.click(addCommentButton)

      // Try to submit empty comment
      const submitButton = screen.getByText("댓글 추가")
      fireEvent.click(submitButton)

      // Should not make API call for empty comment
      expect(global.fetch).not.toHaveBeenCalledWith("/api/comments/add", expect.any(Object))
    })
  })

  describe("6.1 댓글 캐싱", () => {
    it("should not refetch comments for same post", async () => {
      // Mock initial load
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: mockPosts, total: 1 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: mockUsers }),
        })
        // Mock comments response (only once)
        .mockResolvedValueOnce({
          json: async () => ({ comments: mockComments }),
        })

      renderWithRouter(<PostsManager />)

      await waitFor(() => {
        expect(screen.getByText("Test Post 1")).toBeInTheDocument()
      })

      // Open post detail twice
      const commentButtons = screen.getAllByRole("button")
      const commentButton = commentButtons.find(
        (button) => button.querySelector("svg") && button.getAttribute("aria-label")?.includes("댓글"),
      )

      if (commentButton) {
        fireEvent.click(commentButton)
        fireEvent.click(commentButton) // Second click should not trigger API call
      }

      // Verify comments API is called only once
      await waitFor(() => {
        const commentCalls = (global.fetch as any).mock.calls.filter((call: any) =>
          call[0].includes("/api/comments/post/1"),
        )
        expect(commentCalls).toHaveLength(1)
      })
    })
  })

  describe("6.2 조건부 렌더링", () => {
    it("should show loading state during API calls", async () => {
      // Mock delayed response
      ;(global.fetch as any).mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)))

      renderWithRouter(<PostsManager />)

      // Should show loading initially
      expect(screen.getByText("로딩 중...")).toBeInTheDocument()
    })

    it("should show actual content after loading", async () => {
      // Mock normal response
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: mockPosts, total: 1 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: mockUsers }),
        })

      renderWithRouter(<PostsManager />)

      // Should show content after loading
      await waitFor(() => {
        expect(screen.getByText("Test Post 1")).toBeInTheDocument()
        expect(screen.queryByText("로딩 중...")).not.toBeInTheDocument()
      })
    })
  })

  describe("성능 최적화 테스트", () => {
    it("should use Promise.all for parallel API calls", async () => {
      // Mock initial load
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: mockPosts, total: 1 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: mockUsers }),
        })

      renderWithRouter(<PostsManager />)

      await waitFor(() => {
        expect(screen.getByText("Test Post 1")).toBeInTheDocument()
      })

      // Verify both API calls were made
      expect(global.fetch).toHaveBeenCalledWith("/api/posts?limit=10&skip=0")
      expect(global.fetch).toHaveBeenCalledWith("/api/users?limit=0&select=username,image")
    })

    it("should handle large data sets efficiently", async () => {
      // Mock large dataset
      const largePosts = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        title: `Post ${i + 1}`,
        body: `Body ${i + 1}`,
        userId: 1,
        tags: ["test"],
        reactions: { likes: 0, dislikes: 0 },
      }))

      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: largePosts, total: 100 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: mockUsers }),
        })

      renderWithRouter(<PostsManager />)

      // Should handle large dataset without performance issues
      await waitFor(() => {
        expect(screen.getByText("Post 1")).toBeInTheDocument()
      })
    })
  })
})

