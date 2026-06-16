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
import { PageFrame } from "@/components/layout/PageFrame";

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
    if (state.status === "not_started") navigate("/");
    if (state.status === "completed") navigate("/completion");
  }, [state.status, navigate]);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    if (!answer.trim()) return;
    const t = setTimeout(() => setAutoSaved(true), 1500);
    return () => clearTimeout(t);
  }, [answer]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
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
    const shouldFollowUp =
      state.followUpCount < 2 && Math.random() < 0.3 && !state.isFollowUp;

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
      setState(advanceToNextQuestion({ ...state, qaPairs: newQaPairs }));
    }

    setAnswer("");
    setAutoSaved(false);
  }, [answer, state]);

  const handleSkip = useCallback(() => {
    setState(advanceToNextQuestion(state));
    setAnswer("");
    setAutoSaved(false);
  }, [state]);

  const currentCategory = CATEGORIES[state.currentCategoryIndex];
  const categoryProgress = CATEGORIES.map((cat) => {
    const answered = state.qaPairs.filter(
      (qa) => qa.category === cat.id && !qa.isFollowUp,
    ).length;
    return { completed: answered, total: cat.questionCount };
  });

  const recentQA = state.qaPairs.slice(-2);
  const wordCount = answer.split(/\s+/).filter(Boolean).length;

  return (
    <PageFrame
      flush
      protocolTag={`VoiceDNA / Q.${String(
        state.totalQuestionsAnswered + 1,
      ).padStart(3, "0")}`}
      roomTag={currentCategory.name.toUpperCase()}
      refLabel={`SESSION · ${state.userName || "ANONYMOUS"}`}
    >
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <InterviewSidebar
          categories={CATEGORIES}
          currentCategoryIndex={state.currentCategoryIndex}
          categoryProgress={categoryProgress}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <InterviewTopBar
            category={currentCategory}
            questionNumber={state.totalQuestionsAnswered + 1}
            totalQuestions={TOTAL_QUESTIONS}
            isFollowUp={state.isFollowUp}
          />

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-6 md:px-12 lg:px-20 py-8 space-y-6"
          >
            {recentQA.map((qa, i) => (
              <div key={i} className="opacity-55 space-y-2">
                <QuestionBubble
                  question={qa.question}
                  isFollowUp={qa.isFollowUp}
                />
                <UserAnswerBubble answer={qa.answer} />
              </div>
            ))}

            {recentQA.length > 0 && (
              <div className="flex items-center gap-3 my-2">
                <div className="h-px flex-1 bg-vd-border" />
                <span className="font-mono-label text-[9px] tracking-[0.18em] text-vd-t3">
                  Current Question
                </span>
                <div className="h-px flex-1 bg-vd-border" />
              </div>
            )}

            <div className="animate-fade-in">
              <QuestionBubble
                question={state.currentQuestion}
                isFollowUp={state.isFollowUp}
              />
            </div>
          </div>

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
    </PageFrame>
  );
};

export default Interview;
