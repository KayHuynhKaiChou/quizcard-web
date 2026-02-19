import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, takeUntil, interval } from 'rxjs';
import { StudySetDetail, Term } from '../../types';
import { AppState } from '../../store/app.state';
import * as StudySetActions from '../../store/studyset/studyset.actions';
import * as StudySetSelectors from '../../store/studyset/studyset.selectors';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';

type QuizType = 'multiple_choice' | 'true_false' | 'fill_blank';

interface QuizQuestion {
  type: QuizType;
  term: Term;
  options: string[];
  correctAnswer: string;
  statement?: string;
  isTrue?: boolean;
}

interface LocalQuizResult {
  score: number;
  total: number;
  timeTaken: number;
  wrongAnswers: { term: Term; userAnswer: string; correctAnswer: string }[];
}

@Component({
  selector: 'app-quiz',
  imports: [
    CommonModule, RouterModule, FormsModule,
    ButtonModule, SliderModule, ProgressBarModule, InputTextModule,
  ],
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss',
})
export class QuizPage implements OnInit, OnDestroy {
  private store = inject(Store<AppState>);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  Math = Math;
  studySet: StudySetDetail | null = null;
  quizState = signal<'setup' | 'quiz' | 'result'>('setup');

  // Setup
  questionCount = 10;
  selectedType = signal<QuizType>('multiple_choice');
  quizTypes: { label: string; value: QuizType; icon: string }[] = [
    { label: 'Trắc nghiệm', value: 'multiple_choice', icon: 'pi pi-list' },
    { label: 'Đúng / Sai', value: 'true_false', icon: 'pi pi-check-circle' },
    { label: 'Điền từ', value: 'fill_blank', icon: 'pi pi-pencil' },
  ];

  // Quiz state
  questions: QuizQuestion[] = [];
  currentQuestionIndex = signal(0);
  selectedAnswer = signal<string | null>(null);
  fillBlankAnswer = '';
  isAnswerSubmitted = signal(false);
  correctAnswersCount = signal(0);
  wrongAnswers: LocalQuizResult['wrongAnswers'] = [];

  // Timer
  timePerQuestion = 20;
  timeLeft = signal(20);
  timerSubscription?: any;
  quizStartTime = 0;

  // Result
  quizResult: LocalQuizResult | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.store.dispatch(StudySetActions.loadStudySetById({ id }));

    this.store.select(StudySetSelectors.selectSelectedStudySet)
      .pipe(takeUntil(this.destroy$))
      .subscribe((ss) => {
        if (ss) {
          this.studySet = ss;
          this.questionCount = Math.min(10, ss.terms.length);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopTimer();
    this.store.dispatch(StudySetActions.clearSelectedStudySet());
  }

  startQuiz(): void {
    if (!this.studySet) return;
    this.questions = this.generateQuestions(this.questionCount, this.selectedType());
    this.quizState.set('quiz');
    this.quizStartTime = Date.now();
    this.startTimer();
  }

  private generateQuestions(count: number, type: QuizType): QuizQuestion[] {
    if (!this.studySet) return [];
    const terms = [...this.studySet.terms].sort(() => Math.random() - 0.5);
    const selected = terms.slice(0, count);

    return selected.map((t) => {
      if (type === 'true_false') return this.generateTrueFalse(t, terms);
      if (type === 'fill_blank') return this.generateFillBlank(t);
      return this.generateMultipleChoice(t, terms);
    });
  }

  private generateMultipleChoice(t: Term, allTerms: Term[]): QuizQuestion {
    const wrong = allTerms.filter((v) => v.id !== t.id)
      .sort(() => Math.random() - 0.5).slice(0, 3).map((v) => v.definition);
    return {
      type: 'multiple_choice', term: t, correctAnswer: t.definition,
      options: [...wrong, t.definition].sort(() => Math.random() - 0.5),
    };
  }

  private generateTrueFalse(t: Term, allTerms: Term[]): QuizQuestion {
    const isTrue = Math.random() > 0.5;
    const shownDef = isTrue
      ? t.definition
      : allTerms.filter((v) => v.id !== t.id).sort(() => Math.random() - 0.5)[0]?.definition || t.definition;
    return {
      type: 'true_false', term: t, correctAnswer: isTrue ? 'true' : 'false',
      statement: shownDef, isTrue, options: [],
    };
  }

  private generateFillBlank(t: Term): QuizQuestion {
    return {
      type: 'fill_blank', term: t, correctAnswer: t.term, options: [],
    };
  }

  private startTimer(): void {
    this.stopTimer();
    this.timeLeft.set(this.selectedType() === 'fill_blank' ? 30 : this.timePerQuestion);
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.timeLeft() > 0) this.timeLeft.update((t) => t - 1);
      else this.handleTimeout();
    });
  }

  private stopTimer(): void {
    this.timerSubscription?.unsubscribe();
  }

  selectAnswer(answer: string): void {
    if (this.isAnswerSubmitted()) return;
    this.selectedAnswer.set(answer);
  }

  submitAnswer(): void {
    const q = this.questions[this.currentQuestionIndex()];
    if (this.isAnswerSubmitted()) return;

    let userAnswer: string;
    if (q.type === 'fill_blank') {
      userAnswer = this.fillBlankAnswer.trim();
      if (!userAnswer) return;
    } else if (q.type === 'true_false') {
      userAnswer = this.selectedAnswer() || '';
      if (!userAnswer) return;
    } else {
      userAnswer = this.selectedAnswer() || '';
      if (!userAnswer) return;
    }

    this.isAnswerSubmitted.set(true);
    this.stopTimer();

    const isCorrect = q.type === 'fill_blank'
      ? this.fuzzyMatch(userAnswer, q.correctAnswer)
      : userAnswer === q.correctAnswer;

    if (isCorrect) {
      this.correctAnswersCount.update((c) => c + 1);
    } else {
      this.wrongAnswers.push({ term: q.term, userAnswer, correctAnswer: q.correctAnswer });
    }

    setTimeout(() => this.nextQuestion(), 1500);
  }

  fuzzyMatch(input: string, correct: string): boolean {
    const normalize = (s: string) => s.toLowerCase().trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return normalize(input) === normalize(correct);
  }

  private handleTimeout(): void {
    if (this.isAnswerSubmitted()) return;
    this.isAnswerSubmitted.set(true);
    this.stopTimer();
    const q = this.questions[this.currentQuestionIndex()];
    this.wrongAnswers.push({
      term: q.term, userAnswer: 'Hết giờ', correctAnswer: q.correctAnswer,
    });
    setTimeout(() => this.nextQuestion(), 1500);
  }

  private nextQuestion(): void {
    if (this.currentQuestionIndex() < this.questions.length - 1) {
      this.currentQuestionIndex.update((i) => i + 1);
      this.selectedAnswer.set(null);
      this.fillBlankAnswer = '';
      this.isAnswerSubmitted.set(false);
      this.startTimer();
    } else {
      this.showResult();
    }
  }

  private showResult(): void {
    const timeTaken = Math.floor((Date.now() - this.quizStartTime) / 1000);
    this.quizResult = {
      score: this.correctAnswersCount(), total: this.questions.length,
      timeTaken, wrongAnswers: this.wrongAnswers,
    };
    this.quizState.set('result');
  }

  retryQuiz(): void {
    this.currentQuestionIndex.set(0);
    this.selectedAnswer.set(null);
    this.fillBlankAnswer = '';
    this.isAnswerSubmitted.set(false);
    this.correctAnswersCount.set(0);
    this.wrongAnswers = [];
    this.quizResult = null;
    this.quizState.set('setup');
  }

  backToDetail(): void {
    if (this.studySet) this.router.navigate(['/set', this.studySet.id]);
  }

  get currentQuestion(): QuizQuestion | null {
    return this.questions[this.currentQuestionIndex()] || null;
  }

  get timeProgress(): number {
    const max = this.selectedType() === 'fill_blank' ? 30 : this.timePerQuestion;
    return (this.timeLeft() / max) * 100;
  }

  isCorrectAnswer(option: string): boolean {
    return this.isAnswerSubmitted() && option === this.currentQuestion?.correctAnswer;
  }

  isWrongAnswer(option: string): boolean {
    return this.isAnswerSubmitted() && option === this.selectedAnswer()
      && option !== this.currentQuestion?.correctAnswer;
  }
}
