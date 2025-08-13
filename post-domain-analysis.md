# 게시물 관리 시스템 도메인 분석 보고서

## 1. 구조 분석

### 1.1 파일 구조

```
src/pages/post/index.tsx (787줄)
├── 타입 정의 (인터페이스)
├── PostsManager 컴포넌트
│   ├── 상태 관리 (20개 상태)
│   ├── API 호출 함수들
│   ├── 이벤트 핸들러들
│   └── 렌더링 함수들
└── 대화상자 컴포넌트들
```

### 1.2 컴포넌트 구조

- **단일 파일 모놀리식 구조**: 모든 로직이 하나의 파일에 집중
- **상태 관리**: useState 훅을 사용한 로컬 상태 관리
- **API 통신**: fetch API를 사용한 직접적인 HTTP 요청
- **UI 렌더링**: 테이블, 대화상자, 폼 요소들의 복합적 렌더링

## 2. 도메인 분석

### 2.1 핵심 도메인

1. **게시물 도메인 (Post Domain)**
   - 게시물 CRUD 작업
   - 게시물 검색 및 필터링
   - 태그 기반 분류
   - 반응(좋아요/싫어요) 관리

2. **사용자 도메인 (User Domain)**
   - 사용자 정보 조회
   - 사용자 프로필 표시
   - 게시물 작성자 연결

3. **댓글 도메인 (Comment Domain)**
   - 댓글 CRUD 작업
   - 댓글 좋아요 기능
   - 게시물별 댓글 관리

4. **태그 도메인 (Tag Domain)**
   - 태그 목록 관리
   - 태그별 게시물 필터링

### 2.2 비즈니스 로직

- **페이지네이션**: skip/limit 기반 데이터 로딩
- **검색**: 제목 기반 텍스트 검색
- **정렬**: ID, 제목, 반응 기준 정렬
- **필터링**: 태그 기반 게시물 필터링
- **URL 상태 관리**: 쿼리 파라미터 기반 상태 동기화

## 3. 문제점 분석

### 3.1 아키텍처 문제점

1. **단일 책임 원칙 위반**
   - 하나의 컴포넌트가 너무 많은 책임을 가짐
   - 게시물, 댓글, 사용자, 태그 관리가 모두 혼재

2. **관심사 분리 부족**
   - UI 로직과 비즈니스 로직이 분리되지 않음
   - API 호출 로직이 컴포넌트 내부에 직접 구현

3. **상태 관리 복잡성**
   - 20개의 useState로 인한 상태 관리 복잡성
   - 상태 간 의존성 관리 어려움

### 3.2 코드 품질 문제점

1. **타입 안전성 부족**
   - API 응답 타입이 인터페이스로만 정의
   - 런타임 타입 검증 없음

2. **에러 처리 미흡**
   - try-catch 블록만 있고 사용자 친화적 에러 처리 없음
   - 로딩 상태 관리 불완전

3. **성능 문제**
   - 불필요한 리렌더링 발생 가능
   - API 호출 최적화 부족

### 3.3 유지보수성 문제점

1. **코드 중복**
   - 유사한 API 호출 패턴 반복
   - 대화상자 로직 중복

2. **확장성 부족**
   - 새로운 기능 추가 시 기존 코드 수정 필요
   - 도메인 간 결합도 높음

## 4. 개선점 제안

### 4.1 FSD 아키텍처 개선

1. **현재 FSD 구조 분석**

   ```
   src/
   ├── app/                    # 애플리케이션 설정
   │   └── App.tsx
   ├── pages/                  # 페이지 레이어
   │   └── post/
   │       └── index.tsx       # 현재 모든 로직이 여기에 집중
   ├── widgets/                # 위젯 레이어 (비어있음)
   ├── features/               # 기능 레이어 (비어있음)
   ├── entities/               # 엔티티 레이어 (비어있음)
   └── shared/                 # 공유 레이어
       ├── ui/                 # UI 컴포넌트
       └── assets/             # 정적 자산
   ```

2. **FSD 기반 개선된 구조**

   ```
   src/
   ├── app/                    # 애플리케이션 설정
   │   ├── App.tsx
   │   ├── providers/          # 전역 프로바이더
   │   └── styles/             # 전역 스타일
   ├── pages/                  # 페이지 레이어
   │   └── post/
   │       ├── index.tsx       # 페이지 컴포넌트
   │       └── ui/             # 페이지 전용 UI
   ├── widgets/                # 위젯 레이어
   │   ├── PostListWidget/     # 게시물 목록 위젯
   │   ├── CommentListWidget/  # 댓글 목록 위젯
   │   └── UserProfileWidget/  # 사용자 프로필 위젯
   ├── features/               # 기능 레이어
   │   ├── PostSearch/         # 게시물 검색 기능
   │   ├── PostFilter/         # 게시물 필터링 기능
   │   ├── PostPagination/     # 페이지네이션 기능
   │   ├── CommentActions/     # 댓글 액션 기능
   │   └── UserActions/        # 사용자 액션 기능
   ├── entities/               # 엔티티 레이어
   │   ├── Post/               # 게시물 엔티티
   │   │   ├── model/
   │   │   ├── api/
   │   │   ├── ui/
   │   │   └── index.ts
   │   ├── Comment/            # 댓글 엔티티
   │   ├── User/               # 사용자 엔티티
   │   └── Tag/                # 태그 엔티티
   └── shared/                 # 공유 레이어
       ├── ui/                 # UI 컴포넌트
       ├── api/                # API 클라이언트
       ├── lib/                # 유틸리티 라이브러리
       ├── config/             # 설정
       └── types/              # 공통 타입
   ```

3. **상태 관리 개선**
   - Zustand 또는 Redux Toolkit 도입
   - 도메인별 스토어 분리
   - 캐싱 전략 구현

### 4.2 코드 품질 개선

1. **타입 안전성 강화**
   - Zod를 사용한 런타임 타입 검증
   - API 응답 스키마 정의

2. **에러 처리 개선**
   - React Query의 에러 바운더리 활용
   - 사용자 친화적 에러 메시지

3. **성능 최적화**
   - React Query를 사용한 캐싱
   - 메모이제이션 적용
   - 가상화된 테이블 구현

### 4.3 FSD 기반 컴포넌트 분리

1. **엔티티 레이어 분리**

   ```typescript
   // entities/Post/
   ├── model/
   │   ├── types.ts           # Post 타입 정의
   │   ├── store.ts           # Post 상태 관리
   │   └── selectors.ts       # Post 선택자
   ├── api/
   │   ├── postApi.ts         # Post API 함수
   │   └── postQueries.ts     # React Query 훅
   ├── ui/
   │   ├── PostCard.tsx       # Post 카드 컴포넌트
   │   ├── PostForm.tsx       # Post 폼 컴포넌트
   │   └── index.ts
   └── index.ts
   ```

2. **기능 레이어 분리**

   ```typescript
   // features/PostSearch/
   ├── model/
   │   ├── types.ts           # 검색 관련 타입
   │   └── store.ts           # 검색 상태 관리
   ├── ui/
   │   ├── SearchInput.tsx    # 검색 입력 컴포넌트
   │   ├── SearchResults.tsx  # 검색 결과 컴포넌트
   │   └── index.ts
   └── index.ts
   ```

3. **위젯 레이어 분리**

   ```typescript
   // widgets/PostListWidget/
   ├── model/
   │   └── types.ts           # 위젯 타입
   ├── ui/
   │   ├── PostListWidget.tsx # 게시물 목록 위젯
   │   └── index.ts
   └── index.ts
   ```

### 4.4 FSD 기반 API 레이어 개선

1. **공유 API 클라이언트**

   ```typescript
   // shared/api/
   ├── client.ts              # HTTP 클라이언트 설정
   ├── types.ts               # 공통 API 타입
   └── errors.ts              # 에러 처리 유틸리티
   ```

2. **엔티티별 API 레이어**

   ```typescript
   // entities/Post/api/
   ├── postApi.ts             # Post API 함수들
   ├── postQueries.ts         # React Query 훅들
   └── postMutations.ts       # React Query 뮤테이션들
   ```

3. **React Query 설정**

   ```typescript
   // app/providers/
   ├── QueryProvider.tsx      # React Query 프로바이더
   └── index.ts
   ```

### 4.5 테스트 전략

1. **단위 테스트**
   - 도메인 로직 테스트
   - 유틸리티 함수 테스트

2. **통합 테스트**
   - API 통신 테스트
   - 컴포넌트 통합 테스트

3. **E2E 테스트**
   - 사용자 시나리오 테스트

## 5. 우선순위별 개선 계획

### Phase 1: FSD 기반 긴급 개선 (1-2주)

1. **엔티티 레이어 구축**
   - Post, Comment, User, Tag 엔티티 분리
   - 각 엔티티의 타입 정의 및 API 함수 분리

2. **기능 레이어 구축**
   - PostSearch, PostFilter, PostPagination 기능 분리
   - 각 기능의 UI 컴포넌트 분리

3. **위젯 레이어 구축**
   - PostListWidget, CommentListWidget 위젯 분리
   - 페이지에서 위젯 조합

### Phase 2: FSD 기반 중기 개선 (3-4주)

1. **React Query 도입**
   - app/providers에 QueryProvider 설정
   - 엔티티별 React Query 훅 구현

2. **공유 레이어 확장**
   - shared/api 클라이언트 구축
   - shared/lib 유틸리티 함수 분리

3. **상태 관리 개선**
   - 엔티티별 로컬 상태 관리
   - 기능별 상태 관리

### Phase 3: FSD 기반 장기 개선 (1-2개월)

1. **FSD 아키텍처 완성**
   - 모든 레이어 완전 분리
   - 레이어 간 의존성 규칙 준수

2. **테스트 전략 구현**
   - 각 레이어별 테스트 구조 구축
   - FSD 규칙에 맞는 테스트 작성

3. **성능 최적화**
   - 레이어별 코드 스플리팅
   - 번들 크기 최적화

## 6. 결론

현재 게시물 관리 시스템은 기능적으로는 완성도가 높지만, FSD 아키텍처의 잠재력을 제대로 활용하지 못하고 있습니다. 특히 pages 레이어에 모든 로직이 집중되어 있어 entities, features, widgets 레이어가 비어있는 상태입니다.

FSD의 레이어 분리 원칙을 적용하여 각 도메인을 적절한 레이어에 배치하고, 레이어 간 의존성 규칙을 준수함으로써 더 견고하고 확장 가능한 시스템으로 발전시킬 수 있을 것입니다.

### FSD 핵심 원칙 적용

- **엔티티 레이어**: Post, Comment, User, Tag의 핵심 비즈니스 로직
- **기능 레이어**: 검색, 필터링, 페이지네이션 등 사용자 액션
- **위젯 레이어**: 게시물 목록, 댓글 목록 등 복합 UI 블록
- **페이지 레이어**: 라우팅과 위젯 조합
- **공유 레이어**: 재사용 가능한 UI 컴포넌트와 유틸리티
