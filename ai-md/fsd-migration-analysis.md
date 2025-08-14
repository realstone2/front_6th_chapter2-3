# FSD 폴더 구조 마이그레이션 분석

## 현재 상황 분석

### 현재 파일: `src/components/index.tsx`

- **총 컴포넌트 수**: 25개 → **1단계 완료 후**: 10개 (Select, Dialog 관련 컴포넌트만 남음)
- **의존성**: Radix UI, Lucide React, Class Variance Authority
- **특징**: 모든 UI 컴포넌트가 단일 파일에 집중되어 있음 → **1단계 완료 후**: 기본 UI 컴포넌트들이 shared/ui로 분리됨

## FSD 세그먼트 분류

### 1. **shared/ui** (공통 UI 컴포넌트) ✅ **1단계 완료**

**이유**: 모든 기능에서 재사용 가능한 기본 UI 컴포넌트들

#### 이동 완료된 컴포넌트들:

1. **Button** ✅
   - 위치: `src/shared/ui/button/Button.tsx`
   - 기본 버튼 컴포넌트
   - 다양한 variant와 size 지원
   - 모든 기능에서 공통 사용

2. **Input** ✅
   - 위치: `src/shared/ui/input/Input.tsx`
   - 기본 입력 필드
   - 폼 요소로 모든 기능에서 사용

3. **Textarea** ✅
   - 위치: `src/shared/ui/textarea/Textarea.tsx`
   - 다중 라인 텍스트 입력
   - 폼 요소로 모든 기능에서 사용

4. **Card** 관련 컴포넌트들 ✅
   - 위치: `src/shared/ui/card/Card.tsx`
   - Card, CardHeader, CardTitle, CardContent
   - 레이아웃 컴포넌트로 모든 기능에서 사용

5. **Table** 관련 컴포넌트들 ✅
   - 위치: `src/shared/ui/table/Table.tsx`
   - Table, TableHeader, TableBody, TableRow, TableHead, TableCell
   - 데이터 표시용 공통 컴포넌트

6. **Header** ✅
   - 위치: `src/shared/ui/header/Header.tsx`
   - 애플리케이션 헤더 컴포넌트
   - 네비게이션과 로고 포함
   - 모든 페이지에서 공통 사용

7. **Footer** ✅
   - 위치: `src/shared/ui/footer/Footer.tsx`
   - 애플리케이션 푸터 컴포넌트
   - 저작권 정보 포함
   - 모든 페이지에서 공통 사용

### 2. **shared/ui/select** (선택 컴포넌트) ✅ **2단계 완료**

**이유**: Select 관련 컴포넌트들이 복잡하고 독립적인 기능을 가짐

#### 이동 완료된 컴포넌트들:

1. **Select** 관련 컴포넌트들 ✅
   - 위치: `src/shared/ui/select/Select.tsx`
   - Select, SelectGroup, SelectValue
   - SelectTrigger, SelectContent, SelectItem
   - Radix UI Select 기반의 복합 컴포넌트

### 3. **shared/ui/dialog** (대화상자 컴포넌트) ✅ **2단계 완료**

**이유**: Dialog 관련 컴포넌트들이 복잡하고 독립적인 기능을 가짐

#### 이동 완료된 컴포넌트들:

1. **Dialog** 관련 컴포넌트들 ✅
   - 위치: `src/shared/ui/dialog/Dialog.tsx`
   - Dialog, DialogTrigger, DialogPortal, DialogOverlay
   - DialogContent, DialogHeader, DialogTitle
   - Radix UI Dialog 기반의 복합 컴포넌트

## 현재 폴더 구조

```
src/
├── shared/
│   └── ui/
│       ├── index.ts ✅
│       ├── button/
│       │   ├── index.ts ✅
│       │   └── Button.tsx ✅
│       ├── input/
│       │   ├── index.ts ✅
│       │   └── Input.tsx ✅
│       ├── textarea/
│       │   ├── index.ts ✅
│       │   └── Textarea.tsx ✅
│       ├── card/
│       │   ├── index.ts ✅
│       │   └── Card.tsx ✅
│       ├── table/
│       │   ├── index.ts ✅
│       │   └── Table.tsx ✅
│       ├── header/
│       │   ├── index.ts ✅
│       │   └── Header.tsx ✅
│       ├── footer/
│       │   ├── index.ts ✅
│       │   └── Footer.tsx ✅
│       ├── select/
│       │   ├── index.ts ✅
│       │   └── Select.tsx ✅
│       └── dialog/
│           ├── index.ts ✅
│           └── Dialog.tsx ✅
├── components/
│   └── index.tsx (더 이상 사용되지 않음)
```

## 마이그레이션 진행 상황

### ✅ 1단계: 기본 UI 컴포넌트 (완료)

- Button, Input, Textarea, Card, Table ✅
- Header, Footer ✅
- 가장 많이 사용되는 기본 컴포넌트들 ✅
- 빌드 테스트 통과 ✅
- import 경로 업데이트 완료 ✅

### ✅ 2단계: 복합 컴포넌트 (완료)

- Select 관련 컴포넌트들 ✅
- Dialog 관련 컴포넌트들 ✅
- 빌드 테스트 통과 ✅
- import 경로 업데이트 완료 ✅

## 주의사항

1. **의존성 관리**: 각 컴포넌트의 import/export 구조 유지 ✅
2. **타입 정의**: 인터페이스와 타입 정의도 함께 이동 ✅
3. **스타일링**: CVA 설정과 Tailwind 클래스 유지 ✅
4. **테스트**: 기존 테스트가 있다면 함께 이동 ✅

## 마이그레이션 완료

✅ **FSD 폴더 구조 마이그레이션이 성공적으로 완료되었습니다!**

모든 UI 컴포넌트들이 FSD 구조에 맞게 `shared/ui`로 이동되었으며, 각 컴포넌트별로 개별 폴더 구조를 가지게 되었습니다.

### 🎉 완료된 작업:

- 1단계: 기본 UI 컴포넌트 분리 ✅
- 2단계: 복합 컴포넌트 분리 ✅
- 모든 import 경로 업데이트 ✅
- 빌드 테스트 통과 ✅
- TypeScript 컴파일 오류 없음 ✅
