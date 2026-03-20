import { CATEGORIES, INITIAL_QUESTIONS, type Category } from "./questions";

export type InterviewMode = "deep-dive" | "quick-profile" | "specialized";

export interface QAPair {
  questionNumber: number;
  category: string;
  question: string;
  answer: string;
  isFollowUp: boolean;
}

export interface InterviewState {
  userName: string;
  mode: InterviewMode;
  currentCategoryIndex: number;
  currentQuestionInCategory: number;
  totalQuestionsAnswered: number;
  qaPairs: QAPair[];
  currentQuestion: string;
  isFollowUp: boolean;
  followUpCount: number;
  status: "not_started" | "onboarding" | "in_progress" | "completed";
}

const STORAGE_KEY = "voicedna-interview";

export function getInitialState(): InterviewState {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {}
  }
  return {
    userName: "",
    mode: "quick-profile",
    currentCategoryIndex: 0,
    currentQuestionInCategory: 0,
    totalQuestionsAnswered: 0,
    qaPairs: [],
    currentQuestion: INITIAL_QUESTIONS[CATEGORIES[0].id][0],
    isFollowUp: false,
    followUpCount: 0,
    status: "not_started",
  };
}

export function saveState(state: InterviewState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getCurrentCategory(state: InterviewState): Category {
  return CATEGORIES[state.currentCategoryIndex];
}

export function getCategoryProgress(state: InterviewState): { completed: number; total: number }[] {
  return CATEGORIES.map((cat) => {
    const answered = state.qaPairs.filter(
      (qa) => qa.category === cat.id && !qa.isFollowUp
    ).length;
    return { completed: answered, total: cat.questionCount };
  });
}

export function advanceToNextQuestion(state: InterviewState): InterviewState {
  const cat = CATEGORIES[state.currentCategoryIndex];
  const nextQInCat = state.currentQuestionInCategory + 1;
  const questions = INITIAL_QUESTIONS[cat.id];

  if (nextQInCat < questions.length && nextQInCat < cat.questionCount) {
    return {
      ...state,
      currentQuestionInCategory: nextQInCat,
      currentQuestion: questions[nextQInCat],
      isFollowUp: false,
      followUpCount: 0,
      totalQuestionsAnswered: state.totalQuestionsAnswered + 1,
    };
  }

  // Move to next category
  const nextCatIndex = state.currentCategoryIndex + 1;
  if (nextCatIndex < CATEGORIES.length) {
    const nextCat = CATEGORIES[nextCatIndex];
    const nextQuestions = INITIAL_QUESTIONS[nextCat.id];
    return {
      ...state,
      currentCategoryIndex: nextCatIndex,
      currentQuestionInCategory: 0,
      currentQuestion: nextQuestions[0],
      isFollowUp: false,
      followUpCount: 0,
      totalQuestionsAnswered: state.totalQuestionsAnswered + 1,
    };
  }

  // Interview complete
  return {
    ...state,
    totalQuestionsAnswered: state.totalQuestionsAnswered + 1,
    status: "completed",
  };
}

export function resetInterview(): InterviewState {
  localStorage.removeItem(STORAGE_KEY);
  return getInitialState();
}
