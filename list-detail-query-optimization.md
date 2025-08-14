# 리스트 쿼리와 단건 쿼리 관리 최적화

## 문제 상황

### 기존 문제점

- `useMutation`을 사용할 때 낙관적 업데이트나 detail invalidate 시킬 때
- 리스트에서도 수정 내용이 반영되려면 리스트를 전부 다시 불러오거나 단건을 직접 수정해야 함
- 리스트를 불러오는 것은 비효율적
- 매번 찾아서 리스트 중에서 해당 데이터를 수정하는 것은 비효율적

### 고민 포인트

1. **성능 문제**: 전체 리스트 재요청은 불필요한 네트워크 비용
2. **복잡성**: 리스트에서 특정 아이템을 찾아 수정하는 로직이 복잡
3. **일관성**: 리스트와 단건 데이터 간의 동기화 문제
4. **유지보수성**: 매번 수동으로 데이터를 찾아 수정하는 코드의 반복

## 해결 과정

### 1단계: 문제 분석

현재 프로젝트에서 TanStack Query를 사용하고 있었지만, 리스트와 단건 쿼리 간의 효율적인 동기화가 이루어지지 않고 있었음.

### 2단계: 해결 방안 탐색

여러 가지 접근 방식을 고려했음:

1. **기존 방식**: 리스트 전체 재요청 또는 수동 데이터 수정
2. **Normalized Cache**: 리스트에는 ID만 저장하고 UI에서 단건 쿼리 사용
3. **통합된 쿼리 키 구조**: 단건과 리스트 간의 연관성을 명확히 표현
4. **커스텀 훅으로 캐시 동기화**: 중앙화된 동기화 로직

### 3단계: 최적 해결책 선택

**Normalized Cache 패턴**을 선택한 이유:

- 데이터 중복 제거
- 캐시 업데이트 단순화
- 성능 향상
- 일관성 보장

### 4단계: 구현 방식 결정

- 리스트에서는 ID 리스트만 제공
- UI에서는 ID를 이용해 detail 쿼리만 사용
- `setQueriesData`는 detail만 시켜주기
- `queryFn` 내부에서 모든 데이터를 조합해서 캐시에 저장

## 리팩토링 결과물

### 1. 쿼리 키 구조 개선

```typescript:src/entities/post/api/query-keys.ts
import { GetPostQuery } from "../model/types"

// Query Keys
export const postQueryKeys = {
  all: ["posts"] as const,
  lists: () => [...postQueryKeys.all, "list"] as const,
  list: (query: GetPostQuery) => [...postQueryKeys.lists(), query],
  details: () => [...postQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...postQueryKeys.details(), id] as const,
}
```

### 2. 개선된 리스트 조회 훅

```typescript:src/widgets/post-list/api/hooks/use-get-post-list.ts
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { postQueryKeys } from "../../../../entities/post/api/query-keys"
import { getPosts, getPostsByTag, searchPosts } from "../../../../entities/post/api/services"
import { GetPostQuery } from "../../../../entities/post/model/types"

// 게시물 목록 조회 (ID만 반환하고 단건 데이터는 캐시에 저장)
export const useGetPosts = (query: GetPostQuery) => {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: postQueryKeys.list(query),
    queryFn: async () => {
      // 1. 포스트 리스트 조회
      let postsResponse

      if (query.tag) {
        postsResponse = await getPostsByTag(query.tag)
      } else if (query.q) {
        postsResponse = await searchPosts(query)
      } else {
        postsResponse = await getPosts(query)
      }

      // 2. 각 포스트를 단건 캐시에 저장
      postsResponse.posts.forEach(post => {
        queryClient.setQueryData(
          postQueryKeys.detail(post.id),
          post
        )
      })

      // 3. ID만 반환 (실제 데이터는 캐시에 저장됨)
      return {
        posts: postsResponse.posts.map(post => ({ id: post.id })),
        total: postsResponse.total
      }
    },
  })
}
```

### 3. 단건 조회 훅 (캐시된 데이터만 사용)

```typescript:src/entities/post/api/hooks/use-get-post-detail.ts
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { postQueryKeys } from "../query-keys"
import { Post } from "../model/types"

export const useGetPostDetail = (id: number) => {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: postQueryKeys.detail(id),
    queryFn: () => {
      // 캐시에서 직접 데이터 가져오기
      const cachedData = queryClient.getQueryData<Post>(postQueryKeys.detail(id))

      if (!cachedData) {
        return null
      }

      return cachedData
    },
    enabled: !!id,
    // 캐시된 데이터만 사용
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  })
}
```

### 4. 개선된 Mutation 훅들

```typescript:src/features/post/api/hooks/use-update-post-mutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { UpdatePostRequest, Post } from "../../../../entities/post/model/types"
import { updatePost } from "../services"
import { postQueryKeys } from "../../../../entities/post/api/query-keys"

// 게시물 수정 Mutation
export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePostRequest }) =>
      updatePost(id, data),
    onSuccess: (updatedPost: Post) => {
      // 단건 캐시만 업데이트
      queryClient.setQueryData(
        postQueryKeys.detail(updatedPost.id),
        updatedPost
      )
    },
  })
}
```

```typescript:src/features/post/api/hooks/use-create-post-mutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CreatePostRequest, Post } from "../../../../entities/post/model/types"
import { createPost } from "../services"
import { postQueryKeys } from "../../../../entities/post/api/query-keys"

// 게시물 생성 Mutation
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePostRequest) => createPost(data),
    onSuccess: (newPost: Post) => {
      // 새 포스트를 단건 캐시에 저장
      queryClient.setQueryData(
        postQueryKeys.detail(newPost.id),
        newPost
      )

      // 리스트 캐시 무효화 (새 포스트가 추가되었으므로)
      queryClient.invalidateQueries({
        queryKey: postQueryKeys.lists()
      })
    },
  })
}
```

```typescript:src/features/post/api/hooks/use-delete-post-mutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deletePost } from "../services"
import { postQueryKeys } from "../../../../entities/post/api/query-keys"

// 게시물 삭제 Mutation
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: (_, deletedId) => {
      // 단건 캐시에서 제거
      queryClient.removeQueries({
        queryKey: postQueryKeys.detail(deletedId)
      })

      // 리스트 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: postQueryKeys.lists()
      })
    },
  })
}
```

### 5. 사용 예시 컴포넌트

```typescript:src/widgets/post-list/ui/PostRow.tsx
import { useGetPostDetail } from "../../../../entities/post/api/hooks/use-get-post-detail"

interface PostRowProps {
  postId: number
}

export const PostRow = ({ postId }: PostRowProps) => {
  const { data: post, isLoading } = useGetPostDetail(postId)

  if (isLoading) return <div>로딩중...</div>
  if (!post) return <div>데이터를 찾을 수 없습니다. 리스트를 먼저 로드해주세요.</div>

  return (
    <div>
      <h3>{post.title}</h3>
      <p>{post.body}</p>
      <div>작성자 ID: {post.userId}</div>
    </div>
  )
}
```

## 최종 개선 효과

### 성능 향상

- ✅ 전체 리스트 재요청 제거
- ✅ 불필요한 네트워크 요청 최소화
- ✅ 캐시 활용도 극대화

### 개발 경험 개선

- ✅ 단순한 캐시 업데이트 로직
- ✅ 일관된 데이터 구조
- ✅ 타입 안전성 보장

### 유지보수성 향상

- ✅ 중앙화된 데이터 관리
- ✅ 명확한 책임 분리
- ✅ 확장 가능한 구조

### 사용자 경험 개선

- ✅ 즉각적인 UI 업데이트
- ✅ 부드러운 인터랙션
- ✅ 일관된 데이터 표시

## 핵심 아이디어

### Normalized Cache 패턴

- **리스트**: ID 리스트만 저장하여 가벼운 구조 유지
- **단건**: 완전한 데이터를 캐시에 저장하여 빠른 접근
- **동기화**: 단건 캐시만 업데이트하면 모든 곳에 자동 반영

### 데이터 흐름

1. 리스트 조회 시 → 각 아이템을 단건 캐시에 저장
2. UI 렌더링 시 → ID로 단건 캐시에서 데이터 조회
3. 데이터 수정 시 → 단건 캐시만 업데이트
4. 모든 관련 컴포넌트 → 자동으로 업데이트된 데이터 반영

이 방식을 통해 리스트와 단건 쿼리 간의 효율적인 동기화를 달성하고, 성능과 개발 경험을 모두 개선할 수 있었습니다.
