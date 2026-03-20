import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORIES, INITIAL_QUESTIONS, TOTAL_QUESTIONS } from "@/lib/questions";
import {
  type InterviewState,
  type QAPair,
  getInitialState,
  saveState,
  advanceToNextQuestion,
} from "@/lib/interview-store";
import { InterviewSidebar } from "@/components/interview/InterviewSidebar";
import { InterviewTopBar } from "@/components/interview/InterviewTopBar";
import { QuestionBubble } from "@/components/interview/QuestionBubble";
import { UserAnswerBubble } from "@/components/interview/UserAnswerBubble";
import { InputArea } from "@/components/interview/InputArea";

// Simulated follow-ups for demo
const FOLLOW_UPS = [
  "That feels a bit like a canned response. Let's push further — how exactly does that manifest in your sentence structure?",
  "Give me a specific example. When was the last time this showed up in something you wrote?",
  "I hear you, but that's what everyone says. What makes YOUR approach to this actually different?",
];

const Interview = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<InterviewState>(getInitialState);
  const [answer, setAnswer] = useState("");
  const [autoSaved, setAutoSaved] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === "not_started") {
      navigate("/");
    }
    if (state.status === "completed") {
      navigate("/completion");
    }
  }, [state.status, navigate]);

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Auto-save draft
  useEffect(() => {
    if (!answer.trim()) return;
    const t = setTimeout(() => setAutoSaved(true), 1500);
    return () => clearTimeout(t);
  }, [answer]);

  // Scroll to bottom on new question
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [state.qaPairs.length, state.currentQuestion]);

  const handleSubmit = useCallback(() => {
    if (!answer.trim()) return;

    const qa: QAPair = {
      questionNumber: state.totalQuestionsAnswered + 1,
      category: CATEGORIES[state.currentCategoryIndex].id,
      question: state.currentQuestion,
      answer: answer.trim(),
      isFollowUp: state.isFollowUp,
    };

    const newQaPairs = [...state.qaPairs, qa];

    // Simulate pushback: 30% chance, max 2 follow-ups
    const shouldFollowUp = state.followUpCount < 2 && Math.random() < 0.3 && !state.isFollowUp;

    if (shouldFollowUp) {
      const followUp = FOLLOW_UPS[Math.floor(Math.random() * FOLLOW_UPS.length)];
      setState({
        ...state,
        qaPairs: newQaPairs,
        currentQuestion: followUp,
        isFollowUp: true,
        followUpCount: state.followUpCount + 1,
      });
    } else {
      const next = advanceToNextQuestion({ ...state, qaPairs: newQaPairs });
      setState(next);
    }

    setAnswer("");
    setAutoSaved(false);
  }, [answer, state]);

  const handleSkip = useCallback(() => {
    const next = advanceToNextQuestion(state);
    setState(next);
    setAnswer("");
    setAutoSaved(false);
  }, [state]);

  const currentCategory = CATEGORIES[state.currentCategoryIndex];
  const categoryProgress = CATEGORIES.map((cat) => {
    const answered = state.qaPairs.filter((qa) => qa.category === cat.id && !qa.isFollowUp).length;
    return { completed: answered, total: cat.questionCount };
  });

  // Get recent Q&A for display (last 2 from current category)
  const recentQA = state.qaPairs.slice(-2);

  const wordCount = answer.split(/\s+/).filter(Boolean).length;

  return (
    <div className="h-screen flex bg-vd-paper overflow-hidden">
      {/* Sidebar */}
      <InterviewSidebar
        categories={CATEGORIES}
        currentCategoryIndex={state.currentCategoryIndex}
        categoryProgress={categoryProgress}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <InterviewTopBar
          category={currentCategory}
          questionNumber={state.totalQuestionsAnswered + 1}
          totalQuestions={TOTAL_QUESTIONS}
          isFollowUp={state.isFollowUp}
        />

        {/* Conversation area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 lg:px-16 py-6 space-y-4">
          {/* Previous Q&A */}
          {recentQA.map((qa, i) => (
            <div key={i} className={i < recentQA.length - 1 ? "opacity-55" : "opacity-55"}>
              <QuestionBubble question={qa.question} isFollowUp={qa.isFollowUp} />
              <UserAnswerBubble answer={qa.answer} />
            </div>
          ))}

          {recentQA.length > 0 && (
            <div className="border-t border-vd-border/50 my-4" />
          )}

          {/* Current question */}
          <div className="animate-fade-in">
            <QuestionBubble question={state.currentQuestion} isFollowUp={state.isFollowUp} />
          </div>
        </div>

        {/* Input area */}
        <InputArea
          answer={answer}
          onAnswerChange={setAnswer}
          onSubmit={handleSubmit}
          onSkip={handleSkip}
          isFollowUp={state.isFollowUp}
          autoSaved={autoSaved}
          wordCount={wordCount}
          placeholder={
            state.isFollowUp
              ? "Refine your response..."
              : "Type your response here..."
          }
        />
      </div>
    </div>
  );
};

export default Interview;
