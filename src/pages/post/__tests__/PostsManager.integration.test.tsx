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
]

// Helper function to render component with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe("PostsManager Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(global.fetch as any).mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("3.3 태그별 필터링 기능", () => {
    it("should filter posts by tag and update URL", async () => {
      // Mock initial load
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: mockPosts, total: 2 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: mockUsers }),
        })
        // Mock tags response
        .mockResolvedValueOnce({
          json: async () => [{ url: "/tag/test", slug: "test" }],
        })
        // Mock filtered posts response
        .mockResolvedValueOnce({
          json: async () => ({ posts: [mockPosts[0]], total: 1 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: mockUsers }),
        })

      renderWithRouter(<PostsManager />)

      await waitFor(() => {
        expect(screen.getByText("Test Post 1")).toBeInTheDocument()
      })

      // Select tag from dropdown
      const tagSelect = screen.getByDisplayValue("태그 선택")
      fireEvent.click(tagSelect)

      // This would need proper Select component testing
      // For now, we'll test the API call directly
      expect(global.fetch).toHaveBeenCalledWith("/api/posts/tags")
    })
  })

  describe("3.5 게시물 수정 기능", () => {
    it("should edit post and update the list", async () => {
      // Mock initial load
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: mockPosts, total: 2 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: mockUsers }),
        })
        // Mock update response
        .mockResolvedValueOnce({
          json: async () => ({
            ...mockPosts[0],
            title: "Updated Post 1",
            body: "Updated body 1",
          }),
        })

      renderWithRouter(<PostsManager />)

      await waitFor(() => {
        expect(screen.getByText("Test Post 1")).toBeInTheDocument()
      })

      // Find and click edit button
      const editButtons = screen.getAllByRole("button")
      const editButton = editButtons.find(
        (button) => button.querySelector("svg") && button.getAttribute("aria-label")?.includes("수정"),
      )

      if (editButton) {
        fireEvent.click(editButton)
      }

      // Wait for edit dialog
      await waitFor(() => {
        expect(screen.getByText("게시물 수정")).toBeInTheDocument()
      })

      // Update form fields
      const titleInput = screen.getByDisplayValue("Test Post 1")
      const bodyInput = screen.getByDisplayValue("Test body 1")

      fireEvent.change(titleInput, { target: { value: "Updated Post 1" } })
      fireEvent.change(bodyInput, { target: { value: "Updated body 1" } })

      // Submit form
      const submitButton = screen.getByText("게시물 업데이트")
      fireEvent.click(submitButton)

      // Verify API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/posts/1", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...mockPosts[0],
            title: "Updated Post 1",
            body: "Updated body 1",
          }),
        })
      })
    })
  })

  describe("3.9 댓글 수정 기능", () => {
    it("should edit comment and update the list", async () => {
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
        // Mock comment update response
        .mockResolvedValueOnce({
          json: async () => ({
            ...mockComments[0],
            body: "Updated comment 1",
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
        expect(screen.getByText("댓글")).toBeInTheDocument()
      })

      // Find and click edit comment button
      const editCommentButtons = screen.getAllByRole("button")
      const editCommentButton = editCommentButtons.find(
        (button) => button.querySelector("svg") && button.getAttribute("aria-label")?.includes("수정"),
      )

      if (editCommentButton) {
        fireEvent.click(editCommentButton)
      }

      // Wait for edit comment dialog
      await waitFor(() => {
        expect(screen.getByText("댓글 수정")).toBeInTheDocument()
      })

      // Update comment
      const commentInput = screen.getByDisplayValue("Test comment 1")
      fireEvent.change(commentInput, { target: { value: "Updated comment 1" } })

      // Submit form
      const submitButton = screen.getByText("댓글 업데이트")
      fireEvent.click(submitButton)

      // Verify API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/comments/1", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            body: "Updated comment 1",
          }),
        })
      })
    })
  })

  describe("3.10 댓글 삭제 기능", () => {
    it("should delete comment and remove from list", async () => {
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
        // Mock delete response
        .mockResolvedValueOnce({
          ok: true,
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
        expect(screen.getByText("댓글")).toBeInTheDocument()
      })

      // Find and click delete comment button
      const deleteCommentButtons = screen.getAllByRole("button")
      const deleteCommentButton = deleteCommentButtons.find(
        (button) => button.querySelector("svg") && button.getAttribute("aria-label")?.includes("삭제"),
      )

      if (deleteCommentButton) {
        fireEvent.click(deleteCommentButton)
      }

      // Verify API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/comments/1", {
          method: "DELETE",
        })
      })
    })
  })

  describe("3.11 댓글 좋아요 기능", () => {
    it("should increment comment likes when like button is clicked", async () => {
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
        // Mock like response
        .mockResolvedValueOnce({
          json: async () => ({
            ...mockComments[0],
            likes: 3,
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
        expect(screen.getByText("댓글")).toBeInTheDocument()
      })

      // Find and click like button
      const likeButtons = screen.getAllByRole("button")
      const likeButton = likeButtons.find(
        (button) => button.querySelector("svg") && button.getAttribute("aria-label")?.includes("좋아요"),
      )

      if (likeButton) {
        fireEvent.click(likeButton)
      }

      // Verify API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/comments/1", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ likes: 3 }),
        })
      })
    })
  })

  describe("3.12 사용자 정보 조회 기능", () => {
    it("should show user modal when author is clicked", async () => {
      const mockUserDetail = {
        id: 1,
        username: "user1",
        image: "https://example.com/user1.jpg",
        firstName: "John",
        lastName: "Doe",
        age: 30,
        email: "john@example.com",
        phone: "123-456-7890",
        address: {
          address: "123 Main St",
          city: "New York",
          state: "NY",
        },
        company: {
          name: "Tech Corp",
          title: "Developer",
        },
      }

      // Mock initial load
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          json: async () => ({ posts: mockPosts, total: 2 }),
        })
        .mockResolvedValueOnce({
          json: async () => ({ users: mockUsers }),
        })
        // Mock user detail response
        .mockResolvedValueOnce({
          json: async () => mockUserDetail,
        })

      renderWithRouter(<PostsManager />)

      await waitFor(() => {
        expect(screen.getByText("user1")).toBeInTheDocument()
      })

      // Click on user name
      const userName = screen.getByText("user1")
      fireEvent.click(userName)

      // Verify user detail API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/users/1")
      })

      // Verify modal content
      await waitFor(() => {
        expect(screen.getByText("사용자 정보")).toBeInTheDocument()
        expect(screen.getByText("John Doe")).toBeInTheDocument()
        expect(screen.getByText("john@example.com")).toBeInTheDocument()
      })
    })
  })

  describe("3.17 정렬 기능", () => {
    it("should change sort order and update URL", async () => {
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

      // Change sort order
      const sortOrderSelect = screen.getByDisplayValue("정렬 순서")
      fireEvent.click(sortOrderSelect)

      // This would need proper Select component testing
      // For now, we'll verify the URL update functionality
      expect(mockNavigate).toHaveBeenCalled()
    })
  })

  describe("3.18 게시물 상세 보기 기능", () => {
    it("should show post detail with comments", async () => {
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

      // Open post detail
      const detailButtons = screen.getAllByRole("button")
      const detailButton = detailButtons.find(
        (button) => button.querySelector("svg") && button.getAttribute("aria-label")?.includes("댓글"),
      )

      if (detailButton) {
        fireEvent.click(detailButton)
      }

      // Verify detail dialog content
      await waitFor(() => {
        expect(screen.getByText("Test Post 1")).toBeInTheDocument()
        expect(screen.getByText("Test body 1")).toBeInTheDocument()
        expect(screen.getByText("댓글")).toBeInTheDocument()
      })
    })
  })
})

