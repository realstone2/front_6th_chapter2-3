// Edit Post Feature의 비즈니스 로직 관련 타입들

export interface EditPostFormData {
  id: number
  title: string
  body: string
  userId: number
}

export interface EditPostValidationRules {
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

export interface EditPostFormState {
  isValid: boolean
  errors: Record<string, string>
  isSubmitting: boolean
  isSubmitted: boolean
  hasChanges: boolean
}

export interface EditPostBusinessLogic {
  validateForm: (data: EditPostFormData) => EditPostFormState
  formatData: (data: EditPostFormData) => EditPostFormData
  canSubmit: (state: EditPostFormState) => boolean
  hasUnsavedChanges: (original: EditPostFormData, current: EditPostFormData) => boolean
}
