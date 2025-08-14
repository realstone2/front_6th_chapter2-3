import { AddPostFormData, AddPostFormState, AddPostBusinessLogic } from "./types"
import { validateAddPostForm } from "./validation"

// 비즈니스 로직 구현
export class AddPostBusinessLogicImpl implements AddPostBusinessLogic {
  
  // 폼 데이터 검증
  validateForm(data: AddPostFormData): AddPostFormState {
    return validateAddPostForm(data)
  }
  
  // 데이터 포맷팅 (전처리)
  formatData(data: AddPostFormData): AddPostFormData {
    return {
      title: data.title.trim(),
      body: data.body.trim(),
      userId: Number(data.userId)
    }
  }
  
  // 제출 가능 여부 확인
  canSubmit(state: AddPostFormState): boolean {
    return state.isValid && !state.isSubmitting
  }
  
  // 제목 자동 완성 제안
  suggestTitle(body: string): string {
    if (!body.trim()) return ""
    
    const sentences = body.split(/[.!?]/).filter(s => s.trim().length > 0)
    if (sentences.length === 0) return ""
    
    const firstSentence = sentences[0].trim()
    return firstSentence.length > 50 
      ? firstSentence.substring(0, 50) + "..."
      : firstSentence
  }
  
  // 내용 요약 생성
  generateSummary(body: string, maxLength: number = 100): string {
    if (!body.trim()) return ""
    
    const cleanBody = body.replace(/\s+/g, ' ').trim()
    if (cleanBody.length <= maxLength) return cleanBody
    
    return cleanBody.substring(0, maxLength) + "..."
  }
  
  // 태그 추출 (내용에서 해시태그 추출)
  extractTags(body: string): string[] {
    const hashtagRegex = /#(\w+)/g
    const matches = body.match(hashtagRegex)
    return matches ? matches.map(tag => tag.substring(1)) : []
  }
  
  // 글자 수 계산
  calculateCharacterCount(body: string): number {
    return body.replace(/\s/g, '').length
  }
  
  // 예상 읽기 시간 계산 (평균 200자/분 기준)
  calculateReadingTime(body: string): number {
    const charCount = this.calculateCharacterCount(body)
    return Math.ceil(charCount / 200)
  }
}
