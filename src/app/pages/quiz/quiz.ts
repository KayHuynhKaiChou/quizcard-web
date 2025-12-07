import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, takeUntil, interval } from 'rxjs';
import { StudySet, QuizQuestion, QuizResult } from '../../types';
import { AppState } from '../../store/app.state';
import * as StudySetActions from '../../store/studyset/studyset.actions';
import * as StudySetSelectors from '../../store/studyset/studyset.selectors';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { ProgressBarModule } from 'primeng/progressbar';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-quiz',
  imports: [CommonModule, RouterModule, FormsModule, ButtonModule, SliderModule, ProgressBarModule, CardModule],
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss'
})
export class QuizPage implements OnInit, OnDestroy {
  private store = inject(Store<AppState>);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  // Expose Math for template
  Math = Math;

  studySet: StudySet | null = null;
  quizState = signal<'setup' | 'quiz' | 'result'>('setup');

  // Setup state
  questionCount = signal(10);

  // Quiz state
  questions: QuizQuestion[] = [];
  currentQuestionIndex = signal(0);
  selectedAnswer = signal<string | null>(null);
  isAnswerSubmitted = signal(false);
  correctAnswersCount = signal(0);
  wrongAnswers: QuizResult['wrongAnswers'] = [];

  // Timer state
  timePerQuestion = 20;
  timeLeft = signal(20);
  timerSubscription?: any;
  quizStartTime = 0;

  // Result state
  quizResult: QuizResult | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(StudySetActions.loadStudySetById({ id }));
    }

    this.store
      .select(StudySetSelectors.selectSelectedStudySet)
      .pipe(takeUntil(this.destroy$))
      .subscribe(studySet => {
        if (studySet) {
          this.studySet = studySet;
          this.questionCount.set(Math.min(10, studySet.vocabularies.length));
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

    this.questions = this.generateQuestions(this.questionCount());
    this.quizState.set('quiz');
    this.quizStartTime = Date.now();
    this.startTimer();
  }

  private generateQuestions(count: number): QuizQuestion[] {
    if (!this.studySet) return [];

    const vocabularies = [...this.studySet.vocabularies];
    const shuffled = vocabularies.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);

    return selected.map(vocab => {
      const wrongOptions = vocabularies
        .filter(v => v.id !== vocab.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(v => v.definition);

      const allOptions = [...wrongOptions, vocab.definition].sort(() => Math.random() - 0.5);

      return {
        vocabulary: vocab,
        options: allOptions,
        correctAnswer: vocab.definition
      };
    });
  }

  private startTimer(): void {
    this.timeLeft.set(this.timePerQuestion);
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.timeLeft() > 0) {
        this.timeLeft.update(t => t - 1);
      } else {
        this.handleTimeout();
      }
    });
  }

  private stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  selectAnswer(answer: string): void {
    if (this.isAnswerSubmitted()) return;
    this.selectedAnswer.set(answer);
  }

  submitAnswer(): void {
    if (!this.selectedAnswer() || this.isAnswerSubmitted()) return;

    this.isAnswerSubmitted.set(true);
    this.stopTimer();

    const currentQuestion = this.questions[this.currentQuestionIndex()];
    const isCorrect = this.selectedAnswer() === currentQuestion.correctAnswer;

    if (isCorrect) {
      this.correctAnswersCount.update(c => c + 1);
    } else {
      this.wrongAnswers.push({
        question: currentQuestion.vocabulary,
        userAnswer: this.selectedAnswer()!,
        correctAnswer: currentQuestion.correctAnswer
      });
    }

    setTimeout(() => {
      this.nextQuestion();
    }, 1500);
  }

  private handleTimeout(): void {
    if (this.isAnswerSubmitted()) return;

    this.isAnswerSubmitted.set(true);
    this.stopTimer();

    const currentQuestion = this.questions[this.currentQuestionIndex()];
    this.wrongAnswers.push({
      question: currentQuestion.vocabulary,
      userAnswer: 'No answer (timeout)',
      correctAnswer: currentQuestion.correctAnswer
    });

    setTimeout(() => {
      this.nextQuestion();
    }, 1500);
  }

  private nextQuestion(): void {
    if (this.currentQuestionIndex() < this.questions.length - 1) {
      this.currentQuestionIndex.update(i => i + 1);
      this.selectedAnswer.set(null);
      this.isAnswerSubmitted.set(false);
      this.startTimer();
    } else {
      this.showResult();
    }
  }

  private showResult(): void {
    const timeTaken = Math.floor((Date.now() - this.quizStartTime) / 1000);
    this.quizResult = {
      score: this.correctAnswersCount(),
      total: this.questions.length,
      timeTaken,
      wrongAnswers: this.wrongAnswers
    };
    this.quizState.set('result');
  }

  retryQuiz(): void {
    this.currentQuestionIndex.set(0);
    this.selectedAnswer.set(null);
    this.isAnswerSubmitted.set(false);
    this.correctAnswersCount.set(0);
    this.wrongAnswers = [];
    this.quizResult = null;
    this.quizState.set('setup');
  }

  backToDetail(): void {
    if (this.studySet) {
      this.router.navigate(['/set', this.studySet.id]);
    }
  }

  get currentQuestion(): QuizQuestion | null {
    return this.questions[this.currentQuestionIndex()] || null;
  }

  get timeProgress(): number {
    return (this.timeLeft() / this.timePerQuestion) * 100;
  }

  isCorrectAnswer(option: string): boolean {
    if (!this.isAnswerSubmitted()) return false;
    return option === this.currentQuestion?.correctAnswer;
  }

  isWrongAnswer(option: string): boolean {
    if (!this.isAnswerSubmitted()) return false;
    return option === this.selectedAnswer() && option !== this.currentQuestion?.correctAnswer;
  }
}
