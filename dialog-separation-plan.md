# Dialog 분리 계획

## 1. 분리해야 할 Dialog 목록

현재 `src/pages/post/index.tsx`에서 인라인으로 구현된 Dialog들을 분석한 결과:

### 1.1 게시물 관련 Dialog

- ✅ **AddPostDialog** (이미 분리됨) - `src/features/add-post/ui/AddPostDialog.tsx`
- 🔄 **EditPostDialog** (분리 필요) - 게시물 수정 Dialog
- 📋 **PostDetailDialog** (이미 존재) - `src/widgets/post-dashboard/ui/PostDetailDialog.tsx`

### 1.2 댓글 관련 Dialog

- 🔄 **AddCommentDialog** (분리 필요) - 댓글 추가 Dialog
- 🔄 **EditCommentDialog** (분리 필요) - 댓글 수정 Dialog

### 1.3 사용자 관련 Dialog

- 🔄 **UserDetailDialog** (분리 필요) - 사용자 정보 표시 Dialog

## 2. FSD 폴더 구조별 배치 계획

### 2.1 Features 레이어 (비즈니스 로직이 있는 Dialog)

#### `src/features/edit-post/ui/EditPostDialog.tsx`

```typescript
// 게시물 수정 기능
- 게시물 제목/내용 수정
- useUpdatePostMutation 사용
- 게시물 수정 후 상태 업데이트
```

#### `src/features/add-comment/ui/AddCommentDialog.tsx`

```typescript
// 댓글 추가 기능
- 댓글 내용 입력
- 댓글 추가 API 호출
- 댓글 목록 상태 업데이트
```

#### `src/features/edit-comment/ui/EditCommentDialog.tsx`

```typescript
// 댓글 수정 기능
- 댓글 내용 수정
- 댓글 업데이트 API 호출
- 댓글 목록 상태 업데이트
```

### 2.2 Entities 레이어 (순수 데이터 표시 Dialog)

#### `src/entities/user/ui/UserDetailDialog.tsx`

```typescript
// 사용자 정보 표시 (읽기 전용)
- 사용자 프로필 이미지
- 사용자 상세 정보 표시
- 주소, 회사 정보 등
```

## 3. 도메인별 분리 상세 계획

### 3.1 Post 도메인

#### 기존 구조

```
src/features/add-post/
├── api/
│   ├── hooks/
│   │   └── use-create-post-mutation.ts
│   └── services.ts
└── ui/
    └── AddPostDialog.tsx ✅
```

#### 추가할 구조

```
src/features/edit-post/
├── api/
│   ├── hooks/
│   │   └── use-update-post-mutation.ts ✅
│   └── services.ts ✅
└── ui/
    └── EditPostDialog.tsx 🔄 (생성 필요)
```

### 3.2 Comment 도메인

#### 기존 구조

```
src/features/comment/
├── api/
│   ├── hooks/
│   │   ├── use-delete-comments-mutation.ts ✅
│   │   ├── use-like-comment-mutation.ts ✅
│   │   ├── use-post-comments-mutation.ts ✅
│   │   └── use-update-comments-mutation.ts ✅
│   └── services.ts ✅
└── index.ts ✅
```

#### 새로운 구조 (Feature 단위로 분리)

```
src/features/add-comment/
├── api/
│   ├── hooks/
│   │   └── use-create-comment-mutation.ts 🔄 (생성 필요)
│   └── services.ts 🔄 (생성 필요)
└── ui/
    └── AddCommentDialog.tsx 🔄 (생성 필요)
```

```
src/features/edit-comment/
├── api/
│   ├── hooks/
│   │   └── use-update-comment-mutation.ts 🔄 (생성 필요)
│   └── services.ts 🔄 (생성 필요)
└── ui/
    └── EditCommentDialog.tsx 🔄 (생성 필요)
```

```
src/features/delete-comment/
├── api/
│   ├── hooks/
│   │   └── use-delete-comment-mutation.ts 🔄 (기존 이동)
│   └── services.ts 🔄 (기존 이동)
└── ui/
    └── DeleteCommentButton.tsx 🔄 (생성 필요)
```

```
src/features/like-comment/
├── api/
│   ├── hooks/
│   │   └── use-like-comment-mutation.ts 🔄 (기존 이동)
│   └── services.ts 🔄 (기존 이동)
└── ui/
    └── LikeCommentButton.tsx 🔄 (생성 필요)
```

### 3.3 User 도메인

#### 기존 구조

```
src/entities/user/
├── api/
│   ├── hooks/
│   │   ├── use-get-user-detail.ts ✅
│   │   └── use-get-users.ts ✅
│   ├── index.ts ✅
│   ├── query-keys.ts ✅
│   └── services.ts ✅
├── index.ts ✅
└── model/
    └── types.ts ✅
```

#### 추가할 구조

```
src/entities/user/
├── api/ ✅ (기존)
├── model/ ✅ (기존)
└── ui/
    └── UserDetailDialog.tsx 🔄 (생성 필요)
```

## 4. 구현 우선순위

### 4.1 1단계: Post 도메인 완성

1. `EditPostDialog.tsx` 생성
2. `src/pages/post/index.tsx`에서 EditPostDialog import 및 사용

### 4.2 2단계: Comment 도메인 완성

1. `add-comment` feature 생성
   - `AddCommentDialog.tsx` 생성
   - `use-create-comment-mutation.ts` 생성
   - `services.ts` 생성
2. `edit-comment` feature 생성
   - `EditCommentDialog.tsx` 생성
   - `use-update-comment-mutation.ts` 생성
   - `services.ts` 생성
3. 기존 comment feature 리팩토링
   - `delete-comment` feature로 분리
   - `like-comment` feature로 분리
4. `src/pages/post/index.tsx`에서 Comment Dialog들 import 및 사용

### 4.3 3단계: User 도메인 완성

1. `UserDetailDialog.tsx` 생성
2. `src/pages/post/index.tsx`에서 UserDetailDialog import 및 사용

## 5. 각 Dialog의 Props 인터페이스 설계

### 5.1 EditPostDialog

```typescript
interface EditPostDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  post: Post | null
  onSuccess?: () => void
}
```

### 5.2 AddCommentDialog

```typescript
interface AddCommentDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  postId: number
  onSuccess?: (comment: Comment) => void
}
```

### 5.3 EditCommentDialog

```typescript
interface EditCommentDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  comment: Comment | null
  onSuccess?: (comment: Comment) => void
}
```

### 5.4 UserDetailDialog

```typescript
interface UserDetailDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  user: User | null
}
```

## 6. 개발 가이드라인

### 6.1 React Hook Form 사용 필수

모든 Dialog 컴포넌트는 **React Hook Form**을 사용하여 구현해야 합니다.

### 6.2 기존 모달 View 수정 금지

**⚠️ 중요: 기존 모달 View 컴포넌트의 내용은 절대 수정하지 마세요!**

- 기존 `src/pages/post/index.tsx`의 인라인 Dialog들은 그대로 유지
- 새로운 Dialog 컴포넌트는 별도로 생성
- 기존 코드와 새로운 코드의 병렬 유지
- 마이그레이션 완료 후에만 기존 코드 제거

#### 참고 예시: `AddPostDialog.tsx`

```typescript
import { useForm } from "react-hook-form"

const AddPostForm = React.memo(function AddPostForm({ setIsOpen }: { setIsOpen: (open: boolean) => void }) {
  const { mutate: addPost } = useCreatePostMutation()
  const { register, handleSubmit } = useForm<CreatePostRequest>()

  const onSubmit = (data: CreatePostRequest) => {
    setIsOpen(false)
    addPost(data)
  }

  return (
    <div className="space-y-4">
      <Input placeholder="제목" {...register("title")} />
      <Textarea rows={30} placeholder="내용" {...register("body")} />
      <Input type="number" placeholder="사용자 ID" {...register("userId")} />
      <Button onClick={handleSubmit(onSubmit)}>게시물 추가</Button>
    </div>
  )
})
```

#### 구현 패턴

1. **Dialog 컴포넌트**: Dialog 래퍼와 상태 관리
2. **Form 컴포넌트**: React Hook Form을 사용한 폼 로직
3. **분리된 책임**: UI와 로직의 명확한 분리

### 6.3 컴포넌트 구조 가이드

```typescript
// 1. Dialog 래퍼 컴포넌트
export const SomeDialog = React.memo(function SomeDialog({ isOpen, setIsOpen, ...props }) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>제목</Dialog.Title>
        </Dialog.Header>
        <SomeForm setIsOpen={setIsOpen} {...props} />
      </Dialog.Content>
    </Dialog>
  )
})

// 2. Form 컴포넌트 (React Hook Form 사용)
const SomeForm = React.memo(function SomeForm({ setIsOpen, ...props }) {
  const { mutate } = useSomeMutation()
  const { register, handleSubmit } = useForm<SomeRequestType>()

  const onSubmit = (data: SomeRequestType) => {
    setIsOpen(false)
    mutate(data)
  }

  return (
    <div className="space-y-4">
      <Input {...register("fieldName")} />
      <Button onClick={handleSubmit(onSubmit)}>제출</Button>
    </div>
  )
})
```

## 7. 마이그레이션 원칙

### 7.1 안전한 마이그레이션 가이드라인

1. **기존 코드 보존**: 기존 인라인 Dialog들은 그대로 유지
2. **새로운 컴포넌트 생성**: 새로운 Dialog는 별도 파일로 생성
3. **병렬 개발**: 기존과 새로운 코드를 동시에 유지
4. **점진적 전환**: 하나씩 완성 후 기존 코드 제거
5. **테스트 우선**: 각 단계마다 기능 검증

### 7.2 개발 순서

1. 새로운 Dialog 컴포넌트 생성 및 테스트
2. 기존 페이지에서 새로운 Dialog import 및 사용
3. 기능 검증 완료 후 기존 인라인 Dialog 제거
4. 다음 Dialog로 진행

## 8. 마이그레이션 체크리스트

### 8.1 Post 도메인

- [x] EditPostDialog 컴포넌트 생성
- [x] EditPostDialog의 index.ts 파일 생성

### 8.2 Comment 도메인 (Feature 단위 분리)

- [x] `src/features/add-comment/` 폴더 생성
- [x] `src/features/edit-comment/` 폴더 생성
- [x] `src/features/delete-comment/` 폴더 생성
- [x] `src/features/like-comment/` 폴더 생성
- [x] AddCommentDialog 컴포넌트 생성
- [x] EditCommentDialog 컴포넌트 생성
- [x] DeleteCommentButton 컴포넌트 생성
- [x] LikeCommentButton 컴포넌트 생성
- [x] 각 feature의 API hooks 및 services 이동/생성
- [x] 각 feature의 index.ts 파일 생성

### 8.3 User 도메인

- [x] UserDetailDialog 컴포넌트 생성
- [x] UserDetailDialog의 index.ts 파일 생성

### 8.4 통합 작업

- [x] src/pages/post/index.tsx에서 인라인 Dialog 제거
- [x] src/pages/post/index.tsx에서 새로운 Dialog import
- [x] 상태 관리 로직 Dialog 내부로 이동
- [ ] 테스트 및 검증
- [ ] 불필요한 import 정리
- [ ] 기존 comment feature 폴더 정리

## 9. 예상 효과

### 9.1 코드 품질 향상

- 단일 책임 원칙 준수
- 재사용성 증가
- 테스트 용이성 향상

### 9.2 유지보수성 향상

- 각 Dialog의 독립적인 수정 가능
- 기능별 명확한 분리
- 디버깅 용이성 증가

### 9.3 FSD 아키텍처 준수

- 도메인별 명확한 분리
- 레이어별 책임 분리
- 확장성 향상

### 9.4 Feature 단위 분리의 장점

- 각 기능의 독립적인 개발/배포 가능
- 기능별 명확한 경계
- 코드 재사용성 극대화
- 팀 협업 시 충돌 최소화
