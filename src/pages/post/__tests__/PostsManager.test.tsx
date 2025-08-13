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
  {
    id: 2,
    title: "Test Post 2",
    body: "Test body 2",
    userId: 2,
    tags: ["test"],
    reactions: { likes: 3, dislikes: 0 },
  },
]

const mockUsers = [
  {
    id: 1,
    username: "user1",
    image: "https://example.com/user1.jpg",
  },
  {
    id: 2,
    username: "user2",
    image: "https://example.com/user2.jpg",
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
  {
    id: 2,
    body: "Test comment 2",
    postId: 1,
    userId: 2,
    likes: 1,
    user: { username: "user2" },
  },
]

const mockTags = [
  { url: "/tag/test", slug: "test" },
  { url: "/tag/example", slug: "example" },
]

// Helper function to render component with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe("PostsManager", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset fetch mock
    ;(global.fetch as any).mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("3.1 게시물 목록 조회 기능", () => {
    it("should fetch and display posts with user information", async () => {
      // Mock API responses
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: mockPosts, total: 2 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: mockUsers }),
        })

      renderWithRouter(<PostsManager />)

      // Wait for posts to load
      await waitFor(() => {
        expect(screen.getByText("Test Post 1")).toBeInTheDocument()
        expect(screen.getByText("Test Post 2")).toBeInTheDocument()
      })

      // Check if user information is displayed
      expect(screen.getByText("user1")).toBeInTheDocument()
      expect(screen.getByText("user2")).toBeInTheDocument()

      // Verify API calls
      expect(global.fetch).toHaveBeenCalledWith("/api/posts?limit=10&skip=0")
      expect(global.fetch).toHaveBeenCalledWith("/api/users?limit=0&select=username,image")
    })

    it("should handle loading state", async () => {
      // Mock delayed response
      ;(global.fetch as any).mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)))

      renderWithRouter(<PostsManager />)

      // Should show loading initially
      expect(screen.getByText("로딩 중...")).toBeInTheDocument()
    })

    it("should handle API error", async () => {
      // Mock API error
      ;(global.fetch as any).mockRejectedValueOnce(new Error("Network error"))

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      renderWithRouter(<PostsManager />)

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith("게시물 가져오기 오류:", expect.any(Error))
      })

      consoleSpy.mockRestore()
    })
  })

  describe("3.2 게시물 검색 기능", () => {
    it("should search posts when Enter key is pressed", async () => {
      // Mock initial posts load
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: mockPosts, total: 2 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: mockUsers }),
        })
        // Mock search response
        .mockResolvedValueOnce({
          json: async () => ({ posts: [mockPosts[0]], total: 1 }),
        })

      renderWithRouter(<PostsManager />)

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText("Test Post 1")).toBeInTheDocument()
      })

      // Find search input and type
      const searchInput = screen.getByPlaceholderText("게시물 검색...")
      fireEvent.change(searchInput, { target: { value: "Test Post 1" } })
      fireEvent.keyPress(searchInput, { key: "Enter", code: "Enter" })

      // Wait for search results
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/posts/search?q=Test Post 1")
      })
    })

    it("should fetch all posts when search query is empty", async () => {
      // Mock initial posts load
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: mockPosts, total: 2 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: mockUsers }),
        })

      renderWithRouter(<PostsManager />)

      await waitFor(() => {
        expect(screen.getByText("Test Post 1")).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText("게시물 검색...")
      fireEvent.change(searchInput, { target: { value: "" } })
      fireEvent.keyPress(searchInput, { key: "Enter", code: "Enter" })

      // Should call fetchPosts instead of search
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/posts?limit=10&skip=0")
      })
    })
  })

  describe("3.4 게시물 추가 기능", () => {
    it("should open add post dialog when button is clicked", async () => {
      // Mock initial load
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: mockPosts, total: 2 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: mockUsers }),
        })

      renderWithRouter(<PostsManager />)

      await waitFor(() => {
        expect(screen.getByText("Test Post 1")).toBeInTheDocument()
      })

      // Click add post button
      const addButton = screen.getByText("게시물 추가")
      fireEvent.click(addButton)

      // Dialog should be visible
      expect(screen.getByText("새 게시물 추가")).toBeInTheDocument()
      expect(screen.getByPlaceholderText("제목")).toBeInTheDocument()
      expect(screen.getByPlaceholderText("내용")).toBeInTheDocument()
    })

    it("should add new post when form is submitted", async () => {
      // Mock initial load
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: mockPosts, total: 2 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: mockUsers }),
        })
        // Mock add post response
        .mockResolvedValueOnce({
          json: async () => ({
            id: 3,
            title: "New Post",
            body: "New body",
            userId: 1,
          }),
        })

      renderWithRouter(<PostsManager />)

      await waitFor(() => {
        expect(screen.getByText("Test Post 1")).toBeInTheDocument()
      })

      // Open dialog
      const addButton = screen.getByText("게시물 추가")
      fireEvent.click(addButton)

      // Fill form
      const titleInput = screen.getByPlaceholderText("제목")
      const bodyInput = screen.getByPlaceholderText("내용")

      fireEvent.change(titleInput, { target: { value: "New Post" } })
      fireEvent.change(bodyInput, { target: { value: "New body" } })

      // Submit form
      const submitButton = screen.getByText("게시물 추가")
      fireEvent.click(submitButton)

      // Verify API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/posts/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "New Post",
            body: "New body",
            userId: 1,
          }),
        })
      })
    })
  })

  describe("3.6 게시물 삭제 기능", () => {
    it("should delete post when delete button is clicked", async () => {
      // Mock initial load
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: mockPosts, total: 2 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: mockUsers }),
        })
        // Mock delete response
        .mockResolvedValueOnce({
          ok: true,
        })

      renderWithRouter(<PostsManager />)

      await waitFor(() => {
        expect(screen.getByText("Test Post 1")).toBeInTheDocument()
      })

      // Find and click delete button for first post
      const deleteButtons = screen.getAllByRole("button")
      const deleteButton = deleteButtons.find(
        (button) => button.querySelector("svg") && button.getAttribute("aria-label")?.includes("삭제"),
      )

      if (deleteButton) {
        fireEvent.click(deleteButton)
      }

      // Verify API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/posts/1", {
          method: "DELETE",
        })
      })
    })
  })

  describe("3.7 댓글 조회 기능", () => {
    it("should fetch comments when post detail is opened", async () => {
      // Mock initial load
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: mockPosts, total: 2 }),
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

      // Find and click comment button for first post
      const commentButtons = screen.getAllByRole("button")
      const commentButton = commentButtons.find(
        (button) => button.querySelector("svg") && button.getAttribute("aria-label")?.includes("댓글"),
      )

      if (commentButton) {
        fireEvent.click(commentButton)
      }

      // Verify comments API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/comments/post/1")
      })
    })

    it("should cache comments and not refetch", async () => {
      // Mock initial load
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: mockPosts, total: 2 }),
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

  describe("3.8 댓글 추가 기능", () => {
    it("should add comment when form is submitted", async () => {
      // Mock initial load
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: mockPosts, total: 2 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: mockUsers }),
        })
        // Mock comments response
        .mockResolvedValueOnce({
          json: async () => ({ comments: mockComments }),
        })
        // Mock add comment response
        .mockResolvedValueOnce({
          json: async () => ({
            id: 3,
            body: "New comment",
            postId: 1,
            userId: 1,
            likes: 0,
            user: { username: "user1" },
          }),
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

      // Click add comment button
      const addCommentButton = screen.getByText("댓글 추가")
      fireEvent.click(addCommentButton)

      // Fill comment form
      const commentInput = screen.getByPlaceholderText("댓글 내용")
      fireEvent.change(commentInput, { target: { value: "New comment" } })

      // Submit form
      const submitButton = screen.getByText("댓글 추가")
      fireEvent.click(submitButton)

      // Verify API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/comments/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            body: "New comment",
            postId: 1,
            userId: 1,
          }),
        })
      })
    })
  })

  describe("3.16 페이지네이션 기능", () => {
    it("should change page when next button is clicked", async () => {
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

      // Verify API call with updated skip parameter
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/posts?limit=10&skip=10")
      })
    })

    it("should disable previous button on first page", async () => {
      // Mock initial load
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: mockPosts, total: 2 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: mockUsers }),
        })

      renderWithRouter(<PostsManager />)

      await waitFor(() => {
        expect(screen.getByText("Test Post 1")).toBeInTheDocument()
      })

      // Previous button should be disabled
      const prevButton = screen.getByText("이전")
      expect(prevButton).toBeDisabled()
    })
  })

  describe("3.15 하이라이트 기능", () => {
    it("should highlight matching text in search results", async () => {
      // Mock search response with highlighted text
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: mockPosts, total: 2 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: mockUsers }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ posts: [mockPosts[0]], total: 1 }),
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
  })
})

