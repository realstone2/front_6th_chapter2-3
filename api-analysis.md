# API 분석 및 TanStack Query 분리 계획

## 현재 사용 중인 API 목록 (도메인별 분리)

### 1. Post 도메인 API

#### 게시물 조회

- `GET /api/posts?limit=${limit}&skip=${skip}` - 게시물 목록 조회 (페이지네이션)
- `GET /api/posts/search?q=${searchQuery}` - 게시물 검색
- `GET /api/posts/tag/${tag}` - 태그별 게시물 조회
- `GET /api/posts/tags` - 모든 태그 조회

#### 게시물 CRUD

- `POST /api/posts/add` - 게시물 생성
- `PUT /api/posts/${id}` - 게시물 수정
- `DELETE /api/posts/${id}` - 게시물 삭제

### 2. User 도메인 API

#### 사용자 조회

- `GET /api/users?limit=0&select=username,image` - 사용자 목록 조회 (이름, 이미지만)
- `GET /api/users/${id}` - 특정 사용자 상세 정보 조회

### 3. Comment 도메인 API

#### 댓글 조회

- `GET /api/comments/post/${postId}` - 특정 게시물의 댓글 목록 조회

#### 댓글 CRUD

- `POST /api/comments/add` - 댓글 생성
- `PUT /api/comments/${id}` - 댓글 수정
- `DELETE /api/comments/${id}` - 댓글 삭제
- `PATCH /api/comments/${id}` - 댓글 좋아요 (likes 업데이트)

## TanStack Query 분리 계획

### 1. Post 도메인 Queries

```typescript
// src/entities/post/api/queries.ts
- usePosts(limit, skip) - 게시물 목록 조회
- useSearchPosts(query) - 게시물 검색
- usePostsByTag(tag) - 태그별 게시물 조회
- useTags() - 태그 목록 조회
- useCreatePost() - 게시물 생성 mutation
- useUpdatePost() - 게시물 수정 mutation
- useDeletePost() - 게시물 삭제 mutation
```

### 2. User 도메인 Queries

```typescript
// src/entities/user/api/queries.ts
- useUsers() - 사용자 목록 조회 (이름, 이미지만)
- useUser(id) - 특정 사용자 상세 정보 조회
```

### 3. Comment 도메인 Queries

```typescript
// src/entities/comment/api/queries.ts
- useComments(postId) - 특정 게시물의 댓글 목록 조회
- useCreateComment() - 댓글 생성 mutation
- useUpdateComment() - 댓글 수정 mutation
- useDeleteComment() - 댓글 삭제 mutation
- useLikeComment() - 댓글 좋아요 mutation
```

## 현재 API 호출 패턴 분석

### 1. 데이터 의존성

- 게시물 조회 후 사용자 정보 병합
- 게시물 상세 조회 시 댓글 정보 함께 로드
- 사용자 모달에서 상세 정보 조회

### 2. 캐싱 전략 고려사항

- 게시물 목록과 상세 정보 분리 캐싱
- 사용자 정보 캐싱 (자주 조회됨)
- 댓글은 게시물별로 캐싱
- 태그 정보는 자주 변경되지 않으므로 긴 캐싱 시간

### 3. 무효화 전략

- 게시물 생성/수정/삭제 시 게시물 목록 캐시 무효화
- 댓글 변경 시 해당 게시물의 댓글 캐시 무효화
- 사용자 정보 변경 시 사용자 캐시 무효화

## 구현 우선순위

1. **1단계**: Post 도메인 API 분리
2. **2단계**: User 도메인 API 분리
3. **3단계**: Comment 도메인 API 분리
4. **4단계**: 컴포넌트에서 TanStack Query 적용
5. **5단계**: 캐싱 및 무효화 전략 최적화
