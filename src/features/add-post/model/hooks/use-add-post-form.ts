import { useState, useCallback } from "react"
import { AddPostFormData, AddPostFormState } from "../types"
import { AddPostBusinessLogicImpl } from "../business-logic"

// Add Post 폼 관리를 위한 커스텀 훅
export const useAddPostForm = () => {
  const [formData, setFormData] = useState<AddPostFormData>({
    title: "",
    body: "",
    userId: 1
  })
  
  const [formState, setFormState] = useState<AddPostFormState>({
    isValid: false,
    errors: {},
    isSubmitting: false,
    isSubmitted: false
  })
  
  const businessLogic = new AddPostBusinessLogicImpl()
  
  // 폼 데이터 업데이트
  const updateFormData = useCallback((field: keyof AddPostFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])
  
  // 실시간 검증
  const validateField = useCallback((field: keyof AddPostFormData, value: string | number) => {
    const validationResult = businessLogic.validateForm({
      ...formData,
      [field]: value
    })
    
    setFormState(prev => ({
      ...prev,
      isValid: validationResult.isValid,
      errors: validationResult.errors
    }))
  }, [formData, businessLogic])
  
  // 제목 자동 완성
  const suggestTitle = useCallback(() => {
    const suggestedTitle = businessLogic.suggestTitle(formData.body)
    if (suggestedTitle) {
      updateFormData("title", suggestedTitle)
      validateField("title", suggestedTitle)
    }
  }, [formData.body, updateFormData, validateField, businessLogic])
  
  // 글자 수 계산
  const getCharacterCount = useCallback(() => {
    return businessLogic.calculateCharacterCount(formData.body)
  }, [formData.body, businessLogic])
  
  // 읽기 시간 계산
  const getReadingTime = useCallback(() => {
    return businessLogic.calculateReadingTime(formData.body)
  }, [formData.body, businessLogic])
  
  // 태그 추출
  const getExtractedTags = useCallback(() => {
    return businessLogic.extractTags(formData.body)
  }, [formData.body, businessLogic])
  
  // 폼 제출 준비
  const prepareSubmit = useCallback(() => {
    const formattedData = businessLogic.formatData(formData)
    const validationResult = businessLogic.validateForm(formattedData)
    
    setFormState(prev => ({
      ...prev,
      ...validationResult,
      isSubmitting: true
    }))
    
    return {
      data: formattedData,
      isValid: validationResult.isValid
    }
  }, [formData, businessLogic])
  
  // 제출 완료 처리
  const handleSubmitSuccess = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      isSubmitting: false,
      isSubmitted: true
    }))
    
    // 폼 초기화
    setFormData({
      title: "",
      body: "",
      userId: 1
    })
  }, [])
  
  // 제출 실패 처리
  const handleSubmitError = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      isSubmitting: false
    }))
  }, [])
  
  return {
    formData,
    formState,
    updateFormData,
    validateField,
    suggestTitle,
    getCharacterCount,
    getReadingTime,
    getExtractedTags,
    prepareSubmit,
    handleSubmitSuccess,
    handleSubmitError,
    canSubmit: businessLogic.canSubmit(formState)
  }
}
