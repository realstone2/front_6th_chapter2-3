# TypeScript 에러 분석 및 해결 방안

## 개요

현재 프로젝트에서 발견된 TypeScript 에러들을 분석하고 해결 방안을 제시합니다.

## 에러 분류 및 분석

### 1. 컴포넌트 타입 정의 문제 (src/components/index.tsx)

#### 1.1 forwardRef 타입 정의 누락

**에러 유형**: `Type 'ForwardedRef<unknown>' is not assignable to type 'Ref<HTMLDivElement>'`

**문제점**:

- `forwardRef` 컴포넌트들이 제네릭 타입을 명시하지 않음
- `unknown` 타입으로 추론되어 HTML 요소의 ref와 호환되지 않음

**영향받는 컴포넌트들**:

- `SelectContent` (라인 114)
- `SelectItem` (라인 125, 127)
- `DialogContent` (라인 147, 151)
- `DialogTitle` (라인 170, 172)
- `Table` (라인 180, 182)
- `TableHeader` (라인 187, 188)
- `TableBody` (라인 192, 193)
- `TableRow` (라인 197, 199)
- `TableHead` (라인 206, 208)
- `TableCell` (라인 215, 216)

#### 1.2 Props 인터페이스 누락

**에러 유형**: `Property 'className' does not exist on type '{}'`

**문제점**:

- 컴포넌트 props에 대한 타입 정의가 없음
- `className`, `children` 등의 props가 타입 체크되지 않음

**영향받는 컴포넌트들**:

- `SelectItem` (라인 125)
- `DialogContent` (라인 147)
- `DialogHeader` (라인 165)
- `DialogTitle` (라인 170)
- `Table` (라인 180)
- `TableHeader` (라인 187)
- `TableBody` (라인 192)
- `TableRow` (라인 197)
- `TableHead` (라인 206)
- `TableCell` (라인 215)

### 2. 데이터 타입 정의 문제 (src/pages/PostsManagerPage.tsx)

#### 2.1 암시적 any 타입

**에러 유형**: `Variable 'postsData' implicitly has type 'any'`

**문제점**:

- API 응답 데이터에 대한 타입 정의가 없음
- 변수들이 `any` 타입으로 추론됨

**영향받는 변수들**:

- `postsData` (라인 73)
- `usersData` (라인 74)

#### 2.2 함수 매개변수 타입 누락

**에러 유형**: `Parameter 'tag' implicitly has an 'any' type`

**문제점**:

- 함수 매개변수에 타입 정의가 없음
- 콜백 함수의 매개변수도 타입이 명시되지 않음

**영향받는 함수들**:

- `fetchPostsByTag` (라인 130)
- `deletePost` (라인 191)
- `fetchComments` (라인 203)
- `deleteComment` (라인 254)
- `likeComment` (라인 269)
- `openPostDetail` (라인 288)
- `openUserModal` (라인 295)
- `renderComments` (라인 425)

#### 2.3 상태 타입 정의 문제

**에러 유형**: `Type 'any' is not assignable to type 'never[]'`

**문제점**:

- `useState`의 제네릭 타입이 명시되지 않아 `never[]`로 추론됨
- 배열 상태들이 올바른 타입을 가지지 못함

**영향받는 상태들**:

- `posts` (라인 25)
- `tags` (라인 35)
- `comments` (라인 37)

### 3. CSS 모듈 문제

#### 3.1 CSS 파일 import 오류

**에러 유형**: `Cannot find module './index.css'`

**문제점**:

- `src/main.tsx`에서 CSS 파일을 import할 수 없음
- 파일 경로나 파일 존재 여부 문제

### 4. 컴포넌트 Props 전달 문제

#### 4.1 children prop 타입 오류

**에러 유형**: `Property 'children' does not exist on type 'IntrinsicAttributes & RefAttributes<unknown>'`

**문제점**:

- 컴포넌트들이 children prop을 받을 수 있도록 타입이 정의되지 않음
- JSX에서 children을 전달할 때 타입 오류 발생

## 해결 방안

### 1. 컴포넌트 타입 정의 개선

#### 1.1 forwardRef 제네릭 타입 추가

```typescript
// 예시: SelectContent 컴포넌트
export const SelectContent = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => {
  // 컴포넌트 구현
})
```

#### 1.2 Props 인터페이스 정의

```typescript
interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  className?: string
  children?: React.ReactNode
}

export const SelectItem = forwardRef<React.ElementRef<typeof SelectPrimitive.Item>, SelectItemProps>(
  ({ className, children, ...props }, ref) => {
    // 컴포넌트 구현
  },
)
```

### 2. 데이터 타입 정의

#### 2.1 API 응답 타입 정의

```typescript
interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags?: string[]
  reactions?: {
    likes: number
    dislikes: number
  }
  author?: User
}

interface User {
  id: number
  username: string
  image: string
  firstName: string
  lastName: string
  age: number
  email: string
  phone: string
  address: {
    address: string
    city: string
    state: string
  }
  company: {
    name: string
    title: string
  }
}

interface Comment {
  id: number
  body: string
  postId: number
  userId: number
  likes: number
}
```

#### 2.2 상태 타입 명시

```typescript
const [posts, setPosts] = useState<Post[]>([])
const [tags, setTags] = useState<string[]>([])
const [comments, setComments] = useState<Record<number, Comment[]>>({})
```

### 3. 함수 매개변수 타입 정의

```typescript
const fetchPostsByTag = async (tag: string) => {
  // 함수 구현
}

const deletePost = async (id: number) => {
  // 함수 구현
}

const fetchComments = async (postId: number) => {
  // 함수 구현
}
```

### 4. CSS 파일 문제 해결

- `src/index.css` 파일이 존재하는지 확인
- 파일 경로가 올바른지 확인
- Vite 설정에서 CSS 처리 방식 확인

## 우선순위별 해결 계획

### Phase 1: 핵심 타입 정의 (높은 우선순위)

1. API 응답 데이터 타입 정의
2. 상태 변수들의 타입 명시
3. 함수 매개변수 타입 정의

### Phase 2: 컴포넌트 타입 개선 (중간 우선순위)

1. forwardRef 컴포넌트들의 제네릭 타입 추가
2. Props 인터페이스 정의
3. children prop 타입 처리

### Phase 3: 기타 문제 해결 (낮은 우선순위)

1. CSS 파일 import 문제 해결
2. 기타 타입 안전성 개선

## 예상 효과

- 타입 안전성 향상
- 개발 시 자동완성 및 오류 검출 개선
- 코드 유지보수성 향상
- 런타임 오류 감소

## 참고사항

- 모든 타입 정의는 실제 API 응답 구조와 일치해야 함
- 점진적으로 타입을 추가하여 기존 기능에 영향을 주지 않도록 주의
- TypeScript 설정에서 `strict` 모드 활성화 권장
