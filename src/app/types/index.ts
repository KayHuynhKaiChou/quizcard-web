import { Role, Visibility } from './enum';

// ============ Pagination ============
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface CursorPage<T, C> {
  items: T[];
  nextCursor: C | null;
  hasMore: boolean;
}

// ============ Auth DTOs ============
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface MessageResponse {
  message: string;
}

// ============ User DTOs ============
export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  role: Role;
  streakCount: number;
  xpPoints: number;
  createdAt: string;
}

export interface UpdateProfileRequest {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}

// ============ StudySet DTOs ============
export interface StudySet {
  id: string;
  userId: string;
  authorDisplayName: string | null;
  authorAvatarUrl: string | null;
  title: string;
  description: string | null;
  sourceLanguage: string | null;
  targetLanguage: string | null;
  category: string | null;
  tags: string[];
  visibility: Visibility;
  termsCount: number;
  cloneCount: number;
  ratingAvg: number;
  createdAt: string;
  updatedAt: string;
  isOwner?: boolean;
}

export interface StudySetDetail extends StudySet {
  terms: Term[];
}

export interface CreateStudySetRequest {
  title: string;
  description?: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  category?: string;
  tags?: string[];
  visibility?: Visibility;
  terms?: CreateTermRequest[];
}

export interface UpdateStudySetRequest {
  title?: string;
  description?: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  category?: string;
  tags?: string[];
  visibility?: Visibility;
}

// ============ Term DTOs ============
export interface Term {
  id: string;
  term: string;
  definition: string;
  ipa: string | null;
  exampleSentence: string | null;
  exampleTranslation: string | null;
  imageUrl: string | null;
  audioUrl: string | null;
  synonyms: string[];
  antonyms: string[];
  orderIndex: number;
}

export interface CreateTermRequest {
  term: string;
  definition: string;
  ipa?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  imageUrl?: string;
  audioUrl?: string;
  synonyms?: string[];
  antonyms?: string[];
}

export interface UpdateTermRequest {
  term?: string;
  definition?: string;
  ipa?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  imageUrl?: string;
  audioUrl?: string;
  synonyms?: string[];
  antonyms?: string[];
}

// ============ Quiz DTOs ============
export interface QuizConfigRequest {
  studySetId: string;
  questionCount?: number;
  quizType?: string;
  timeLimitSeconds?: number;
}

export interface QuizSubmitRequest {
  studySetId: string;
  quizType?: string;
  timeSpentSeconds?: number;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  termId: string;
  userAnswer: string;
  correctAnswer: string;
  correct: boolean;
}

export interface QuizResult {
  id: string;
  userId: string;
  studySetId: string;
  studySetTitle: string | null;
  quizType: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpentSeconds: number | null;
  details: string;
  createdAt: string;
}

export interface QuizAnswerDetail {
  termId: string;
  term: string;
  definition: string;
  userAnswer: string;
  correctAnswer: string;
  correct: boolean;
}

export interface QuizResultDetail {
  id: string;
  userId: string;
  studySetId: string;
  studySetTitle: string | null;
  quizType: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpentSeconds: number | null;
  createdAt: string;
  answers: QuizAnswerDetail[];
}

// ============ Learning DTOs ============
export interface ReviewRequest {
  termId: string;
  quality: number;
}

export interface LearningStats {
  totalTerms: number;
  masteredTerms: number;
  learningTerms: number;
  newTerms: number;
  streakCount: number;
  todayReviewCount: number;
}

export interface ReviewTerm {
  termId: string;
  term: string;
  definition: string;
  studySetId: string;
  studySetTitle: string;
  nextReviewDate: string;
  reviewCount: number;
  easeFactor: number;
}

// ============ AI DTOs ============
export interface AiGenerateRequest {
  prompt: string;
  count?: number;
  sourceLanguage?: string;
  targetLanguage?: string;
  difficulty?: string;
  includeExamples?: boolean;
  includeIpa?: boolean;
}

export interface AiExtractRequest {
  text: string;
  sourceLanguage?: string;
  targetLanguage?: string;
}

export interface AiGenerateResponse {
  remainingUsage: number;
  terms: AiTermResponse[];
}

export interface AiTermResponse {
  term: string;
  definition: string;
  ipa: string | null;
  example: string | null;
  exampleTranslation: string | null;
  synonyms: string[];
  category: string | null;
}

export interface AiUsageResponse {
  date: string;
  usageCount: number;
  maxUsage: number;
  remaining: number;
  resetAt: string;
}

// ============ Notification DTO ============
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string | null;
  read: boolean;
  referenceId: string | null;
  createdAt: string;
}

// ============ Rating DTO ============
export interface RateStudySetRequest {
  rating: number;
}

// ============ User Public Profile DTO ============
export interface UserPublicProfile {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  streakCount: number;
  xpPoints: number;
  level: number;
  publicStudySetCount: number;
  createdAt: string;
}
