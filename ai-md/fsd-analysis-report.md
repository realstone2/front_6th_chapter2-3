# FSD 구조 분석 보고서

## 개요

현재 프로젝트의 FSD(Feature-Sliced Design) 구조를 분석하여 사용하지 않는 export 함수, 중복 선언된 함수들, 그리고 FSD 폴더 구조 위배 사항들을 식별하고 수정했습니다.

## ✅ 완료된 개선 사항

### 1. Index Slice 구조 정리 ✅

#### Entities Layer

- **Post Entity**: `src/entities/post/api/index.ts` 제거, 최상단 `index.ts`로 통합
- **User Entity**: `src/entities/user/api/index.ts` 제거, 최상단 `index.ts`로 통합
- **Comment Entity**: `src/entities/comment/api/index.ts` 제거, 최상단 `index.ts`로 통합
- **Tag Entity**: `src/entities/tag/api/index.ts` 제거, 최상단 `index.ts`로 통합

#### Import 경로 정리

모든 파일에서 entities의 api 폴더 직접 참조를 최상단 index.ts 참조로 변경:

- `src/widgets/post-dashboard/api/hooks/use-get-post-list.ts`
- `src/features/edit-comment/api/hooks/use-update-comment-mutation.ts`
- `src/widgets/post-dashboard/ui/PostFilter.tsx`
- `src/features/delete-post/api/hooks/use-delete-post-mutation.ts`
- `src/widgets/comment-list/ui/CommentsSection.tsx`
- `src/widgets/post-dashboard/ui/PostList.tsx`
- `src/features/add-comment/api/hooks/use-create-comment-mutation.ts`
- `src/features/edit-post/api/hooks/use-update-post-mutation.ts`
- `src/features/edit-post/ui/EditPostDialog.tsx`
- `src/features/like-comment/api/hooks/use-like-comment-mutation.ts`
- `src/features/add-post/api/hooks/use-create-post-mutation.ts`
- `src/features/delete-comment/api/hooks/use-delete-comment-mutation.ts`

## 2. 사용하지 않는 export 함수 제거 리스트

### 2.1 Entities Layer

#### User Entity

- **`getUser`** (src/entities/user/api/services.ts)
  - `useGetUsers` 훅에서만 사용되지만, 실제로는 `useGetUsers` 훅이 어디서도 사용되지 않음
  - **제거 권장**: `useGetUsers` 훅과 함께 제거

#### Post Entity

- **`getPosts`** (src/entities/post/api/services.ts)
  - `useGetPosts` 훅에서만 사용되며, 실제로는 사용됨
  - **유지**: 정상적으로 사용됨

#### Tag Entity

- **`getTags`** (src/entities/tag/api/services.ts)
  - `useGetTags` 훅에서만 사용되며, 실제로는 사용됨
  - **유지**: 정상적으로 사용됨

#### Comment Entity

- **`getComments`** (src/entities/comment/api/services.ts)
  - `useGetComments` 훅에서만 사용되며, 실제로는 사용됨
  - **유지**: 정상적으로 사용됨

### 2.2 Features Layer

#### Post Features

- **`deletePost`** (src/features/post/api/services.ts)
  - `useDeletePostMutation` 훅에서만 사용되지만, PostList에서 직접 호출됨
  - **문제점**: FSD 원칙 위배 - 직접 서비스 함수 호출
  - **해결방안**: `useDeletePostMutation` 훅을 사용하도록 수정

#### Comment Features

모든 comment 관련 함수들이 적절히 사용됨:

- `createComment` - `useCreateCommentMutation`에서 사용
- `updateComment` - `useUpdateCommentMutation`에서 사용
- `deleteComment` - `useDeleteCommentMutation`에서 사용
- `likeComment` - `useLikeCommentMutation`에서 사용

### 2.3 Shared Layer

모든 shared 컴포넌트들이 적절히 사용됨.

## 3. 중복으로 선언된 함수들 제거 리스트

### 3.1 Post 관련 중복

#### `useUpdatePostMutation` 중복 export

- **위치 1**: `src/features/edit-post/api/hooks/use-update-post-mutation.ts`
- **위치 2**: `src/features/post/index.ts`에서 재export
- **문제점**: 동일한 함수가 두 곳에서 export됨
- **해결방안**: `src/features/post/index.ts`에서 제거하고 직접 import 사용

### 3.2 User 관련 중복

#### `getUser` 함수 중복

- **위치 1**: `src/entities/user/api/services.ts`
- **위치 2**: `src/entities/user/api/query-keys.ts`에서 import
- **상태**: 정상적인 import 관계, 중복 아님

### 3.3 Comment 관련 중복

중복 없음 - 모든 함수가 적절히 분리되어 있음

## 4. FSD 폴더 구조에 위배되는 사항들

### 4.1 계층 간 의존성 위배

#### Widget → Feature 직접 의존성

- **문제**: `src/widgets/post-dashboard/ui/PostList.tsx`에서 `deletePost` 서비스 함수 직접 호출
- **위배 원칙**: Widget은 Feature의 서비스 함수에 직접 접근하면 안됨
- **해결방안**: `useDeletePostMutation` 훅을 사용하도록 수정

#### Widget → Entity 직접 의존성

- **문제**: `src/widgets/post-dashboard/ui/PostList.tsx`에서 `useGetUserDetail` 직접 import
- **위배 원칙**: Widget은 Entity의 API에 직접 접근하면 안됨
- **해결방안**: User Entity의 index.ts를 통해 export하거나, User 관련 로직을 Feature로 이동

### 4.2 Feature 간 의존성 위배

#### Post Feature → Edit Post Feature 의존성

- **문제**: `src/features/post/index.ts`에서 `../edit-post/api/hooks/use-update-post-mutation` import
- **위배 원칙**: Feature 간 직접 의존성
- **해결방안**: 공통 로직을 shared 또는 entities로 이동

### 4.3 잘못된 폴더 구조

#### Comment API 폴더 구조

- **현재**: `src/entities/comment/api/index.ts`가 비어있음
- **문제**: API 레이어의 index 파일이 비어있어 일관성 부족
- **해결방안**: 필요한 export 추가 또는 파일 제거 ✅ **완료**

#### Post API 폴더 구조

- **현재**: `src/entities/post/api/index.ts`에서 services, query-keys, hooks 모두 export
- **문제**: 너무 많은 것을 한 곳에서 export
- **해결방안**: 필요한 것만 선택적으로 export ✅ **완료**

### 4.4 잘못된 import 경로

#### 상대 경로 남용

- **문제**: `src/features/add-post/api/hooks/use-create-post-mutation.ts`에서 `../../../../widgets/post-dashboard/api/hooks/use-get-post-list` import
- **위배 원칙**: Feature가 Widget에 의존하면 안됨
- **해결방안**: 공통 타입을 shared로 이동

## 5. 권장 개선 사항

### 5.1 즉시 수정 필요 (높은 우선순위)

1. **PostList에서 deletePost 직접 호출 수정**

   ```typescript
   // 현재 (잘못된 방식)
   import { deletePost } from "../../../features/post/api/services"
   onClick={() => deletePost(post.id ?? 0)}

   // 수정 후 (올바른 방식)
   import { useDeletePostMutation } from "../../../features/post"
   const { mutate: deletePost } = useDeletePostMutation()
   onClick={() => deletePost(post.id ?? 0)}
   ```

2. **useUpdatePostMutation 중복 export 제거**
   - `src/features/post/index.ts`에서 `useUpdatePostMutation` export 제거

3. **PostList에서 useGetUserDetail 직접 import 수정**
   - User 관련 로직을 Feature로 이동하거나 Entity index를 통해 접근

### 5.2 중기 개선 사항 (중간 우선순위)

1. **Comment API index.ts 정리** ✅ **완료**
   - 필요한 export 추가 또는 파일 제거

2. **Post API index.ts 정리** ✅ **완료**
   - 필요한 export만 선택적으로 유지

3. **Feature 간 의존성 제거**
   - 공통 로직을 shared 또는 entities로 이동

### 5.3 장기 개선 사항 (낮은 우선순위)

1. **상대 경로 정리**
   - 절대 경로 사용 또는 alias 설정

2. **타입 정의 개선**
   - 공통 타입을 shared로 이동

## 6. FSD 원칙 준수 체크리스트

### 6.1 계층별 의존성 규칙

- [x] App → Pages → Widgets → Features → Entities → Shared (올바른 방향)
- [ ] Widgets → Features (위배 사례 발견)
- [ ] Widgets → Entities (위배 사례 발견)

### 6.2 단일 책임 원칙

- [x] 각 Feature가 하나의 사용자 행동에 집중
- [x] 각 Entity가 하나의 도메인에 집중
- [x] 각 Widget이 하나의 화면 영역에 집중

### 6.3 관심사 분리

- [x] API 로직이 적절히 분리됨
- [x] UI 컴포넌트가 적절히 분리됨
- [x] 비즈니스 로직이 적절히 분리됨

### 6.4 Index Slice 구조

- [x] 각 slice의 최상단에 하나의 index.ts만 존재 ✅ **완료**
- [x] 중복된 api/index.ts 파일들 제거 ✅ **완료**
- [x] Import 경로 정리 ✅ **완료**

## 7. 결론

현재 프로젝트는 전반적으로 FSD 구조를 잘 따르고 있으며, **Index Slice 구조 정리 작업이 완료**되었습니다.

### 완료된 주요 개선사항:

1. ✅ **Entities Layer**: 모든 api/index.ts 파일 제거, 최상단 index.ts로 통합
2. ✅ **Import 경로 정리**: 모든 파일에서 entities의 최상단 index.ts 참조로 변경
3. ✅ **중복 export 제거**: api 폴더의 중복된 index 파일들 제거

### 남은 개선사항:

1. **Widget → Feature/Entity 직접 의존성 해결**
2. **Feature 간 의존성 제거**
3. **상대 경로 정리**

이러한 수정을 통해 더 견고하고 유지보수하기 쉬운 FSD 아키텍처를 구축할 수 있었습니다.
