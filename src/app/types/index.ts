import { GENDER, ROLE, STATUS_ACCOUNT } from "./enum";

// model
interface Entity {
    id: string;
}
  
export interface User extends Entity {
    fullname?: string;
    username?: string;
    email?: string;
    verified_email?: boolean;
    phone?: string;
    cccd?: string;
    default_password?: string;
    dob?: string;
    gender?: GENDER;
    avatar?: string;
    role?: ROLE;
    salary?: number;
    account_certificate?: any[];
    account_skill?: any[];
    province_id?: number;
    district_id?: number;
    ward_id?: number;
    address?: string;
    status?: STATUS_ACCOUNT;
    face_registered?: boolean;
    current_project_id?: any;
    team?: any;
    total_quota?: number;
    used_quota?: number;
    token?: string;
}
  
// Vocabulary Learning Types
export interface Vocabulary {
  id: string;
  term: string;
  definition: string;
}

export interface StudySet {
  id: string;
  title: string;
  author: string;
  mode: 'public' | 'private';
  createdAt: string;
  vocabularies: Vocabulary[];
}

export interface QuizQuestion {
  vocabulary: Vocabulary;
  options: string[];
  correctAnswer: string;
}

export interface QuizResult {
  score: number;
  total: number;
  timeTaken: number;
  wrongAnswers: {
    question: Vocabulary;
    userAnswer: string;
    correctAnswer: string;
  }[];
}

// response
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  result: T;
}