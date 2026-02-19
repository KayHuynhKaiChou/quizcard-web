import { AuthState } from './auth/auth.state';
import { StudySetState } from './studyset/studyset.state';
import { NotificationState } from './notification/notification.state';
import { QuizState } from './quiz/quiz.state';
import { LearningState } from './learning/learning.state';
import { ExploreState } from './explore/explore.state';
import { AiState } from './ai/ai.state';

export interface AppState {
  auth: AuthState;
  studySet: StudySetState;
  notification: NotificationState;
  quiz: QuizState;
  learning: LearningState;
  explore: ExploreState;
  ai: AiState;
}
