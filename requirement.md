# Project Title: English Vocabulary Learning App (Quizlet Clone)

## 1. Overview
Build a web application for learning English vocabulary similar to Quizlet. The app focuses on Flashcards for memorization and a Quiz mode for testing.

## 2. Data Structures (Entities)

### A. User (Account)
*Mock data representing a logged-in user.*
- `id`: string
- `email`: string
- `password`: string (hashed/mocked)
- `fullname`: string
- `avatar`: string (URL)

### B. Study Set (Học phần)
- `id`: string
- `title`: string
- `author`: string (User name)
- `mode`: 'public' | 'private'
- `createdAt`: string
- `vocabularies`: Array<Vocabulary>

### C. Vocabulary (Từ vựng)
- `id`: string
- `term`: string (English word)
- `definition`: string (Vietnamese meaning)

## 3. Data Source Implementation
- **Data Folder:** Follow a available folder named `fakeData` in the app folder.
- **File Format:** Each file in `fakeData` represents one **Study Set**.
- **Behavior:** The app must read all files from this folder to render the Dashboard list.

## 4. Feature Requirements & UI/UX

### Page 1: Dashboard (Home)
- **Layout:** Responsive Grid layout (1 col mobile, 2 cols tablet, 3-4 cols desktop).
- **Component:** `StudySetCard` displaying:
  - Title, Author (with avatar), Total terms count.
  - Badge for Mode (Public/Private).
  - Hover effect: Scale up slightly + shadow.
- **Action:** Clicking a card navigates to the **Study Set Detail Page** (`/set/[id]`).

### Page 2: Study Set Detail (Flashcard Mode)
- **Header:** Title of the set, Author info, "Start Quiz" button.
- **Flashcard Component:**
  - **UI:** A large centered card. Front shows `term`, Back shows `definition`.
  - **Interaction:** Click to flip (use Framer Motion `rotateY` transition).
  - **Navigation:** Previous/Next arrows to cycle through words.
  - **Keyboard Support:** Left/Right arrow keys to navigate, Spacebar to flip.

### Page 3: Quiz Mode (Exam)
- **Setup:**
  - An input/slider to select number of questions (Range: 10 to 40, max = total terms).
  - "Start" button to begin.
  
- **Logic:**
  - **Question Format:** Multiple Choice. Show the `term` (e.g., "Book"), asking for the Vietnamese meaning.
  - **Answers:** Generate 4 options (1 correct, 3 random wrong answers taken from other words in the same set).
  - **Timer:** 20 seconds per question.
    - Display a countdown progress bar.
    - **Timeout:** If 20s ends, automatically mark as wrong and move to next question/show result.
  
- **Scoring & Feedback:**
  - Instant feedback: Green for correct, Red for wrong immediately after selection.
  - **Result Screen:** Show Score (e.g., "8/10 question"), Time taken, and a "Review" list of wrong answers.

## 5. UI/UX Refinements
- **Theme:** Modern, clean, whitespace-heavy (Quizlet style).
- **Colors:** Primary Blue/Indigo.
- **Responsiveness:**
  - Flashcards must fit mobile screens without scrolling.
  - Buttons must be touch-friendly on mobile.
- **Animations:**
  - Smooth page transitions.
  - Progress bar animation for the timer.
  - Confetti effect on high score (optional).

## 6. Implementation Steps
2. Setup routing structure.
3. Build the Dashboard with Data fetching.
4. Build the Flashcard interaction.
5. Implement the Quiz logic (Timer, Randomizer, Scoring).
6. Polish UI with SCSS and Animations (if can and suitable).
7. Follow available package in this project