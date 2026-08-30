import { createAction, props } from '@ngrx/store';
import { AiSentence, Page, SavedSentence } from '../../types';

// Load
export const loadSavedSentences = createAction(
  '[SavedSentence] Load',
  props<{ page: number; size: number }>()
);

export const loadSavedSentencesSuccess = createAction(
  '[SavedSentence] Load Success',
  props<{ page: Page<SavedSentence> }>()
);

export const loadSavedSentencesFailure = createAction(
  '[SavedSentence] Load Failure',
  props<{ error: string }>()
);

// Save (bulk, from the sentence picker modal)
export const saveSentences = createAction(
  '[SavedSentence] Save',
  props<{ sentences: AiSentence[] }>()
);

export const saveSentencesSuccess = createAction(
  '[SavedSentence] Save Success',
  props<{ saved: SavedSentence[] }>()
);

export const saveSentencesFailure = createAction(
  '[SavedSentence] Save Failure',
  props<{ error: string }>()
);

// Delete
export const deleteSavedSentence = createAction(
  '[SavedSentence] Delete',
  props<{ id: string }>()
);

export const deleteSavedSentenceSuccess = createAction(
  '[SavedSentence] Delete Success',
  props<{ id: string }>()
);

export const deleteSavedSentenceFailure = createAction(
  '[SavedSentence] Delete Failure',
  props<{ error: string }>()
);
