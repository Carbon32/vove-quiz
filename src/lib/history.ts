export interface LessonHistory {
    id: number
    attemptId: string
    category: string
    totalQuestions: number
    correctQuestions: number
    wrongQuestions: number
    timestamp: string | null
}
