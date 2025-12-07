import { AuthState } from './auth/auth.state';
import { StudySetState } from './studyset/studyset.state';

export interface AppState {
  auth: AuthState;
  studySet: StudySetState;
}
