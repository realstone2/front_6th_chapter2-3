// Add Post Feature의 비즈니스 로직 관련 타입들

export interface AddPostFormData {
  title: string
  body: string
  userId: number
}

export interface AddPostValidationRules {
  title: {
    required: boolean
    minLength: number
    maxLength: number
  }
  body: {
    required: boolean
    minLength: number
    maxLength: number
  }
  userId: {
    required: boolean
    minValue: number
  }
}

export interface AddPostFormState {
  isValid: boolean
  errors: Record<string, string>
  isSubmitting: boolean
  isSubmitted: boolean
}

export interface AddPostBusinessLogic {
  validateForm: (data: AddPostFormData) => AddPostFormState
  formatData: (data: AddPostFormData) => AddPostFormData
  canSubmit: (state: AddPostFormState) => boolean
}
