import { AddPostFormData, AddPostFormState, AddPostValidationRules } from "./types"

// Validation 규칙 정의
export const ADD_POST_VALIDATION_RULES: AddPostValidationRules = {
  title: {
    required: true,
    minLength: 1,
    maxLength: 100
  },
  body: {
    required: true,
    minLength: 10,
    maxLength: 1000
  },
  userId: {
    required: true,
    minValue: 1
  }
}

// Validation 함수들
export const validateTitle = (title: string): string | null => {
  if (!title.trim()) {
    return "제목은 필수입니다."
  }
  if (title.length < ADD_POST_VALIDATION_RULES.title.minLength) {
    return `제목은 최소 ${ADD_POST_VALIDATION_RULES.title.minLength}자 이상이어야 합니다.`
  }
  if (title.length > ADD_POST_VALIDATION_RULES.title.maxLength) {
    return `제목은 최대 ${ADD_POST_VALIDATION_RULES.title.maxLength}자까지 가능합니다.`
  }
  return null
}

export const validateBody = (body: string): string | null => {
  if (!body.trim()) {
    return "내용은 필수입니다."
  }
  if (body.length < ADD_POST_VALIDATION_RULES.body.minLength) {
    return `내용은 최소 ${ADD_POST_VALIDATION_RULES.body.minLength}자 이상이어야 합니다.`
  }
  if (body.length > ADD_POST_VALIDATION_RULES.body.maxLength) {
    return `내용은 최대 ${ADD_POST_VALIDATION_RULES.body.maxLength}자까지 가능합니다.`
  }
  return null
}

export const validateUserId = (userId: number): string | null => {
  if (!userId || userId < ADD_POST_VALIDATION_RULES.userId.minValue) {
    return "유효한 사용자 ID가 필요합니다."
  }
  return null
}

// 전체 폼 validation
export const validateAddPostForm = (data: AddPostFormData): AddPostFormState => {
  const errors: Record<string, string> = {}
  
  const titleError = validateTitle(data.title)
  if (titleError) errors.title = titleError
  
  const bodyError = validateBody(data.body)
  if (bodyError) errors.body = bodyError
  
  const userIdError = validateUserId(data.userId)
  if (userIdError) errors.userId = userIdError
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    isSubmitting: false,
    isSubmitted: false
  }
}
